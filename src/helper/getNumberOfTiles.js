'use strict';

const determineGroundResolution = require(__dirname + '/determineGroundResolution.js');

/**
 * Calculates the number of tiles of a task.
 * 
 * @param {Object} options Task options (see example)
 * @returns {Number} Number of all tiles of this task
 * @example 
 * // task options
 * const task = {
 *   'task': {
 *     'area': {
 *       'bbox': {
 *         'xmin': 455000,
 *         'ymin': 5750000,
 *         'xmax': 479000,
 *         'ymax': 5774000
 *       }
 *     }
 *   },
 *   'tiles': {
 *     'maxSizePx': 2500,
 *     'gutterPx': 250,
 *     'resolutions': [
 *       {
 *         'id': 'id_of_groundResolution_10',
 *         'groundResolution': 10
 *       },
 *       {
 *         'id': 'id_of_resolution_25000',
 *         'scale': 25000,
 *         'dpi': 72
 *       }
 *     ]
 *   },
 *   'wms': [
 *     {
 *       'id': 'id_of_wms_stadtbezirke'
 *     }
 *   ]
 * };
 * 
 * // all tiles of this task
 * const count = getNumberOfTiles(task);
 * console.log(count); // 8
 */
function getNumberOfTiles(options) {

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

module.exports = getNumberOfTiles;