# wms-downloader

It allows you to download tiles of a Web Map Service (WMS).

To reduce the tiles use [merge-tiles](https://github.com/stadt-bielefeld/merge-tiles).

## Installation

### 01 NodeJS and NPM

Windows:
Use the installer [](https://nodejs.org/)

Ubuntu / Debian:

```sh
sudo apt install nodejs npm
```

### 02 GraphicsMagick

Windows:

Use the installer from [](http://www.graphicsmagick.org/)

Ubuntu / Debian:

```sh
sudo apt install graphicsmagick
```

### 03 wms-downloader

Use terminal:

```sh
npm i wms-downloader
```

## Get started

### Example

#### Download

```js
const downloader = require('wms-downloader');

let taskOptions = {
  "task" : {
    "id" : "id_of_my_first_download",
    "title" : "My first WMS download.",
    "format" : "image/png",
    "workspace" : "./tiles",
    "area" : {
      "bbox" : {
        "xmin" : 455000,
        "ymin" : 5750000,
        "xmax" : 479000,
        "ymax" : 5774000
      }
    }
  },
  "tiles" : {
    "maxSizePx" : 2500,
    "gutterPx" : 250,
    "resolutions" : [ {
      "id" : "id_of_resolution_25000",
      "scale" : 25000,
      "dpi" : 96
    } ]
  },
  "wms" : [ {
    "id" : "id_of_wms_stadtbezirke",
    "getmap" : {
      "url" : "http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&",
      "kvp" : {
        "SERVICE" : "WMS",
        "REQUEST" : "GetMap",
        "VERSION" : "1.3.0",
        "LAYERS" : "stadtbezirke_wms",
        "STYLES" : "",
        "CRS" : "EPSG:25832",
        "FORMAT" : "image/png",
        "TRANSPARENT" : "TRUE",
        "MAP_RESOLUTION" : 72
      }
    }
  } ]
};

// Init downloader
downloader.init({
  "request" : {
    "userAgent" : "wms-downloader",
    "timeout" : 30000
  }
});

// Print progress
const progressInterval = setInterval(() => {
  const progress = downloader.getProgress(taskOptions.task.id);
  console.log('Progress: ' + progress.percent + '%, Waiting time: ' + progress.waitingTime + ' ms');
}, 1000);

// Start download
downloader.startDownload(taskOptions, (err) => {

  // Stop progress printing
  clearInterval(progressInterval);

  if (err) {
    console.log(err);
  } else {
    console.log('Download was finished.');
  }

});
```

#### Download behind a proxy

```js
const downloader = require('wms-downloader');

const configOptions = {
  "request" : {
    "userAgent" : "wms-downloader",
    "timeout" : 30000,
    "proxy" : {
      "http" : {
        "host" : "10.208.20.71",
        "port" : 4239,
        "user" : "NameOfUser",
        "password" : "PasswordOfUser",
        "exclude" : [ "http://12.101.20.18/", "http://12.208.28.48/" ]
      }
    }
  }
};

const taskOptions = {
  "task" : {
    "id" : "id_of_my_first_download",
    "title" : "My first WMS download.",
    "format" : "image/png",
    "workspace" : "./tiles",
    "area" : {
      "bbox" : {
        "xmin" : 455000,
        "ymin" : 5750000,
        "xmax" : 479000,
        "ymax" : 5774000
      }
    }
  },
  "tiles" : {
    "maxSizePx" : 2500,
    "gutterPx" : 250,
    "resolutions" : [ {
      "id" : "id_of_resolution_25000",
      "scale": 25000,
            "dpi": 96
    } ]
  },
  "wms" : [ {
    "id" : "id_of_wms_stadtbezirke",
    "getmap" : {
      "url" : "http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&",
      "kvp" : {
        "SERVICE" : "WMS",
        "REQUEST" : "GetMap",
        "VERSION" : "1.3.0",
        "LAYERS" : "stadtbezirke_wms",
        "STYLES" : "",
        "CRS" : "EPSG:25832",
        "FORMAT" : "image/png",
        "TRANSPARENT" : "TRUE",
        "MAP_RESOLUTION" : 72
      }
    }
  } ]
};

// Init downloader
downloader.init(configOptions);


// Print progress
const progressInterval = setInterval(() => {
  const progress = downloader.getProgress(taskOptions.task.id);
  console.log('Progress: ' + progress.percent + '%, Waiting time: ' + progress.waitingTime + ' ms');
}, 1000);

// Start download
downloader.startDownload(taskOptions, (err) => {

  // Stop progress printing
  clearInterval(progressInterval);

  if (err) {
    console.log(err);
  } else {
    console.log('Download was finished.');
  }

});
```

## Supported formats

- image/png
- image/jpeg
- image/gif
- image/tiff

## Changlog

- [v1.0.0](docs/changelog/v1.0.0.md)

## Documentation

- [API](https://stadt-bielefeld.github.io/wms-downloader/docs/api/index.html)
- [Developer](docs/dev/index.md)
- [User](docs/user/index.md)

## License

MIT
