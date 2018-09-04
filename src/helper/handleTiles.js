'use strict';

const fs = require('fs-extra');
const getFormatDetails = require(__dirname + '/getFormatDetails.js');
const createWorldFile = require(__dirname + '/createWorldFile.js');
const createGetMap = require(__dirname + '/createGetMap.js');
const getRequestObject = require(__dirname + '/getRequestObject.js');
const cropTile = require(__dirname + '/cropTile.js');
const writeTile = require(__dirname + '/writeTile.js');
//writeWorldFile -> fs.writeFile(file, content, callback);


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
function handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, config, progress, callback) {

  // ID of tile (filename)
  let idOfTile = 'x' + xIdx + '_y' + yIdx;

  // Startpoint (top-left) of world file
  let tX0 = tiles.x0 + xIdx * tiles.sizeM;
  let tY0 = tiles.y0 - yIdx * tiles.sizeM;

  // MIN-Point (bottom-left) of gutter getmap
  let tX0Gutter = tX0 - tiles.gutterM;
  let tY0Gutter = (tY0 - tiles.sizeM) - tiles.gutterM;

  // MAX-Point (top-right) of gutter getmap
  let tXNGutter = (tX0 + tiles.sizeM) + tiles.gutterM;
  let tYNGutter = tY0 + tiles.gutterM;

  // GetMap parameters
  let bboxGetMap = tX0Gutter + ',' + tY0Gutter + ',' + tXNGutter + ',' + tYNGutter;
  let widthGetMap = options.tiles.maxSizePx;
  let heightGetMap = options.tiles.maxSizePx;

  // GetMap url
  let getMap = createGetMap(wms, bboxGetMap, widthGetMap, heightGetMap);

  // World file content
  let worldFile = createWorldFile(tX0, tY0, res);

  // Input format of WMS
  let inputFormatDetails = getFormatDetails(wms.getmap.FORMAT);

  // Output format of tile
  let outputFormatDetails = getFormatDetails(options.task.format);

  // Print GetMap url in terminal
  // console.log(getMap);

  // Filename of gutter tile
  let fileGutterTile = ws + '/' + idOfTile + '_gutter.' + inputFormatDetails.fileExt;

  // Filename of tile
  let fileTile = ws + '/' + idOfTile + '.' + outputFormatDetails.fileExt;

  // Write gutter tile
  writeTile(ws + '/' + idOfTile + '_gutter.' + inputFormatDetails.fileExt, getMap, getRequestObject(config, getMap), function (err, result) {

    // Error
    if (err) {
      // Tile could not be downloaded.

      // Call callback function with error.
      callback(err);
    } else {
      // No errors
      // Tile was downloaded

      // Crop tile
      cropTile(fileGutterTile, fileTile, tiles.sizePx, options.tiles.gutterPx, function (err) {

        // Error
        if (err) {
          // Tile could not be cropped

          // Call callback function with error.
          callback(err);
        } else {
          // No errors
          // File cropped

          // Delete old gutter tile
          fs.remove(fileGutterTile, function (err) {

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
              fs.writeFile(ws + '/' + idOfTile + '.' + outputFormatDetails.worldFileExt, worldFile, function (err) {

                // Error
                if (err) {
                  // File could not be written.

                  // Call callback function with error.
                  callback(err);
                } else {
                  // No errors
                  // World file was written

                  try {

                    if (progress[options.task.id]) {
                      progress[options.task.id].tilesCompleted++;
                      progress[options.task.id].lastTileDate = new Date();

                      if (progress[options.task.id].cancel) {
                        progress[options.task.id].cancelCallback(null);

                        throw new Error('The task "' + options.task.id + '" has been canceled.');
                      }
                    }

                    // NEXT TILE Raise x tile index
                    xIdx++;
                    if (xIdx < tiles.xCount) {

                      // Handle next tile in x direction
                      handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, config , progress, callback);
                    } else {
                      // Raise y tile index
                      yIdx++;
                      if (yIdx < tiles.yCount) {

                        // Set x tile index back to zero
                        xIdx = 0;

                        // Handle next tile in y direction
                        handleTiles(options, wms, ws, tiles, xIdx, yIdx, res, config , progress,  callback);
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

module.exports = handleTiles;