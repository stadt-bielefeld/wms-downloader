'use strict';

const createGetMap = require(__dirname + '/../../src/helper/createGetMap.js');

const wms = {
  'getmap': {
    'url': 'http://www.bielefeld01.de/geodaten/geo_dienste/wms.php?url=gebietsgliederung_wms_stadtbezirke_641&',
    'kvp': {
      'SERVICE': 'WMS',
      'VERSION': '1.3.0',
      'REQUEST': 'GetMap',
      'FORMAT': 'image/png',
      'TRANSPARENT': 'true',
      'LAYERS': 'stadtbezirke_wms',
      'CRS': 'EPSG:25832',
      'STYLES': ''
    }
  }
};

const width = 1048;
const height = 953;
const bbox = '458163.5475413472,5754265.480964899,478190.04895206343,5772476.602953842';

let getMapUrl = createGetMap(wms, bbox, width, height);
console.log(getMapUrl);
