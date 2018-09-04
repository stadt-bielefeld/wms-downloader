'use strict';

// modules
const taskSchema = require(__dirname + '/../schemas/task.json');
const isValid = require(__dirname + '/../helper/isValid.js');
const handleTask = require(__dirname + '/../helper/handleTask.js');
const getCountOfTiles = require(__dirname + '/../helper/getCountOfTiles.js');

function start(_this, options, callback) {

  // validate task options
  let valid = isValid(options, taskSchema);

  // task options are valid
  if (valid == true) {

    // create progress entry for this task
    _this.progress[options.task.id] = {
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

      // execute the task
      handleTask(options, _this.options, _this.progress, (err) => {

        // remove progress entry on error or completion
        delete _this.progress[options.task.id];

        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });

    } catch (err) {
      // remove progress entry on error
      delete _this.progress[options.task.id];
      callback(err);
    }

  } else {
    callback(new Error('Task options are not valid.'));
  }

}

module.exports = start;