#!/usr/bin/env bash
set -veu

IMAGES="$(dirname "$0")"/system
OUT_ROOTFS_TAR="$IMAGES"/image.tar
OUT_ROOTFS_FLAT="$IMAGES"/filesystem
OUT_FSJSON="$IMAGES"/filesystem.json

CONTAINER_NAME=debian-full
IMAGE_NAME=i386/debian-full

mkdir -p "$IMAGES"
docker build . --platform linux/386 --rm --tag "$IMAGE_NAME"
docker rm "$CONTAINER_NAME" || true
docker create --platform linux/386 -t -i --name "$CONTAINER_NAME" "$IMAGE_NAME" bash

docker export "$CONTAINER_NAME" > "$OUT_ROOTFS_TAR"

"$(dirname "$0")"/fs2json.py --out "$OUT_FSJSON" "$OUT_ROOTFS_TAR"

# Note: Not deleting old files here
mkdir -p "$OUT_ROOTFS_FLAT"
"$(dirname "$0")"/copy-to-sha256.py "$OUT_ROOTFS_TAR" "$OUT_ROOTFS_FLAT"

echo "$OUT_ROOTFS_TAR", "$OUT_ROOTFS_FLAT" and "$OUT_FSJSON" created.
rm $OUT_ROOTFS_TAR
