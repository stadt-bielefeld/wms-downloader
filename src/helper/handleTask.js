'use strict';

const fs = require('fs-extra');
const handleResolution = require(__dirname + '/handleResolution.js');

/**
 * It handles a download task of Web Map Services.
 * 
 * @param {Object} options
 * @param {Object} config See options of the {@link WMSDownloader|WMSDownloader constructor} 
 * @param {Array} progress Array of the progress of all WMSDownloader tasks.
 * @param {Function} callback function(err){}
 */
function handleTask(options, config, progress, callback) {

  fs.ensureDir(options.task.workspace, (err) => {
    if (err) {
      // Call callback function with error.
      callback(err);
    } else {
      // Workspace of this task
      let ws = options.task.workspace + '/' + options.task.id;

      // Create directory of task workspace
      fs.ensureDir(ws, (err) => {

        // Error
        if (err) {
          // Directory could not be created.

          // Call callback function with error.
          callback(err);
        } else {
          // No errors

          // Handle all resolutions
          handleResolution(options, ws, 0, config, progress, (err) => {

            // Error
            if (err) {
              // It could not be handled all resolutions.

              // Call callback function with error.
              callback(err);
            } else {
              // No errors

              // Call callback function without errors. Task was
              // handled.
              callback(null);
            }
          });

        }
      });
    }
  });

}

module.exports = handleTask;