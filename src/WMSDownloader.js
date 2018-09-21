'use strict';

const os = require('os');
const packageJson = require(__dirname + '/../package.json');
const start = require(__dirname + '/WMSDownloader/start.js');
const cancel = require(__dirname + '/WMSDownloader/cancel.js');
const getProgress = require(__dirname + '/WMSDownloader/getProgress.js');
const isValid = require(__dirname + '/helper/isValid.js');
const getSupportedFormats = require(__dirname + '/helper/getSupportedFormats.js');
const configSchema = require(__dirname + '/schemas/config.json');


const defaultOptions = {
  'request': {
    'userAgent': packageJson.name + '/' + packageJson.version + ' (' + os.platform() + ')',
    'timeout': 30000
  }
};

/**
 * This is the main class of this module.
 * It allows you to download tiles of a Web Map Service (WMS).
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
 *  }js
 * });
 */
class WMSDownloader {

  /**
   * Returns all supported formats.
   * @example
   * console.log(WMSDownloader.SUPPORTED_FORMATS);
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
  static get SUPPORTED_FORMATS() {
    return getSupportedFormats();
  }

  /**
   * @param {object} [options] Config options of the WMSDownloader instance. See examples {@link https://github.com/stadt-bielefeld/wms-downloader/tree/master/examples|examples} and {@link https://github.com/stadt-bielefeld/wms-downloader/blob/master/src/schemas/config.json|json schema}.
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
        valid.forEach((error) => {
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
  * Starts a download task. Every download task runs always asynchronously.
  * @param {object} options Options of the task. See examples {@link https://github.com/stadt-bielefeld/wms-downloader/tree/master/examples|examples} and {@link https://github.com/stadt-bielefeld/wms-downloader/blob/master/src/schemas/task.json|json schema}.
  * @param {function} callback Callback function like `function(err){}`
  * @example
  * const WMSDownloader = require('wms-downloader');
  * 
  * const dl = new WMSDownloader();
  * 
  * const taskOptions = {
  *   'task': {
  *     'id': 'id_of_my_first_download',
  *     'title': 'My first WMS download.',
  *     'format': 'image/png',
  *     'workspace': __dirname + '/tiles',
  *     'area': {
  *       'bbox': {
  *         'xmin': 455000,
  *         'ymin': 5750000,
  *         'xmax': 479000,
  *         'ymax': 5774000
  *       }
  *     }
  *   },
  *   'tiles': {
  *     'maxSizePx': 2500,
  *     'gutterPx': 250,
  *     'resolutions': [{
  *       'id': 'id_of_resolution_10',
  *       'groundResolution': 10
  *     }]
  *   },
  *   'wms': [{
  *     'id': 'id_of_wms_stadtbezirke',
  *     'getmap': {
  *       'url': 'http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&',
  *       'kvp': {
  *         'SERVICE': 'WMS',
  *         'REQUEST': 'GetMap',
  *         'VERSION': '1.3.0',
  *         'LAYERS': 'stadtbezirke_wms',
  *         'STYLES': '',
  *         'CRS': 'EPSG:25832',
  *         'FORMAT': 'image/png',
  *         'TRANSPARENT': 'TRUE',
  *         'MAP_RESOLUTION': 72
  *       }
  *     }
  *   }]
  * };
  *
  * dl.start(taskOptions, (err) => {
  *   if (err) {
  *     console.log(err);
  *   } else {
  *     console.log('Finished');
  *   }
  * });
  */
  start(options, callback) {
    start(this, options, callback);
  }

  /**
  * Cancels a download task.
  * @param {string} id Id of the task
  * @param {function} callback Callback function like `function(err, id){}`
  * @example
  * const WMSDownloader = require('wms-downloader');
  * 
  * const dl = new WMSDownloader();
  * 
  * const taskOptions = {
  *   'task': {
  *     'id': 'id_of_my_first_download',
  *     'title': 'My first WMS download.',
  *     'format': 'image/png',
  *     'workspace': __dirname + '/tiles',
  *     'area': {
  *       'bbox': {
  *         'xmin': 455000,
  *         'ymin': 5750000,
  *         'xmax': 479000,
  *         'ymax': 5774000
  *       }
  *     }
  *   },
  *   'tiles': {
  *     'maxSizePx': 2500,
  *     'gutterPx': 250,
  *     'resolutions': [{
  *       'id': 'id_of_resolution_10',
  *       'groundResolution': 1
  *     }]
  *   },
  *   'wms': [{
  *     'id': 'id_of_wms_stadtbezirke',
  *     'getmap': {
  *       'url': 'http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&',
  *       'kvp': {
  *         'SERVICE': 'WMS',
  *         'REQUEST': 'GetMap',
  *         'VERSION': '1.3.0',
  *         'LAYERS': 'stadtbezirke_wms',
  *         'STYLES': '',
  *         'CRS': 'EPSG:25832',
  *         'FORMAT': 'image/png',
  *         'TRANSPARENT': 'TRUE',
  *         'MAP_RESOLUTION': 72
  *       }
  *     }
  *   }]
  * };
  * 
  * // start download
  * dl.start(taskOptions, (err) => {
  *   if (err) {
  *     console.log(err);
  *   } else {
  *     console.log('Download was finished.');
  *   }
  * });
  * 
  * // cancel download after 10 seconds
  * setTimeout(() => {
  *   dl.cancel('id_of_my_first_download',(err, id)=>{
  *     if(err){
  *       console.error(err);
  *     }else{
  *       console.log('Download "' + id + '" was canceled.');
  *     }
  *   });
  * }, 10000);
  */
  cancel(id, callback) {
    cancel(this, id, callback);
  }

  /**
  * Returns the progress of a download task.
  * @param {string} id Id of the task
  * @returns {object} See the `progress object` in the example.
  * @example
  * const WMSDownloader = require('wms-downloader');
  * 
  * const dl = new WMSDownloader();
  * 
  * const taskOptions = {
  *   'task': {
  *     'id': 'id_of_my_first_download',
  *     'title': 'My first WMS download.',
  *     'format': 'image/png',
  *     'workspace': __dirname + '/tiles',
  *     'area': {
  *       'bbox': {
  *         'xmin': 455000,
  *         'ymin': 5750000,
  *         'xmax': 479000,
  *         'ymax': 5774000
  *       }
  *     }
  *   },
  *   'tiles': {
  *     'maxSizePx': 2500,
  *     'gutterPx': 250,
  *     'resolutions': [{
  *       'id': 'id_of_resolution_10',
  *       'groundResolution': 1
  *     }]
  *   },
  *   'wms': [{
  *     'id': 'id_of_wms_stadtbezirke',
  *     'getmap': {
  *       'url': 'http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&',
  *       'kvp': {
  *         'SERVICE': 'WMS',
  *         'REQUEST': 'GetMap',
  *         'VERSION': '1.3.0',
  *         'LAYERS': 'stadtbezirke_wms',
  *         'STYLES': '',
  *         'CRS': 'EPSG:25832',
  *         'FORMAT': 'image/png',
  *         'TRANSPARENT': 'TRUE',
  *         'MAP_RESOLUTION': 72
  *       }
  *     }
  *   }]
  * };
  * 
  * // print progress
  * const progressInterval = setInterval(() => {
  * 
  *   // progress object
  *   const progress = dl.getProgress(taskOptions.task.id);
  *   // {
  *   //   'tiles': 144, // complete number of tiles
  *   //   'tilesCompleted': 4, // number of completed tiles
  *   //   'startDate': '2018-09-13T10:44:56.011Z', // start date (new Date())
  *   //   'lastTileDate': '2018-09-13T10:45:05.691Z', // completion date (new Date()) of the last tile
  *   //   'percent': 2.78, // progress in percent
  *   //   'waitingTime': 337196 // waiting time in ms
  *   // }
  * 
  *   console.log('Progress: ' + progress.percent + '%, Waiting time: ' + progress.waitingTime + ' ms');
  * 
  * }, 1000);
  * 
  * 
  * // start download
  * dl.start(taskOptions, (err) => {
  * 
  *   // stop progress printing
  *   clearInterval(progressInterval);
  *   
  *   if (err) {
  *     console.log(err);
  *   } else {
  *     console.log('Download was finished.');
  *   }
  * });
  * 
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
        valid.forEach((error) => {
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