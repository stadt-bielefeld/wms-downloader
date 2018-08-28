'use strict';

/**
 * Creates a GetMap url.
 * 
 * @param {object}
 *          wms WMS object
 * @param {string}
 *          bbox Comma-separated bbox
 * @param {integer|string}
 *          width Width of bbox in pixel
 * @param {integer|string}
 *          height height of bbox in pixel
 * @returns {string} GetMap url
 */
function createGetMap(wms, bbox, width, height) {

    let getmap = wms.getmap.url;
    for (let key in wms.getmap.kvp) {
        getmap += key + '=' + wms.getmap.kvp[key] + '&';
    }

    getmap += 'BBOX=' + bbox + '&';
    getmap += 'WIDTH=' + width + '&';
    getmap += 'HEIGHT=' + height + '&';

    return getmap;
}

module.exports = createGetMap;