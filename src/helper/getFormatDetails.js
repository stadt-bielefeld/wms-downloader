'use strict';

const getSupportedFormats = require(__dirname + '/getSupportedFormats.js');

/**
 * Returns format details of a supported image format (for example `image/png`).
 * @param {String} mimeType MIME-Type of a supported image format.
 * @returns {null|Object} Format details like `{'title':'PNG','fileExt':'png','worldFileExt':'pgw','mimeType':'image/png'}`
 * @example
 * console.log(getFormatDetails('image/png'));
 * //{'title':'PNG','fileExt':'png','worldFileExt':'pgw','mimeType':'image/png'}
 */
function getFormatDetails(mimeType) {

  const supportedFormats = getSupportedFormats();

  // Iterate over all supported formats
  for (let i = 0; i < supportedFormats.length; i++) {

    // Format entry
    const f = supportedFormats[i];

    // Check mime type
    if (f.mimeType === mimeType) {

      // Return founded format
      return f;
    }
  }

  return null;
}

module.exports = getFormatDetails;