# IEx in Browser

Project to have an IEx in your browser

Heavily inspired (aka copied a lot of the ideas from):

- [https://github.com/snaplet/postgres-wasm](https://github.com/snaplet/postgres-wasm)
- [https://github.com/iximiuz/docker-to-linux](https://github.com/iximiuz/docker-to-linux)
- [https://github.com/copy/v86](https://github.com/copy/v86)

All credit to these projects.

**NOTE** This is extremely janky, not to be taken seriously

## How to setup

1. `cd packages/image-builder`
2. `./build-container.sh`
3. `./build-state.js` # You need to login with root/root at the moment
4. `mv system ../server/priv/static/.`
5. `cd ../server`
6. `mix phx.server`

Now go to `http://localhost:4000/` and wait for the magic to happen

User and password are `root:root`
