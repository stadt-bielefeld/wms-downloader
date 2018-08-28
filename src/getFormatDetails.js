'use strict';

const	supportedFormats = require(__dirname + '/getSupportedFormats.js')();

function getFormatDetails(mimeType) {
    let int, f;

    // Iterate over all supported formats
    for (int = 0; int < supportedFormats.length; int++) {

        // Format entry
        f = supportedFormats[int];

        // Check mime type
        if (f.mimeType === mimeType) {

            // Return founded format
            return f;
        }
    }

    return null;
}

module.exports = getFormatDetails;