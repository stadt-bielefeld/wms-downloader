'use strict';

const os = require('os');
const packageJson = require(__dirname + '/../package.json');
const start = require(__dirname + '/WMSDownloader/start.js');
const cancel = require(__dirname + '/WMSDownloader/cancel.js');
const getProgress = require(__dirname + '/WMSDownloader/getProgress.js');
const isValid = require(__dirname + '/helper/isValid.js');
const configSchema = require(__dirname + '/schemas/config.json');


const defaultOptions = {
  'request': {
    'userAgent': packageJson.name + '/' + packageJson.version + ' (' + os.platform() + ')',
    'timeout': 30000
  }
};

/**
 * Main class of this module.
 * @example
 * // create a WMSDownloader instance with default options
 * const WMSDownloader = require('wms-downloader');
 * const dl = new WMSDownloader();
 * 
 * // create a WMSDownloader instance with custom options
 * const WMSDownloader = require('wms-downloader');
 * const dl = new WMSDownloader({
 *  'request': {
 *    'userAgent': 'Mozilla/5.0 QGIS/2.18.3',
 *    'timeout': 30000,
 *    'proxy': {
 *      'http': {
 *        'host': '10.208.20.71',
 *        'port': 4239,
 *        'user': 'NameOfUser',
 *        'password': 'PasswordOfUser',
 *        'exclude': ['http://12.101.20.18/', 'http://12.208.28.48/']
 *      }
 *    }
 *  }
 * });
 */
class WMSDownloader {

  /**
   * 
   * @param {object} [options]
   */
  constructor(options) {

    // options are set
    if (options) {

      // validate the user options
      const valid = isValid(options, configSchema);

      // options are valid
      if (valid === true) {
        this.options = Object.assign(defaultOptions, options);
      } else {

        // options are not valid, throw an error
        let msg = '\n';
        valid.forEach((error)=>{
          msg += error.stack + '\n';
        });
        throw new Error(msg);

      }

    } else {
      // options are not set, set default options
      this.options = defaultOptions;
    }

    // set a empty progress object for all new tasks
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

  // TODO: Remove deprecated functions --------------------------------------------------------------
  /*
   * This function is deprecated please use the constructor (new WMSDownloader()).
   * @param {object} [options]
   * @deprecated
   */
  init(options) {
    console.log('The function init() is deprecated please use the constructor (new WMSDownloader())');

    // options are set
    if (options) {

      // validate the user options
      const valid = isValid(options, configSchema);

      // options are valid
      if (valid === true) {
        this.options = Object.assign(defaultOptions, options);
      } else {

        // options are not valid, throw an error
        let msg = '';
        valid.forEach((error)=>{
          msg += error.stack + '\n';
        });
        throw new Error(msg);
        
      }

    } else {
      // options are not set, set default options
      this.options = defaultOptions;
    }

    // set a empty progress object for all new tasks
    this.progress = {};
  }

  /*
   * This function is deprecated please use [start()]{@link WMSDownloader#start}.
   * @param {object} options
   * @param {function} callback Callback function like `function(err){}`
   * @deprecated
   */
  startDownload(options, callback) {
    console.log('The function startDownload() is deprecated please use start()');
    this.start(options, callback);
  }

  /*
   * This function is deprecated please use cancel().
   * @param {string} id ID of the task
   * @param {function} callback Callback function like `function(err){}`
   * @deprecated
   */
  cancelDownload(options, callback) {
    console.log('The function cancelDownload() is deprecated please use cancel()');
    this.cancel(options, callback);
  }
  // TODO: Remove deprecated functions --------------------------------------------------------------
}

module.exports = WMSDownloader;