'use strict';

const fs = require('fs-extra');
const handleWMS = require(__dirname + '/handleWMS.js');

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
function handleResolution(options, ws, resIdx, config, progress, callback) {

    // Resolution object
    let res = options.tiles.resolutions[resIdx];

    // Workspace of this resolutions
    let resWs;

    if (options.tiles.resolutions.length == 1) {
        resWs = ws;
    } else {
        resWs = ws + '/' + res.id;
    }

    // Create directory of resolution workspace
    fs.ensureDir(resWs, function (err) {
    // Error
        if (err) {
            // Directory could not be created.

            // Call callback function with error.
            callback(err);
        } else {
            // No errors

            // Handle all wms
            handleWMS(options, resWs, res, 0, config, progress, function (err) {

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
                        handleResolution(options, ws, resIdx, config, progress, callback);
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

module.exports = handleResolution;