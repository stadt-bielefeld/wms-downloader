const downloader = require(__dirname + '/../../index.js');
//const downloader = require('wms-downloader');

let configOptions = {
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

// Init downloader
downloader.init(configOptions);

// Print progress
let progressInterval = setInterval(function() {
	let progress = downloader.getProgress(taskOptions.task.id);
	console.log('Progress: ' + progress.percent + '%, Waiting time: ' + progress.waitingTime + ' ms');
}, 1000);

// Start download
downloader.startDownload(taskOptions, function(err) {

	// Stop progress printing
	clearInterval(progressInterval);

	if (err) {
		console.log(err);
	} else {
		console.log('Download was finished.');
	}

});