'use strict';

/**
 * Creates world file content.
 * 
 * @param {Number} x0 X value of start point (top-left)
 * @param {Number} y0 Y value of start point (top-left)
 * @param {Number} res Ground resolution
 * @returns {string} Content of world file
 * @example
 * const x0 = 458000;
 * const y0 = 5754000;
 * const res = 1;
 * 
 * let wordlFileContent = createWorldFile(x0, y0, res);
 * console.log(wordlFileContent);
 * // 1
 * // 0.0
 * // 0.0
 * // -1
 * // 458000.5
 * // 5753999.5
 */
function createWorldFile(x0, y0, res) {
  let halfPxInM = res / 2.0;
  let ret = res + '\n';
  ret += '0.0' + '\n';
  ret += '0.0' + '\n';
  ret += '-' + res + '\n';
  ret += x0 + halfPxInM + '\n';
  ret += y0 - halfPxInM;
  return ret;
}

module.exports = createWorldFile;