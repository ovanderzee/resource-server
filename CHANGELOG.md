# Changelog

## [Unreleased]

- Unit tests
- ETag, Content-Length and other headers


## [0.4.0] - 2024-01-20

- Write certificate in the folder where stream-statics resides, instead of the current working directory
- Brief commandline arguments; numeric for port, http|http2|https for protocol and /^./ for root folder


## [0.3.0] - 2023-06-13

### Changed
- Silently generate https certificate when certificate is absent or expired
- Nicer demo, smaller package size


## [0.2.0] - 2023-06-08

### Added
- Opt-in to use mime-types package
- HTTPS and HTTP/2 support

### Changed
- Replace type variables with descriptions

### Fixed
- Fixed typings


## [0.1.0] - 2023-05-28

First release, serving HTTP/1.1
