'use strict';

/*
 * Request object from request module.
 */
let request; // Reqeust object without internet proxy
let requestProxy; // Request object with internet proxy

/**
 * Returns the correct request object with the right proxy settings.
 * 
 * @param {String} url URL of tile
 * @returns {Object} Object from request module (let request = require('request');)
 */
function getRequestObject(config, url) {

  if (!request) {
    // Init request object
    request = require('request').defaults({
      'headers': {
        'User-Agent': config.request.userAgent
      },
      strictSSL: false,
      timeout: config.request.timeout
    });
  }

  if (!requestProxy) {
    // If internet proxy is set
    if (config.request.proxy) {

      // String of username and password
      let userPass = '';
      if (config.request.proxy.http.user) {
        if (config.request.proxy.http.password) {
          userPass = encodeURIComponent(config.request.proxy.http.user) + ':' + encodeURIComponent(config.request.proxy.http.password) + '@';
        }
      }

      // Init request object with internet proxy
      requestProxy = request.defaults({
        'headers': {
          'User-Agent': config.request.userAgent
        },
        strictSSL: false,
        timeout: config.request.timeout,
        'proxy': 'http://' + userPass + config.request.proxy.http.host + ':' + config.request.proxy.http.port
      });
    }

  }

  let ret = request;

  if (config.request.proxy) {
    ret = requestProxy;
    for (let int = 0; int < config.request.proxy.http.exclude.length; int++) {
      if (url.includes(config.request.proxy.http.exclude[int])) {
        ret = request;
        break;
      }
    }
  }

  return ret;
}

module.exports = getRequestObject;