'use strict';

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
	let halfPxInM = res / 2.0;
	let ret = res + "\n";
	ret += '0.0' + "\n";
	ret += '0.0' + "\n";
	ret += '-' + res + "\n";
	ret += x0 + halfPxInM + "\n";
	ret += y0 - halfPxInM;
	return ret;
}

module.exports = createWorldFile;