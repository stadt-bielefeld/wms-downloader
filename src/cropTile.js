'use strict';

const gm = require('gm');

/**
 * Crops the tile on the basis of gutter.
 * 
 * @param {string}
 *          oldFile File to be crop
 * @param {string}
 *          newFile New cropped file
 * @param {integer}
 *          tileSizePx Size of the new file / new tile
 * @param {integer}
 *          gutterSizePx Size of gutter in old file / old tile
 * @param {function}
 *          callback function(err) {}
 */
function cropTile(oldFile, newFile, tileSizePx, gutterSizePx, callback) {
    let inExt = oldFile.substring(oldFile.length - 3, oldFile.length);
    let outExt = newFile.substring(newFile.length - 3, newFile.length);

    /*
	 * The conversion from png to jpg and tif is wrong by default. The
	 * transparency will convert to black. It is correct, if the transparency will
	 * convert to white.
	 * 
	 * That will fixed with the following code.
	 */
    if ((inExt == 'png' && outExt == 'jpg') || (inExt == 'png' && outExt == 'tif')) {
        gm(oldFile).flatten().background('white').crop(tileSizePx, tileSizePx, gutterSizePx, gutterSizePx).write(newFile, function (err) {
            callback(err);
        });
    } else {

        gm(oldFile).crop(tileSizePx, tileSizePx, gutterSizePx, gutterSizePx).write(newFile, function (err) {
            callback(err);
        });
    }

}

module.exports = cropTile;