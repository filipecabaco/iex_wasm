# Boot layer snowglobe adds on top of an app image so armless can run it: a kernel, an initramfs
# that mounts the root filesystem over 9p, OpenRC, and consoles.
#
# BASE is the app image (arm64 Alpine); snowglobe always passes it, and builds this for
# linux/arm64. linux-virt's kernel is an EFI zboot image, which armless unpacks.
ARG BASE=alpine:3.24.2
FROM ${BASE}

RUN apk add --no-cache openrc alpine-base agetty linux-virt linux-firmware-none

# hvc0 (virtio console) is what the browser shows: it runs the app via snowglobe-console.
# ttyS0 (serial) gets a root shell that build-state.mjs uses for housekeeping before the snapshot.
RUN sed -i '/^tty[0-9]/d' /etc/inittab && \
    echo 'ttyS0::respawn:/sbin/agetty --autologin root -s ttyS0 115200 vt100' >> /etc/inittab && \
    echo 'hvc0::respawn:/sbin/agetty --autologin root --noclear --noissue hvc0 xterm-256color' >> /etc/inittab && \
    echo "root:" | chpasswd && \
    # /etc/hostname is managed by Docker during the build, so set it the OpenRC way
    echo 'hostname="snowglobe"' > /etc/conf.d/hostname && \
    rm -f /etc/motd && touch /root/.hushlogin

# Login shells on hvc0 hand over to the app; when it exits, agetty respawns it
RUN echo '[ "$(tty)" = /dev/hvc0 ] && exec /usr/local/bin/snowglobe-console' > /etc/profile.d/zz-snowglobe-console.sh
COPY snowglobe-console /usr/local/bin/snowglobe-console

# https://wiki.alpinelinux.org/wiki/Alpine_Linux_in_a_chroot#Preparing_init_services
RUN for i in devfs dmesg mdev hwdrivers; do rc-update add $i sysinit; done && \
    for i in modules sysctl hostname bootmisc; do rc-update add $i boot; done && \
    rc-update add killprocs shutdown

# Loopback always: programs talk to themselves over 127.0.0.1 with or without a network (the
# Supabase example's services do, on a site built without one).
RUN printf 'auto lo\niface lo inet loopback\n' > /etc/network/interfaces && rc-update add networking boot

# Networking, only when the site asks for it: DHCP on the virtio NIC, which armless answers.
# HTTPS is terminated by armless's web relay with certificates from a CA made for this build: trust it in the
# system bundle and in the runtimes that keep their own (Node, Python's requests, Java).
ARG NETWORK=none
COPY snowglobe-ca.crt /usr/local/share/ca-certificates/snowglobe-sandbox.crt
RUN if [ "$NETWORK" = none ]; then rm /usr/local/share/ca-certificates/snowglobe-sandbox.crt; else \
      printf '\nauto eth0\niface eth0 inet dhcp\n' >> /etc/network/interfaces && \
      mkdir -p /etc/ssl/certs && \
      cat /usr/local/share/ca-certificates/snowglobe-sandbox.crt >> /etc/ssl/certs/ca-certificates.crt && \
      { echo 'export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt'; \
        echo 'export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt'; \
        echo 'export NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/snowglobe-sandbox.crt'; \
      } > /etc/profile.d/snowglobe-ca.sh && \
      if command -v keytool >/dev/null; then \
        keytool -importcert -noprompt -cacerts -storepass changeit -alias snowglobe-sandbox \
          -file /usr/local/share/ca-certificates/snowglobe-sandbox.crt >/dev/null || true; \
      fi; \
    fi

RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)

# Everything removed here is bytes the browser never has to download
RUN rm -rf /usr/share/doc /usr/share/man /var/cache/apk/* /lib/firmware/*
