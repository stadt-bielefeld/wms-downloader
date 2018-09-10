'use strict';

const cropTile = require(__dirname + '/../../src/helper/cropTile.js');

const oldFile = __dirname + '/cropTileOld.png';
const newFile = __dirname + '/cropTileNew.png';
const tileSizePx = 1000; // Size of the new tile
const gutterSizePx = 150;

cropTile(oldFile, newFile, tileSizePx, gutterSizePx, (err)=>{
  if(err){
    console.error(err);
  }else{
    console.log('Tile cropped!');
  }
});