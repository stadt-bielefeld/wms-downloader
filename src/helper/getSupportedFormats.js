'use strict';


const supportedFormats = [ {
  'title' : 'PNG',
  'fileExt' : 'png',
  'worldFileExt' : 'pgw',
  'mimeType' : 'image/png'
}, {
  'title' : 'PNG 8-Bit',
  'fileExt' : 'png',
  'worldFileExt' : 'pgw',
  'mime_type' : 'image/png; mode=8bit'
}, {
  'title' : 'JPG',
  'fileExt' : 'jpg',
  'worldFileExt' : 'jgw',
  'mimeType' : 'image/jpeg'
}, {
  'title' : 'GIF',
  'fileExt' : 'gif',
  'worldFileExt' : 'gfw',
  'mimeType' : 'image/gif'
}, {
  'title' : 'TIFF',
  'fileExt' : 'tif',
  'worldFileExt' : 'tfw',
  'mimeType' : 'image/tiff'
} ];

/**
 * 
 */
function getSupportedFormats(){
  return supportedFormats;
}

module.exports = getSupportedFormats;