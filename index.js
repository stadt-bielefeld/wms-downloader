var fs = require('fs');
var gm = require('gm');

/**
 * Object with progress information of all tasks.
 */
var progress = {};

/**
 * Object to check the task.json
 */
var input = require(__dirname + '/input.js');

/**
 * Config file.
 */
var config = {
	"request" : {
		"userAgent" : "wms-downloader",
		"timeout" : 30000,
		"proxy" : null
	}
};

/**
 * Request object from request module.
 */
var request; // Reqeust object without internet proxy
var requestProxy; // Request object with internet proxy

/**
 * Inits the wms-downloader.
 * 
 * @param {string}
 *          options Config options
 */
function init(options) {
	// Config options is set
	if (options) {
		config = options;
	} 

	// Init request object
	request = require('request').defaults({
		"headers" : {
			'User-Agent' : config.request.userAgent
		},
		strictSSL : false,
		timeout : config.request.timeout
	});

	// If internet proxy is set
	if (config.request.proxy) {

		// String of username and password
		var userPass = '';
		if (config.request.proxy.http.user) {
			if (config.request.proxy.http.password) {
				userPass = encodeURIComponent(config.request.proxy.http.user) + ':' + encodeURIComponent(config.request.proxy.http.password) + '@';
			}
		}

		// Init request object with internet proxy
		requestProxy = request.defaults({
			"headers" : {
				'User-Agent' : config.request.userAgent
			},
			strictSSL : false,
			timeout : config.request.timeout,
			"proxy" : 'http://' + userPass + config.request.proxy.http.host + ':' + config.request.proxy.http.port
		});
	}

};

/**
 * It starts the download of one or more Web Map Services.
 * 
 * @param {object}
 *          options task.json
 * @param callback
 *          function(err){}
 */
function startDownload(options, callback) {

	progress[options.task.id] = {
		"tiles" : getCountOfTiles(options),
		"tilesCompleted" : 0,
		"startDate" : new Date(),
		"lastTileDate" : null,
		"percent" : 0,
		"waitingTime" : 0,
		"cancel" : false,
		"cancelCallback" : null
	}

	try {
		input.checkOptions(options);

		handleTask(options, function(err) {
			delete progress[options.task.id];

			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});

	} catch (err) {
		delete progress[options.task.id];
		callback(err);
	}

}

/**
 * Returns the correct request object with the right proxy settings.
 * 
 * @param {string}
 *          url URL of tile
 * @returns {object} Object from request module (var request =
 *          require('request');)
 */
function getRequestObject(url) {
	var ret = request;

	if (config.request.proxy) {
		ret = requestProxy;
		for (var int = 0; int < config.request.proxy.http.exclude.length; int++) {
			if (url.includes(config.request.proxy.http.exclude[int])) {
				ret = request;
				break;
			}
		}
	}

	return ret;
}

/**
 * It handles a download task of Web Map Services.
 * 
 * @param {object}
 *          options
 * @param {function}
 *          callback function(err){}
 */
function handleTask(options, callback) {

	createDir(options.task.workspace, function(err) {
		if (err) {
			// Call callback function with error.
			callback(err);
		} else {
			// Workspace of this task
			var ws = options.task.workspace + '/' + options.task.id;

			// Create directory of task workspace
			createDir(ws, function(err) {

				// Error
				if (err) {
					// Directory could not be created.

					// Call callback function with error.
					callback(err);
				} else {
					// No errors

					// Handle all resolutions
					handleResolution(options, ws, 0, function(err) {

						// Error
						if (err) {
							// It could not be handled all resolutions.

							// Call callback function with error.
							callback(err);
						} else {
							// No errors

							// Call callback function without errors. Task was
							// handled.
							callback(null);
						}
					});

				}
			});
		}
	});

};

/**
 * It handles recursive all resolutions of a task.
 * 
 * @param {object}
 *          options
 * @param {string}
 *          ws Task workspace
 * @param {integer}
 *          resIdx Index of resolution
 * @param callback
 *          function(err){}
 */
function handleResolution(options, ws, resIdx, callback) {

	// Resolution object
	var res = options.tiles.resolutions[resIdx];

	// Workspace of this resolutions
	var resWs;

	if(options.tiles.resolutions.length == 1){
		resWs = ws;
	}else{
		resWs = ws + '/' + res.id;
	}
	
	// Create directory of resolution workspace
	createDir(resWs, function(err) {
		// Error
		if (err) {
			// Directory could not be created.

			// Call callback function with error.
			callback(err);
		} else {
			// No errors

			// Handle all wms
			handleWMS(options, resWs, res, 0, function(err) {

				// Error
				if (err) {
					// It could not be handled all wms.

					// Call callback function with error.
					callback(err);
				} else {
					// No errors

					// Raise resolution index
					resIdx++;

					// New resolution index exists
					if (resIdx < options.tiles.resolutions.length) {
						handleResolution(options, ws, resIdx, callback);
					} else {
						// New resolution index does not exists

						// Call callback function without errors. All resolution
						// were
						// handled.
						callback(null);
					}
				}

			});

		}
	});

}

/**
 * It handles recursive all Web Map Services of a resolution.
 * 
 * @param {object}
 *          options
 * @param {string}
 *          ws Resolution workspace
 * @param {objext}
 *          res Resolution object
 * @param {integer}
 *          wmsIdx Index of WMS
 * @param {function}
 *          callback function(err){}
 */
function handleWMS(options, ws, res, wmsIdx, callback) {

	// WMS object
	var wms = options.wms[wmsIdx];

	// Workspace of this WMS
	var wmsWs = ws;
	if (options.wms.length > 1) {
		wmsWs += '/' + wms.id;
	}

	// Create directory of WMS workspace
	createDir(wmsWs, function(err) {

		// Error
		if (err) {
			// Directory could not be created.

			// Call callback function with error.
			callback(err);
		} else {
			// No errors

			// Calculate parameters of bbox
			var bbox = {};
			bbox.widthM = options.task.area.bbox.xmax - options.task.area.bbox.xmin;
			bbox.heightM = options.task.area.bbox.ymax - options.task.area.bbox.ymin;
			bbox.widthPx = bbox.widthM / res.groundResolution;
			bbox.heightPx = bbox.heightM / res.groundResolution;

			// Calculate parameters of tiles
			var tiles = {};
			tiles.sizePx = options.tiles.maxSizePx - 2 * options.tiles.gutterPx;
			tiles.sizeM = tiles.sizePx * res.groundResolution;
			tiles.xCount = Math.ceil(bbox.widthPx / tiles.sizePx);
			tiles.yCount = Math.ceil(bbox.heightPx / tiles.sizePx);
			tiles.xSizeOverAllPx = tiles.xCount * tiles.sizePx;
			tiles.ySizeOverAllPx = tiles.yCount * tiles.sizePx;
			tiles.gutterM = options.tiles.gutterPx * res.groundResolution;
			tiles.x0 = options.task.area.bbox.xmin - (((tiles.xSizeOverAllPx - bbox.widthPx) / 2.0) * res.groundResolution);
			tiles.y0 = options.task.area.bbox.ymax + (((tiles.ySizeOverAllPx - bbox.heightPx) / 2.0) * res.groundResolution);

			// Handle all tiles
			handleTiles(options, wms, wmsWs, tiles, 0, 0, res.groundResolution, function(err) {

				// Error
				if (err) {
					// Could not handle tiles

					// Call callback function with error.
					callback(err);
				} else {
					// No errors

					// Raise wms index
					wmsIdx++;

					// Handle next WMS
					if (wmsIdx < options.wms.length) {
						handleWMS(options, ws, res, wmsIdx, callback);
					} else {
						// All WMS were handled

						// Call callback function without errors
						callback(null);
					}

				}
			});

		}
	});

}

/**
 * It handles recursive all tiles of a resolution of a Web Map Service.
 * 
 * @param {object}
 *          options
 * @param {object}
 *          wms WMS object
 * @param {string}
 *          ws WMS workspace
 * @param {object}
 *          tiles Object with tile parameters
 * @param {integer}
 *          xIdx X-Index of tile
 * @param {integer}
 *          yIdx Y-Index of tile
 * @param {float}
 *          res Ground resolution
 * @param {function}
 *          callback function(err){}
 */
function handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, callback) {

	// ID of tile (filename)
	var idOfTile = 'x' + xIdx + '_y' + yIdx;

	// Startpoint (top-left) of world file
	var tX0 = tiles.x0 + xIdx * tiles.sizeM;
	var tY0 = tiles.y0 - yIdx * tiles.sizeM;

	// MIN-Point (bottom-left) of gutter getmap
	var tX0Gutter = tX0 - tiles.gutterM;
	var tY0Gutter = (tY0 - tiles.sizeM) - tiles.gutterM;

	// MAX-Point (top-right) of gutter getmap
	var tXNGutter = (tX0 + tiles.sizeM) + tiles.gutterM;
	var tYNGutter = tY0 + tiles.gutterM;

	// GetMap parameters
	var bboxGetMap = tX0Gutter + ',' + tY0Gutter + ',' + tXNGutter + ',' + tYNGutter;
	var widthGetMap = options.tiles.maxSizePx;
	var heightGetMap = options.tiles.maxSizePx;

	// GetMap url
	var getMap = createGetMap(wms, bboxGetMap, widthGetMap, heightGetMap);

	// World file content
	var worldFile = createWorldFile(tX0, tY0, res);

	// Input format of WMS
	var inputFormatDetails = input.getFormatDetails(wms.getmap.FORMAT);

	// Output format of tile
	var outputFormatDetails = input.getFormatDetails(options.task.format);

	// Print GetMap url in terminal
	//console.log(getMap);

	// Filename of gutter tile
	var fileGutterTile = ws + '/' + idOfTile + '_gutter.' + inputFormatDetails.fileExt;

	// Filename of tile
	var fileTile = ws + '/' + idOfTile + '.' + outputFormatDetails.fileExt;

	// Write gutter tile
	writeTile(ws + '/' + idOfTile + '_gutter.' + inputFormatDetails.fileExt, getMap, getRequestObject(getMap), function(err, result) {

		// Error
		if (err) {
			// Tile could not be downloaded.

			// Call callback function with error.
			callback(err);
		} else {
			// No errors
			// Tile was downloaded

			// Crop tile
			cropTile(fileGutterTile, fileTile, tiles.sizePx, options.tiles.gutterPx, function(err) {

				// Error
				if (err) {
					// Tile could not be cropped

					// Call callback function with error.
					callback(err);
				} else {
					// No errors
					// File cropped

					// Delete old gutter tile
					deleteFile(fileGutterTile, function(err) {

						// Error
						if (err) {
							// File could not be deleted

							// Call callback function
							// with error.
							callback(err);
						} else {
							// No errors
							// File was deleted

							// Write world file
							writeWorldFile(ws + '/' + idOfTile + '.' + outputFormatDetails.worldFileExt, worldFile, function(err) {

								// Error
								if (err) {
									// File could not be written.

									// Call callback function with error.
									callback(err);
								} else {
									// No errors
									// World file was written

									try {
										progress[options.task.id].tilesCompleted++;
										progress[options.task.id].lastTileDate = new Date();

										if (progress[options.task.id].cancel) {
											progress[options.task.id].cancelCallback(null);

											throw new Error('The task "' + options.task.id + '" has been canceled.');
										}

										// NEXT TILE Raise x tile index
										xIdx++;
										if (xIdx < tiles.xCount) {

											// Handle next tile in x direction
											handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, callback);
										} else {
											// Raise y tile index
											yIdx++;
											if (yIdx < tiles.yCount) {

												// Set x tile index back to zero
												xIdx = 0;

												// Handle next tile in y direction
												handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, callback);
											} else {
												// All tiles were written.
												// Call callback function without errors
												callback(null);
											}
										}

									} catch (err) {
										callback(err);
									}
								}
							});

						}

					});

				}
			});

		}
	});

}

/**
 * Writes a world file.
 * 
 * @param {string}
 *          file Path to world file
 * @param {string}
 *          content Content of world file
 * @param {function}
 *          callback function(err){}
 */
function writeWorldFile(file, content, callback) {
	fs.writeFile(file, content, callback);
}

/**
 * Downloads and writes a tile.
 * 
 * @param {string}
 *          file Path where the tile is to be stored.
 * @param {string}
 *          url URL of tile
 * @param {object}
 *          request Object from request module (var request =
 *          require('request');)
 * @param {function}
 *          callback function(err,res){}
 */
function writeTile(file, url, request, callback) {
	// Result of request
	var res = null;

	// FileWriteStream
	var fileStream = fs.createWriteStream(file);

	// Register finish callback of FileWriteStream
	fileStream.on('finish', function() {
		callback(null, res);
	});

	// Register error callback of FileWriteStream
	fileStream.on('error', function(err) {
		callback(err, res);
	});

	// Request object
	var req = request.get(url);

	// Register error callback of request
	req.on('error', function(err) {
		callback(err, res);
	});

	// Register response callback of request
	req.on('response', function(response) {
		res = response;
	})

	// Start download
	req.pipe(fileStream);
}

/**
 * Crops the tile on the basis of gutter.
 * 
 * @param {string}
 *          oldFile File to be crop
 * @param {string}
 *          newFile New cropped file
 * @param {integer}
 *          tileSizePx Size of the new file / new tile
 * @param {integer}
 *          gutterSizePx Size of gutter in old file / old tile
 * @param {function}
 *          callback function(err) {}
 */
function cropTile(oldFile, newFile, tileSizePx, gutterSizePx, callback) {
	gm(oldFile).crop(tileSizePx, tileSizePx, gutterSizePx, gutterSizePx).write(newFile, function(err) {
		callback(err);
	});
};

/**
 * Merges/Composites two tiles.
 * 
 * @param {string}
 *          firstFile
 * @param {string}
 *          secondFile
 * @param {string}
 *          outputFile
 * @param {function}
 *          callback function(err) {}
 */
function compositeTiles(firstFile, secondFile, outputFile, callback) {
	gm(firstFile).composite(secondFile).geometry('+0+0').write(outputFile, function(err) {
		callback(err);
	});
}

/**
 * Deletes a file.
 * 
 * @param {string}
 *          file File to be deleted.
 * @param {function}
 *          callback function(err){}
 */
function deleteFile(file, callback) {
	fs.unlink(file, callback)
}

/**
 * Creates a new directory, if it does not exist.
 * 
 * @param {string}
 *          path Path of new directory
 * @param {function}
 *          callback function(err){}
 */
function createDir(path, callback) {
	// Check if workspace exists
	fs.stat(path, function(err, stats) {
		if (err) {
			// Workspace not exists
			// Create workspace dir
			fs.mkdir(path, function(err) {
				callback(err);
			});
		} else {
			// Workspace exists
			callback(null);
		}
	});
}

/**
 * Creates a GetMap url.
 * 
 * @param {object}
 *          wms WMS object
 * @param {string}
 *          bbox Comma-separated bbox
 * @param {integer|string}
 *          width Width of bbox in pixel
 * @param {integer|string}
 *          height height of bbox in pixel
 * @returns {string} GetMap url
 */
function createGetMap(wms, bbox, width, height) {

	var getmap = wms.getmap.url;
	for ( var key in wms.getmap.kvp) {
		getmap += key + '=' + wms.getmap.kvp[key] + '&';
	}

	getmap += 'BBOX=' + bbox + '&';
	getmap += 'WIDTH=' + width + '&';
	getmap += 'HEIGHT=' + height + '&';

	return getmap;
}

/**
 * Creates world file content.
 * 
 * @param {float}
 *          x0 X value of start point (top-left)
 * @param {float}
 *          y0 Y value of start point (top-left)
 * @param {float}
 *          res Ground resolution
 * @returns {String} Content of world file
 */
function createWorldFile(x0, y0, res) {
	var halfPxInM = res / 2.0;
	var ret = res + "\n";
	ret += '0.0' + "\n";
	ret += '0.0' + "\n";
	ret += '-' + res + "\n";
	ret += x0 + halfPxInM + "\n";
	ret += y0 - halfPxInM;
	return ret;
}

/**
 * Returns the progress of a task.
 * 
 * @taskId {string} ID of the task
 * @returns {object}
 */
function getProgress(taskId) {

	// Task exists
	if (progress[taskId]) {

		// Calculate the progress in percent
		progress[taskId].percent = Math.round(((progress[taskId].tilesCompleted * 100.0) / progress[taskId].tiles) * 100) / 100.0;

		// If completed tiles are available
		if (progress[taskId].tilesCompleted !== 0) {

			// Calculate the time difference between start of task and the last
			// completed tile
			var dif = progress[taskId].lastTileDate.getTime() - progress[taskId].startDate.getTime();

			// Calculate the time difference between current time and time of last
			// completed tile
			var dif2 = new Date().getTime() - progress[taskId].lastTileDate.getTime();

			// Calculate the waiting time in ms
			progress[taskId].waitingTime = Math.round((((100.0 - progress[taskId].percent) * dif) / progress[taskId].percent) - dif2);

			// Avoid negative waiting times
			if (progress[taskId].waitingTime < 0) {
				progress[taskId].waitingTime = 0;
			}

		} else {
			// No completed tiles are available

			// Can't calculate the waiting time.
			// Set waiting time to 0
			progress[taskId].waitingTime = 0;
		}

		// Return the progress object
		return progress[taskId];
	} else {
		// Task do not exists
		return null;
	}

}

/**
 * Calculates the count of tiles of a task.
 * 
 * @param {object}
 *          options Task options
 * @returns {Number}
 */
function getCountOfTiles(options) {

	input.checkOptions(options);

	// Counter of all tiles
	var countOfAllTiles = 0;

	// Calculate parameters of bbox
	var widthM = options.task.area.bbox.xmax - options.task.area.bbox.xmin;
	var heightM = options.task.area.bbox.ymax - options.task.area.bbox.ymin;

	// Iterate over all resolutions
	for (var int = 0; int < options.tiles.resolutions.length; int++) {

		// Current resolution
		var res = options.tiles.resolutions[int];

		// Size of all tiles in sum
		var widthPx = widthM / res.groundResolution;
		var heightPx = heightM / res.groundResolution;

		// Calculate tiles count of the current resolution
		var tiles = {};
		tiles.sizePx = options.tiles.maxSizePx - 2 * options.tiles.gutterPx;
		tiles.xCount = Math.ceil(widthPx / tiles.sizePx);
		tiles.yCount = Math.ceil(heightPx / tiles.sizePx);

		// Note tiles count of current resolution
		countOfAllTiles += tiles.xCount * tiles.yCount * options.wms.length;
	}

	return countOfAllTiles;
}

/**
 * Throws a cancel error in the download task.
 * 
 * @param {string}
 *          id Id of task
 * @param {function}
 *          callback
 */
function cancelDownload(taskId, callback) {
	if (progress[taskId]) {
		progress[taskId].cancel = true;
		progress[taskId].cancelCallback = callback;
	} else {
		callback({
			name : 'TaskNotExist',
			message : 'The task with id "' + taskId + '" does not exist.'
		});
	}

}

module.exports = {
	init : init,
	startDownload : startDownload,
	cancelDownload : cancelDownload,
	getProgress : getProgress
}
