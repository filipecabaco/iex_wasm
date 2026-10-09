# Boot layer snowglobe adds on top of an app image so v86 can run it: a kernel, an initramfs
# that mounts the root filesystem over 9p, OpenRC, and consoles. Based on upstream v86's
# tools/docker/alpine.
#
# BASE must be an i386 Alpine image (v86 emulates a 32-bit x86 CPU); snowglobe always passes it.
ARG BASE=i386/alpine:3.24.2
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

RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)

# Everything removed here is bytes the browser never has to download
RUN rm -rf /usr/share/doc /usr/share/man /var/cache/apk/* /lib/firmware/*
