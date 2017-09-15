# Nats Repl2

Docker image to launch a node repl container to help debug nats.

Using [nats-method][nats-method], [nats-method-ex][nats-method-ex] and [nats-event][nats-event] as helpers.

## Usage

First, launch the container

```
docker run --rm -it \
  -e NATS_URL=$nats-server-url \
  zhaoyao91/nats-repl2
```

or

```
docker run --rm -it \
  -e METHOD_NATS_URL=$method-nats-server-url \
  -e EVENT_NATS_URL=$event-nats-server-url \
  zhaoyao91/nats-repl2
```

Then you will be in a node repl with `method`, `methodEx` and `event` variables initialized.

See 
- [nats-method][nats-method]
- [nats-method-ex][nats-method-ex]
- [nats-event][nats-event]

## License

MIT

[nats-method]: https://github.com/zhaoyao91/nats-method
[nats-method-ex]: https://github.com/zhaoyao91/nats-method-ex
[nats-event]: https://github.com/zhaoyao91/nats-event