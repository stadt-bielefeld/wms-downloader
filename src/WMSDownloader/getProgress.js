'use strict';

function getProgress(_this, taskId) {

  // task exists
  if (_this.progress[taskId]) {

    // calculate the progress in percent
    _this.progress[taskId].percent = Math.round(((_this.progress[taskId].tilesCompleted * 100.0) / _this.progress[taskId].tiles) * 100) / 100.0;

    // if completed tiles are available
    if (_this.progress[taskId].tilesCompleted !== 0) {

      // calculate the time difference between start of task and the last
      // completed tile
      let dif = _this.progress[taskId].lastTileDate.getTime() - _this.progress[taskId].startDate.getTime();

      // calculate the time difference between current time and time of last
      // completed tile
      let dif2 = new Date().getTime() - _this.progress[taskId].lastTileDate.getTime();

      // calculate the waiting time in ms
      _this.progress[taskId].waitingTime = Math.round((((100.0 - _this.progress[taskId].percent) * dif) / _this.progress[taskId].percent) - dif2);

      // avoid negative waiting times
      if (_this.progress[taskId].waitingTime < 0) {
        _this.progress[taskId].waitingTime = 0;
      }

    } else {
      // no completed tiles are available
      // can't calculate the waiting time.
      // set waiting time to 0
      _this.progress[taskId].waitingTime = 0;
    }

    // return the progress object
    return _this.progress[taskId];
  } else {
    // task do not exists
    return null;
  }
}

module.exports = getProgress;