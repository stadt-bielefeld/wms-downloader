'use strict';

const xml2js = require('xml2js');
const fs = require('fs-extra');
const gm = require('gm');

/**
 * Crops a tile with the gutter size.
 * 
 * @param {String} oldFile File to be crop
 * @param {String} newFile New cropped file
 * @param {Number} tileSizePx Size of the new tile
 * @param {Number} gutterSizePx Size of gutter in the old tile
 * @param {Function} callback function(err) {}
 * @example
 * const oldFile = __dirname + '/cropTileOld.png';
 * const newFile = __dirname + '/cropTileNew.png';
 * const tileSizePx = 1000; // Size of the new tile
 * const gutterSizePx = 150;
 * 
 * cropTile(oldFile, newFile, tileSizePx, gutterSizePx, (err)=>{
 *   if(err){
 *     console.error(err);
 *   }else{
 *     console.log('Tile cropped!');
 *   }
 * });
 */
function cropTile(oldFile, newFile, tileSizePx, gutterSizePx, callback) {

  if (oldFile.endsWith('.svg') && newFile.endsWith('.svg')) {
    // vector images
    fs.readFile(oldFile, { encoding: 'utf8' }, (err, content) => {
      if (err) {
        callback(err);
      } else {

        const parser = new xml2js.Parser({ async: false });

        parser.parseString(content, (err, result) => {
          if (err) {
            callback(err);
          } else {
            const builder = new xml2js.Builder();
            try {

              const viewBox = result.svg['$'].viewBox.split(' ');
              for (let i = 0; i < viewBox.length; i++) {
                viewBox[i] = parseFloat(viewBox[i]);
              }

              viewBox[0] = viewBox[0] + gutterSizePx;
              viewBox[1] = viewBox[1] + gutterSizePx;
              viewBox[2] = viewBox[2] - gutterSizePx * 2;
              viewBox[3] = viewBox[3] - gutterSizePx * 2;

              result.svg['$'].viewBox = viewBox[0] + ' ' + viewBox[1] + ' ' + viewBox[2] + ' ' + viewBox[3];

              const xml = builder.buildObject(result);
              fs.writeFile(newFile, xml, { encoding: 'utf8' }, callback);
            } catch (err) {
              callback(err);
            }
          }
        });
      }
    });


  } else {

    // raster images (and from vector to raster image as well)
    let inExt = oldFile.substring(oldFile.length - 3, oldFile.length);
    let outExt = newFile.substring(newFile.length - 3, newFile.length);

    /*
     * The conversion from  to jpg and tif is wrong by default. The
     * transparency will convert to black. It is correct, if the transparency will
     * convert to white.
     * 
     * That will fixed with the following code.
     */
    if ((inExt == '' && outExt == 'jpg') || (inExt == '' && outExt == 'tif')) {
      gm(oldFile).flatten().background('white').crop(tileSizePx, tileSizePx, gutterSizePx, gutterSizePx).write(newFile, (err) => {
        callback(err);
      });
    } else {

      gm(oldFile).crop(tileSizePx, tileSizePx, gutterSizePx, gutterSizePx).write(newFile, (err) => {
        callback(err);
      });
    }
  }

}

module.exports = cropTile;