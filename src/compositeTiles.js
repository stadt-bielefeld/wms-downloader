'use strict';

const gm = require('gm');

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
    gm(firstFile).composite(secondFile).geometry('+0+0').write(outputFile, callback);
}

module.exports = compositeTiles;