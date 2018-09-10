'use strict';

const isValid = require(__dirname + '/../../src/helper/isValid.js');

const json1 = { name: 'VW Golf', price: 10000 }; // valid
const json2 = { name: 'VW Passat', price: '20000 EUR'}; // invalid

const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'price': {
      'type': 'number'
    }
  },
  'required': [
    'name',
    'price'
  ]
};

const validationJson1 = isValid(json1, schema);
if (validationJson1 === true) {
  console.log('json1 is valid.');
} else {
  console.log('json1 is invalid.');
}

const validationJson2 = isValid(json2, schema);

if (validationJson2 === true) {
  console.log('json2 is valid.');
} else {
  console.log('json2 is invalid.');
  console.log(validationJson2);
}