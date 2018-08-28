'use strict';

// Load task schema
const taskSchema = require(__dirname + '/src/schemas/task.json');

// Load config schema
const configSchema = require(__dirname + '/src/schemas/config.json');

const isValid = require(__dirname + '/src/isValid.js');
const getCountOfTiles = require(__dirname + '/src/getCountOfTiles.js');
const handleTask = require(__dirname + '/src/handleTask.js');

/**
 * Object with progress information of all tasks.
 */
const progress = {};

/**
 * Config file.
 */
let config = {
    'request': {
        'userAgent': 'wms-downloader',
        'timeout': 30000
    }
};

/**
 * Inits the wms-downloader.
 * 
 * @param {string}
 *          options Config options
 */
function init(options) {

    let valid = isValid(options, configSchema);

    if (valid) {
        config = options;
    } else {
        // TODO
        console.log(valid);
    }

}

/**
 * It starts the download of one or more Web Map Services.
 * 
 * @param {object}
 *          options task.json
 * @param callback
 *          function(err){}
 */
function startDownload(options, callback) {

    // Validate options
    let valid = isValid(options, taskSchema);

    // Options are valid
    if (valid == true) {

        progress[options.task.id] = {
            'tiles': getCountOfTiles(options),
            'tilesCompleted': 0,
            'startDate': new Date(),
            'lastTileDate': null,
            'percent': 0,
            'waitingTime': 0,
            'cancel': false,
            'cancelCallback': null
        };

        try {

            handleTask(options, config, progress, function (err) {
                delete progress[options.task.id];

                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });

        } catch (err) {
            delete progress[options.task.id];
            callback(err);
        }

    } else {
        // Options are note valid
        // TODO Error
        console.log(valid);
    }

}

/**
 * Returns the progress of a task.
 * 
 * @taskId {string} ID of the task
 * @returns {object}
 */
function getProgress(taskId) {

    // Task exists
    if (progress[taskId]) {

        // Calculate the progress in percent
        progress[taskId].percent = Math.round(((progress[taskId].tilesCompleted * 100.0) / progress[taskId].tiles) * 100) / 100.0;

        // If completed tiles are available
        if (progress[taskId].tilesCompleted !== 0) {

            // Calculate the time difference between start of task and the last
            // completed tile
            let dif = progress[taskId].lastTileDate.getTime() - progress[taskId].startDate.getTime();

            // Calculate the time difference between current time and time of last
            // completed tile
            let dif2 = new Date().getTime() - progress[taskId].lastTileDate.getTime();

            // Calculate the waiting time in ms
            progress[taskId].waitingTime = Math.round((((100.0 - progress[taskId].percent) * dif) / progress[taskId].percent) - dif2);

            // Avoid negative waiting times
            if (progress[taskId].waitingTime < 0) {
                progress[taskId].waitingTime = 0;
            }

        } else {
            // No completed tiles are available

            // Can't calculate the waiting time.
            // Set waiting time to 0
            progress[taskId].waitingTime = 0;
        }

        // Return the progress object
        return progress[taskId];
    } else {
        // Task do not exists
        return null;
    }

}

/**
 * Throws a cancel error in the download task.
 * 
 * @param {string}
 *          id Id of task
 * @param {function}
 *          callback
 */
function cancelDownload(taskId, callback) {
    if (progress[taskId]) {
        progress[taskId].cancel = true;
        progress[taskId].cancelCallback = callback;
    } else {
        callback({
            name: 'TaskNotExist',
            message: 'The task with id "' + taskId + '" does not exist.'
        });
    }

}


/**
 * Returns the config options of the wms-downloader.
 * 
 * @returns {object} Config options of the wms-downloader
 */
function getConfig() {
    return config;
}

module.exports = {
    init: init,
    startDownload: startDownload,
    cancelDownload: cancelDownload,
    getRequestObject: require(__dirname + '/src/getRequestObject.js'),
    getProgress: getProgress,
    getConfig: getConfig
};
