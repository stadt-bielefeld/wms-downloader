'use strict';

const supportedFormats = require(__dirname + '/getSupportedFormats.js')();

/**
 * Returns format details of a supported image format (for example `image/png`).
 * @param {String} mimeType MIME-Type of a supported image format.
 * @returns {null|Object} Format details like `{'title':'PNG','fileExt':'png','worldFileExt':'pgw','mimeType':'image/png'}`
 * @example
 * console.log(getFormatDetails('image/png'));
 * //{'title':'PNG','fileExt':'png','worldFileExt':'pgw','mimeType':'image/png'}
 */
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