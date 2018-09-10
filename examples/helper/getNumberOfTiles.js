'use strict';

const getNumberOfTiles = require(__dirname + '/../../src/helper/getNumberOfTiles.js');

// task options
const task = {
  'task': {
    'area': {
      'bbox': {
        'xmin': 455000,
        'ymin': 5750000,
        'xmax': 479000,
        'ymax': 5774000
      }
    }
  },
  'tiles': {
    'maxSizePx': 2500,
    'gutterPx': 250,
    'resolutions': [
      {
        'id': 'id_of_groundResolution_10',
        'groundResolution': 10
      },
      {
        'id': 'id_of_resolution_25000',
        'scale': 25000,
        'dpi': 72
      }
    ]
  },
  'wms': [
    {
      'id': 'id_of_wms_stadtbezirke'
    }
  ]
};

// all tiles of this task
const count = getNumberOfTiles(task);
console.log(count); // 8
