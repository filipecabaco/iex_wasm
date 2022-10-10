# docker-to-linux - make bootable Linux disk image abusing Docker

**NOTE**: This is an altered version of this [great project](https://github.com/iximiuz/docker-to-linux). All kudos to [iximiuz](https://github.com/iximiuz)

There is no real goal behind this project. Just out of my curiosity what if:

- launch a base Linux container (debian, alpine, etc)
- pull in Linux kernel & init system (systemd, OpenRC, etc)
- dump container's filesystem to a disk image
- install bootloader (syslinux) to this image...

Then it should be probably possible to launch a ~~real~~ virtual machine with such an image!

Try it out:

```bash
# 1. Build the image.
#    Depending on your setup, you may need to preceed `make` with `sudo`.
make debian  # or ubuntu, or alpine

# 2. Clean up when you are done.
make clean
```

It works!

You can increase or decrease the size of the VM hard disk via the environment variable VM_DISK_SIZE_MB (1024 by default).
For example for a 3GB disk:

```
make debian VM_DISK_SIZE_MB=3072
```

Check out `Makefile` for more details or read my article on <a href="https://iximiuz.com/en/posts/from-docker-container-to-bootable-linux-disk-image/">iximiuz.com</a>.
