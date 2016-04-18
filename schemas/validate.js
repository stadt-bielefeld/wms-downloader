var Validator = require('jsonschema').Validator;
var v = new Validator();

//Load task schema
var taskSchema = require('./task.json');

//Load task options
var taskOptionsGroundResolution = require('../examples/json/taskOptionsGroundResolution.json');
var taskOptionsScale = require('../examples/json/taskOptionsScale.json');

//Validate task options
console.log(v.validate(taskOptionsGroundResolution, taskSchema).errors);
console.log(v.validate(taskOptionsScale, taskSchema).errors);


//Load config schema
var configSchema = require('./config.json');

//Load config options
var configOptions = require('../examples/json/configOptions.json');
var configOptionsProxy = require('../examples/json/configOptionsProxy.json');

//Validate config options
console.log(v.validate(configOptions, configSchema).errors);
console.log(v.validate(configOptionsProxy, configSchema).errors);