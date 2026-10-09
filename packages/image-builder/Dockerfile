# v86 emulates a 32-bit x86 CPU, so the guest must be i386.
# Based on upstream v86's tools/docker/alpine. Alpine still ships current Elixir/OTP and a small
# `virt` kernel for x86, and boots with OpenRC, which is much faster under emulation than systemd.
FROM i386/alpine:3.24.2

RUN apk add --no-cache openrc alpine-base agetty alpine-conf linux-virt linux-firmware-none elixir erlang28

# No VGA gettys: the browser talks to IEx over the virtio console (hvc0), and the build script
# drives a root shell on the serial port (ttyS0)
RUN sed -i '/^tty[0-9]/d' /etc/inittab && \
    echo 'ttyS0::respawn:/sbin/agetty --autologin root -s ttyS0 115200 vt100' >> /etc/inittab && \
    echo 'hvc0::respawn:/sbin/agetty --autologin root --noclear hvc0 xterm-256color' >> /etc/inittab && \
    echo "root:" | chpasswd && \
    # /etc/hostname is managed by Docker during the build, so set it the OpenRC way
    echo 'hostname="iex"' > /etc/conf.d/hostname

# Login shells on the virtio console go straight into IEx; exiting IEx respawns a fresh one
RUN printf '%s\n' \
    'export LANG=C.UTF-8' \
    'if [ "$(tty)" = /dev/hvc0 ]; then clear; exec iex; fi' \
    > /root/.profile

# https://wiki.alpinelinux.org/wiki/Alpine_Linux_in_a_chroot#Preparing_init_services
RUN for i in devfs dmesg mdev hwdrivers; do rc-update add $i sysinit; done && \
    for i in modules sysctl hostname bootmisc; do rc-update add $i boot; done && \
    rc-update add killprocs shutdown

# initramfs that can mount the root filesystem over 9p (the v86 host filesystem)
RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)

# Everything removed here is bytes the browser never has to download
RUN rm -rf /usr/share/doc /usr/share/man /var/cache/apk/* /lib/firmware/*
