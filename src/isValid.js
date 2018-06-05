'use strict';

const Validator = require('jsonschema').Validator;
const v = new Validator();

function isValid(options, schema) {
  
	if (options) {
		if (schema) {

			// Validate
			let err = v.validate(options, schema).errors;
			if (err.length == 0) {
				// All ok
				return true;
			} else {
				// Errors
				return err;
			}
		}
	}
}

module.exports = isValid;