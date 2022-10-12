# IEx in Browser

Project to have an IEx in your browser

Heavily inspired (aka copied a lot of the ideas from):

- [https://github.com/snaplet/postgres-wasm](https://github.com/snaplet/postgres-wasm)
- [https://github.com/iximiuz/docker-to-linux](https://github.com/iximiuz/docker-to-linux)
- [https://github.com/copy/v86](https://github.com/copy/v86)

All credit to these projects.

**NOTE** This is extremely janky, not to be taken seriously

## How to setup

1. `cd packages/docker-to-linux`
2. `make debian`
3. `mv debian.img ../server/priv/static/rom_images/.`
4. `docker system prune`
5. `cd ../server`
6. `mix phx.server`

Now go to `http://localhost:4000/` and wait for the magic to happen

User and password are `root:root`
