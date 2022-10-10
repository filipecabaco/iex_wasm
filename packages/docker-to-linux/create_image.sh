#!/bin/bash

set -e

UID_HOST=$1
GID_HOST=$2
VM_DISK_SIZE_MB=$3

echo_blue() {
    local font_blue="\033[94m"
    local font_bold="\033[1m"
    local font_end="\033[0m"

    echo -e "\n${font_blue}${font_bold}${1}${font_end}"
}

echo_blue "[Create disk image]"
[ -z "${VM_DISK_SIZE_MB}" ] && VM_DISK_SIZE_MB=1024
VM_DISK_SIZE_SECTOR=$(expr $VM_DISK_SIZE_MB \* 1024 \* 1024 / 512)
dd if=/dev/zero of=/os/${DISTR}.img bs=${VM_DISK_SIZE_SECTOR} count=512

echo_blue "[Make partition]"
echo "type=83,bootable" | sfdisk /os/${DISTR}.img

echo_blue "\n[Format partition with ext4]"
losetup -D
LOOPDEVICE=$(losetup -f)
echo -e "\n[Using ${LOOPDEVICE} loop device]"
losetup -o $(expr 512 \* 2048) ${LOOPDEVICE} /os/${DISTR}.img
mkfs.ext4 ${LOOPDEVICE}

echo_blue "[Copy ${DISTR} directory structure to partition]"
mkdir -p /os/mnt
mount -t auto ${LOOPDEVICE} /os/mnt/
cp -a /os/${DISTR}.dir/. /os/mnt/

echo_blue "[Create ${DISTR} auto startup]"
mkdir /os/mnt/etc/systemd/system/getty@tty1.service.d
echo "[Service]" > /os/mnt/etc/systemd/system/getty@tty1.service.d/autologin.conf
echo "ExecStart=" >> /os/mnt/etc/systemd/system/getty@tty1.service.d/autologin.conf
echo "ExecStart=-/sbin/agetty -o '-p -f -- \\u' --noclear --autologin root %I $TERM" >> /os/mnt/etc/systemd/system/getty@tty1.service.d/autologin.conf

echo_blue "[Setup extlinux]"
extlinux --install /os/mnt/boot/
cp /os/${DISTR}/syslinux.cfg /os/mnt/boot/syslinux.cfg
rm /os/mnt/.dockerenv

echo_blue "[Unmount]"
umount /os/mnt
losetup -D

echo_blue "[Write syslinux MBR]"
dd if=/usr/lib/syslinux/mbr/mbr.bin of=/os/${DISTR}.img bs=440 count=1 conv=notrunc

[ "${UID_HOST}" -a "${GID_HOST}" ] && chown ${UID_HOST}:${GID_HOST} /os/${DISTR}.img

rm -r /os/${DISTR}.dir
