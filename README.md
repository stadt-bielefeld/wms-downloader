# wms-downloader

It allows you to download tiles of a Web Map Service (WMS).

To reduce the tiles use [merge-tiles](https://github.com/stadt-bielefeld/merge-tiles).

## Installation

### 01 NodeJS and NPM

**Windows:**

Use the installer [https://nodejs.org/](https://nodejs.org/)

**Ubuntu/Debian:**

```sh
sudo apt install nodejs npm
```

### 02 GraphicsMagick

**Windows:**

Use the installer from [http://www.graphicsmagick.org/](http://www.graphicsmagick.org/)

**Ubuntu/Debian:**

```sh
sudo apt install graphicsmagick
```

### 03 wms-downloader

```sh
npm i wms-downloader
```

## Getting started

[Show examples](examples)

## Supported formats

- image/png
- image/jpeg
- image/gif
- image/tiff
- image/svg+xml (experimental)

## Changlog

- [v1.1.0](docs/changelog/v1.1.0.md)
- [v1.0.0](docs/changelog/v1.0.0.md)

## Documentation

- [API documentation](https://stadt-bielefeld.github.io/wms-downloader/docs/api/index.html)

**Build api documentation:**

```bash
npm run build-api-doc
```

## License

MIT
