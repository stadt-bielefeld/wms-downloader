'use strict';

const supportedFormats = [{
  'title': 'PNG',
  'fileExt': 'png',
  'worldFileExt': 'pgw',
  'mimeType': 'image/png'
}, {
  'title': 'PNG 8-Bit',
  'fileExt': 'png',
  'worldFileExt': 'pgw',
  'mime_type': 'image/png; mode=8bit'
}, {
  'title': 'JPG',
  'fileExt': 'jpg',
  'worldFileExt': 'jgw',
  'mimeType': 'image/jpeg'
}, {
  'title': 'GIF',
  'fileExt': 'gif',
  'worldFileExt': 'gfw',
  'mimeType': 'image/gif'
}, {
  'title': 'TIFF',
  'fileExt': 'tif',
  'worldFileExt': 'tfw',
  'mimeType': 'image/tiff'
},
//SVG support: experimental
{
  'title': 'SVG',
  'fileExt': 'svg',
  'worldFileExt': 'sgw',
  'mimeType': 'image/svg+xml'
}];

/**
 * Returns an array with all supported formats
 * @returns {Array<Object>} Array of all supported formats like `[{'title':'PNG','fileExt':'png','worldFileExt':'pgw','mimeType':'image/png'}]`
 * @example
 * console.log(getSupportedFormats());
 * //[ { title: 'PNG',
 * //    fileExt: 'png',
 * //    worldFileExt: 'pgw',
 * //    mimeType: 'image/png' },
 * //  { title: 'PNG 8-Bit',
 * //    fileExt: 'png',
 * //    worldFileExt: 'pgw',
 * //    mime_type: 'image/png; mode=8bit' },
 * //  { title: 'JPG',
 * //    fileExt: 'jpg',
 * //    worldFileExt: 'jgw',
 * //    mimeType: 'image/jpeg' },
 * //  { title: 'GIF',
 * //    fileExt: 'gif',
 * //    worldFileExt: 'gfw',
 * //    mimeType: 'image/gif' },
 * //  { title: 'TIFF',
 * //    fileExt: 'tif',
 * //    worldFileExt: 'tfw',
 * //    mimeType: 'image/tiff' },
 * //  { title: 'SVG',
 * //    fileExt: 'svg',
 * //    worldFileExt: 'sgw',
 * //    mimeType: 'image/svg+xml' } ]
 */
function getSupportedFormats() {
  return supportedFormats;
}

module.exports = getSupportedFormats;