'use strict';

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
	gm(firstFile).composite(secondFile).geometry('+0+0').write(outputFile, function (err) {
		callback(err);
	});
}

module.exports = compositeTiles;