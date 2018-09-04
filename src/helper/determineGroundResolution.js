'use strict';

/**
 * Calculates the ground resolution from scale and dpi.
 * If `groundResolution` is not set, it will be calculated and set into the array.
 * 
 * @param {Array<Object>} res Resolutions defined with scales like `[ {'dpi': 72, 'scale': 5000 },  {'dpi': 72, 'scale': 10000 } ]`
 * @example
 * const res = [ {'dpi': 72, 'scale': 5000 },  {'dpi': 72, 'scale': 10000 } ];
 * 
 * determineGroundResolution(res);
 * console.log(res);
 * // [ { dpi: 72, scale:  5000, groundResolution: 1.7638888888888888 },
 * //   { dpi: 72, scale: 10000, groundResolution: 3.5277777777777777 } ]
 */
function determineGroundResolution(res) {
  
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