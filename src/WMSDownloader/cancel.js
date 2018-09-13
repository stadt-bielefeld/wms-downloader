'use strict';

function cancel(_this, id, callback){
  if (_this.progress[id]) {
    _this.progress[id].cancel = true;
    _this.progress[id].cancelCallback = callback;
  } else {
    callback(new Error('The download task with id "' + id + '" does not exist.'), id);
  }
}

module.exports = cancel;