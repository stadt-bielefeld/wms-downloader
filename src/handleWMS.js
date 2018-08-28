'use strict';

const fs = require('fs-extra');
const handleTiles = require(__dirname + '/handleTiles.js');

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
function handleWMS(options, ws, res, wmsIdx, config, progress, callback) {

    // WMS object
    let wms = options.wms[wmsIdx];

    // Workspace of this WMS
    let wmsWs = ws;
    if (options.wms.length > 1) {
        wmsWs += '/' + wms.id;
    }

    // Create directory of WMS workspace
    fs.ensureDir(wmsWs, function (err) {

        // Error
        if (err) {
            // Directory could not be created.

            // Call callback function with error.
            callback(err);
        } else {
            // No errors

            // Calculate parameters of bbox
            let bbox = {};
            bbox.widthM = options.task.area.bbox.xmax - options.task.area.bbox.xmin;
            bbox.heightM = options.task.area.bbox.ymax - options.task.area.bbox.ymin;
            bbox.widthPx = bbox.widthM / res.groundResolution;
            bbox.heightPx = bbox.heightM / res.groundResolution;

            // Calculate parameters of tiles
            let tiles = {};
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
            handleTiles(options, wms, wmsWs, tiles, 0, 0, res.groundResolution, config, progress, function (err) {

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
                        handleWMS(options, ws, res, wmsIdx, config, progress,  callback);
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


module.exports = handleWMS;