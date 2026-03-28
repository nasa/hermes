# yamcs-http

Rust client library for the [YAMCS](https://yamcs.org) (Yet Another Mission Control System) HTTP/REST API.

## Features

- Complete HTTP/REST API client for YAMCS
- Support for multiple authentication methods (JWT, client certificates, none)
- WebSocket support for real-time subscriptions (with `websocket` feature)
- Comprehensive type definitions for all YAMCS API objects
- Async/await using `tokio` and `reqwest`
- Request interceptors for custom authentication flows

## Contributing

This crate is part of the Hermes ground data system project. Contributions are welcome!

## License

See the main Hermes repository for license information.

## Resources

- [YAMCS Documentation](https://docs.yamcs.org/)
- [YAMCS REST API Reference](https://docs.yamcs.org/yamcs-http-api/)
- [Hermes Project](https://github.com/nasa/hermes)
