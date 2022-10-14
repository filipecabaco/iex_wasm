FROM i386/debian:sid-slim

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && \
    apt --yes --no-install-recommends install \
    linux-image-686 grub2 systemd \
    libterm-readline-perl-perl \
    gcc libc6-dev \
    unzip bzip2 xz-utils \
    libc-l10n locales \
    && \
    touch /root/.Xdefaults && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    locale-gen \
    chsh -s /bin/bash && \
    echo "root:root" | chpasswd && \
    echo "iex" > "/root/.bashrc" && \
    mkdir -p /etc/systemd/system/serial-getty@ttyS0.service.d/ && \
    systemctl enable serial-getty@ttyS0.service && \
    rm /lib/systemd/system/getty.target.wants/getty-static.service && \
    rm /etc/motd /etc/issue && \
    systemctl disable systemd-timesyncd.service && \
    systemctl disable apt-daily.timer && \
    systemctl disable apt-daily-upgrade.timer && \
    systemctl disable dhcpcd.service && \
    echo "tmpfs /tmp tmpfs nodev,nosuid 0 0" >> /etc/fstab
RUN apt --yes install elixir
COPY getty-noclear.conf getty-override.conf /etc/systemd/system/getty@tty1.service.d/
COPY getty-autologin-serial.conf /etc/systemd/system/serial-getty@ttyS0.service.d/
COPY logind.conf /etc/systemd/logind.conf
COPY boot-9p /etc/initramfs-tools/scripts/boot-9p

# this needs to be commented out in order to boot from hdd
RUN printf '%s\n' 9p 9pnet 9pnet_virtio virtio virtio_ring virtio_pci | tee -a /etc/initramfs-tools/modules && \
    echo 'BOOT=boot-9p' | tee -a /etc/initramfs-tools/initramfs.conf && \
    update-initramfs -u

RUN apt-get --yes clean && \
    rm -r /var/lib/apt/lists/* && \
    rm -r /usr/share/doc/* && \
    rm -r /usr/share/man/* && \
    rm /var/log/*.log /var/log/lastlog /var/log/wtmp /var/log/apt/*.log /var/log/apt/*.xz
