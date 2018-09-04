'use strict';

function cancel(_this, taskId, callback){
  if (_this.progress[taskId]) {
    _this.progress[taskId].cancel = true;
    _this.progress[taskId].cancelCallback = callback;
  } else {
    callback({
      name: 'TaskNotExist',
      message: 'The task with id "' + taskId + '" does not exist.'
    });
  }
}

module.exports = cancel;