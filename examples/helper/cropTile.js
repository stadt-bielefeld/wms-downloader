'use strict';

const cropTile = require(__dirname + '/../../src/helper/cropTile.js');

const oldFile = __dirname + '/cropTileOld.png';
const newFile = __dirname + '/cropTileNew.png';
const tileSizePx = 1000; // Size of the new tile
const gutterSizePx = 150; // Gutter of the old tile

cropTile(oldFile, newFile, tileSizePx, gutterSizePx, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('PNG-Tile cropped!');
  }
});

// SVG (experimental)
const oldFileSVG = __dirname + '/cropTileVectorOld.svg';
const newFileSVG = __dirname + '/cropTileVectorNew.svg';
const tileSizePxSVG = 1000; // Size of the new tile
const gutterSizePxSVG = 150;
cropTile(oldFileSVG, newFileSVG, tileSizePxSVG, gutterSizePxSVG, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('SVG-Tile cropped!');
  }
});