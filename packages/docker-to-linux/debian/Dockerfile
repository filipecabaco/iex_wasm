FROM i386/debian:bullseye-slim
LABEL com.iximiuz-project="docker-to-linux"
RUN apt-get -y update
RUN apt-get -y install --no-install-recommends \
    linux-image-686 \
    systemd-sysv \
    elixir
RUN echo "root:root" | chpasswd
