'use strict';

/**
 * Creates a full GetMap request from the following parameters.
 * 
 * @param {Object} wms Object with the GetMap base url and necessary key value pairs (kvp) like `{ 'getmap': { 'url':'http://', kvp: {'key': 'value' } } }`
 * @param {String} bbox BBOX of the GetMap request
 * @param {Number|String} width Width of the GetMap request
 * @param {Number|String} height Height of the GetMap request
 * @returns {String} Complete GetMap request
 * @example
 * const wms = {
 *   'getmap': {
 *     'url': 'http://www.bielefeld01.de/md/WMS/statistische_gebietsgliederung/02?',
 *     'kvp': {
 *       'SERVICE': 'WMS',
 *       'VERSION': '1.3.0',
 *       'REQUEST': 'GetMap',
 *       'FORMAT': 'image/png',
 *       'TRANSPARENT': 'true',
 *       'LAYERS': 'stadtbezirke_pl',
 *       'CRS': 'EPSG:25832',
 *       'STYLES': ''
 *     }
 *   }
 * };
 * 
 * const width = 1048;
 * const height = 953;
 * const bbox = '458163.5475413472,5754265.480964899,478190.04895206343,5772476.602953842';
 * 
 * let getMapUrl = createGetMap(wms, bbox, width, height);
 * console.log(getMapUrl);
 * //http://www.bielefeld01.de/md/WMS/statistische_gebietsgliederung/02?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=stadtbezirke_pl&CRS=EPSG:25832&STYLES=&BBOX=458163.5475413472,5754265.480964899,478190.04895206343,5772476.602953842&WIDTH=1048&HEIGHT=953&
 */
function createGetMap(wms, bbox, width, height) {

  let getmap = wms.getmap.url;
  for (let key in wms.getmap.kvp) {
    getmap += encodeURIComponent(key) + '=' + encodeURIComponent(wms.getmap.kvp[key]) + '&';
  }

  getmap += 'BBOX=' + encodeURIComponent(bbox) + '&';
  getmap += 'WIDTH=' + encodeURIComponent(width) + '&';
  getmap += 'HEIGHT=' + encodeURIComponent(height) + '&';

  return getmap;
}

module.exports = createGetMap;