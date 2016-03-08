# wms-downloader

## Installation

### 01 NodeJS and NPM

Windows: 
Use the installer from https://nodejs.org/

Ubuntu / Debian:
```sh
sudo apt-get install nodejs npm
```

### 02 GraphicsMagick

Windows: 
Use the installer from http://www.graphicsmagick.org/

Ubuntu / Debian:
```sh
sudo apt-get install graphicsmagick
```


### 03 wms-downloader
Use terminal:
```sh
npm install wms-downloader
```


## Get started

### Example

#### Without proxy
```js
var downloader = require('wms-downloader');

var taskOptions = {
	"task" : {
		"id" : "id_of_my_first_download",
		"title" : "My first WMS download.",
		"format" : "image/png",
		"workspace" : "D:/data/workspace",
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
			"id" : "id_of_resolution_10",
			"groundResolution" : 10
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

downloader.init();

downloader.download(taskOptions, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Download was finished.');
	}
});
```

#### With proxy
```js
var downloader = require('wms-downloader');

var configOptions = {
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

var taskOptions = {
	"task" : {
		"id" : "id_of_my_first_download",
		"title" : "My first WMS download.",
		"format" : "image/png",
		"workspace" : "D:/data/workspace",
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
			"id" : "id_of_resolution_10",
			"scale": 25000,
            "dpi": 72
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

downloader.init(configOptions);

downloader.download(taskOptions, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Download was finished.');
	}
});
```

## Supported formats

  - image/png
  - image/png; mode=8bit"
  - image/jpeg
  - image/gif
  - image/tiff


License
----

MIT
