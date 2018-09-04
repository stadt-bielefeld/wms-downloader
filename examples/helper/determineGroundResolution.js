const determineGroundResolution = require(__dirname + '/../../src/helper/determineGroundResolution.js');

const res = [ {'dpi': 72, 'scale': 5000 },  {'dpi': 72, 'scale': 10000 } ];

determineGroundResolution(res);
console.log(res);
// [ { dpi: 72, scale:  5000, groundResolution: 1.7638888888888888 },
//   { dpi: 72, scale: 10000, groundResolution: 3.5277777777777777 } ]