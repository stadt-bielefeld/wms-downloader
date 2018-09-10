'use strict';

// modules
const taskSchema = require(__dirname + '/../schemas/task.json');
const isValid = require(__dirname + '/../helper/isValid.js');
const handleTask = require(__dirname + '/../helper/handleTask.js');
const getNumberOfTiles = require(__dirname + '/../helper/getNumberOfTiles.js');

function start(_this, options, callback) {

  // validate task options
  let valid = isValid(options, taskSchema);

  // task options are valid
  if (valid == true) {

    // create progress entry for this task
    _this.progress[options.task.id] = {
      'tiles': getNumberOfTiles(options),
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
    // options are not valid, throw an error
    let msg = '';
    valid.forEach((error) => {
      msg += error.stack + '\n';
    });
    callback(new Error(msg));
  }

}

module.exports = start;