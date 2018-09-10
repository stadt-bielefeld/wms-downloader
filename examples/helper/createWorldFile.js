'use strict';

const createWorldFile = require(__dirname + '/../../src/helper/createWorldFile.js');

const x0 = 458000;
const y0 = 5754000;
const res = 1;

let wordlFileContent = createWorldFile(x0, y0, res);
console.log(wordlFileContent);
// 1
// 0.0
// 0.0
// -1
// 458000.5
// 5753999.5