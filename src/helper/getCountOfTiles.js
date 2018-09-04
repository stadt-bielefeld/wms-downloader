'use strict';

const determineGroundResolution = require(__dirname + '/determineGroundResolution.js');

/**
 * Calculates the count of tiles of a task.
 * 
 * @param {object}
 *          options Task options
 * @returns {Number}
 */
function getCountOfTiles(options) {

  // Determine ground resolution if scale is only set
  determineGroundResolution(options.tiles.resolutions);

  // Counter of all tiles
  let countOfAllTiles = 0;

  // Calculate parameters of bbox
  let widthM = options.task.area.bbox.xmax - options.task.area.bbox.xmin;
  let heightM = options.task.area.bbox.ymax - options.task.area.bbox.ymin;

  // Iterate over all resolutions
  for (let int = 0; int < options.tiles.resolutions.length; int++) {

    // Current resolution
    let res = options.tiles.resolutions[int];

    // Size of all tiles in sum
    let widthPx = widthM / res.groundResolution;
    let heightPx = heightM / res.groundResolution;

    // Calculate tiles count of the current resolution
    let tiles = {};
    tiles.sizePx = options.tiles.maxSizePx - 2 * options.tiles.gutterPx;
    tiles.xCount = Math.ceil(widthPx / tiles.sizePx);
    tiles.yCount = Math.ceil(heightPx / tiles.sizePx);

    // Note tiles count of current resolution
    countOfAllTiles += tiles.xCount * tiles.yCount * options.wms.length;
  }

  return countOfAllTiles;
}

module.exports = getCountOfTiles;