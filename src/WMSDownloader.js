'use strict';

const start = require(__dirname + '/WMSDownloader/start.js');
const cancel = require(__dirname + '/WMSDownloader/cancel.js');
const getProgress = require(__dirname + '/WMSDownloader/getProgress.js');

/**
 * aa
 */
class WMSDownloader {

  /**
   * 
   */
  constructor(options) {
    this.options = options;
    this.progress = {};
  }

  /**
   * Starts a download.
   * @param {object} options
   * @param {function} callback Callback function like `function(err){}`
   */
  start(options, callback) {
    start(this, options, callback);
  }

  /**
   * Cancels a download.
   * @param {string} id ID of the task
   * @param {function} callback Callback function like `function(err){}`
   */
  cancel(id, callback) {
    cancel(this, id, callback);
  }

  /**
   * Returns the progress of a download.
   * @param {string} id 
   * @returns {object} aaa
   */
  getProgress(id) {
    return getProgress(this, id);
  }

}

module.exports = WMSDownloader;