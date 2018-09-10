'use strict';

const getSupportedFormats = require(__dirname + '/../../src/helper/getSupportedFormats.js');

console.log(getSupportedFormats());
//[ { title: 'PNG',
//    fileExt: 'png',
//    worldFileExt: 'pgw',
//    mimeType: 'image/png' },
//  { title: 'PNG 8-Bit',
//    fileExt: 'png',
//    worldFileExt: 'pgw',
//    mime_type: 'image/png; mode=8bit' },
//  { title: 'JPG',
//    fileExt: 'jpg',
//    worldFileExt: 'jgw',
//    mimeType: 'image/jpeg' },
//  { title: 'GIF',
//    fileExt: 'gif',
//    worldFileExt: 'gfw',
//    mimeType: 'image/gif' },
//  { title: 'TIFF',
//    fileExt: 'tif',
//    worldFileExt: 'tfw',
//    mimeType: 'image/tiff' },
//  { title: 'SVG',
//    fileExt: 'svg',
//    worldFileExt: 'sgw',
//    mimeType: 'image/svg+xml' } ]