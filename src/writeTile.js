'use strict';

const fs = require('fs-extra');

/**
 * Downloads and writes a tile.
 * 
 * @param {string}
 *          file Path where the tile is to be stored.
 * @param {string}
 *          url URL of tile
 * @param {object}
 *          request Object from request module (let request =
 *          require('request');)
 * @param {function}
 *          callback function(err, res){}
 */
function writeTile(file, url, request, callback) {
    // Result of request
    let res = null;

    // FileWriteStream
    let fileStream = fs.createWriteStream(file);

    // Register finish callback of FileWriteStream
    fileStream.on('finish', function () {
        callback(null, res);
    });

    // Register error callback of FileWriteStream
    fileStream.on('error', function (err) {
        callback(err, res);
    });

    // Request object
    let req = request.get(url);

    // Register error callback of request
    req.on('error', function (err) {
        callback(err, res);
    });

    // Register response callback of request
    req.on('response', function (response) {
        res = response;
    });

    // Start download
    req.pipe(fileStream);
}

module.exports = writeTile;