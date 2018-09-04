'use strict';

/**
 * Calculates the ground resolution from scale and dpi.
 * This function set the variable options.tiles.resolutions[].groundResolution
 * 
 * @param {number} options.tiles.resolutions[].dpi DPI/PPI 
 * @param {number} options.tiles.resolutions[].scale Scale
 */
function determineGroundResolution(options) {

  //resolution array
  let res = options.tiles.resolutions;
  
  //iterate over all resolutions
  for (let int = 0; int < res.length; int++) {
    let r = res[int];

    //calculate the resolution if not available
    if (!r.groundResolution) {
      r.groundResolution = (0.0254 * r.scale) / r.dpi;
    }
  }
}

module.exports = determineGroundResolution;