'use strict';


var querystring = require('querystring');


function encoder(key, value) {

  if (typeof value === 'number') {
    return ['\\', value].join('');
  }

  if (value === true) {
    return '\\true';
  }
  if (value === false) {
    return '\\false';
  }
  if (value === null) {
    return '\\null';
  }
  if (value === undefined) {
    return '\\undefined';
  }

  return value;
}

function decoder(value) {
  var parsed;

  if (value === '\\true') {
    return true;
  }

  if (value === '\\false') {
    return false;
  }

  if (value === '\\null') {
    return null;
  }

  if (value === '\\undefined') {
    return undefined;
  }

  if (value.substr(0, 1) === '\\') {
    parsed = parseFloat(value.substr(1));
    if (String(parsed) === value.substr(1)) {
      return parsed;
    }
  }

  return value;
}

function passThrough(value) {
  return value;
}


function decode(query) {
  var obj = querystring.decode(query, '&', '=', {decodeURIComponent: decoder});

  Object.keys(obj).forEach(function (key) {
    if (typeof(obj[key]) === 'string' && obj[key].match(/\:/)) {
      obj[key] = querystring.decode(obj[key], ',', ':', {decodeURIComponent: decoder});
    }
  });

  return obj;
}


function encode(obj) {

  obj = JSON.parse(JSON.stringify(obj, encoder));

  Object.keys(obj).forEach(function (key) {
    if (obj[key] !== null && typeof obj[key] === 'object') {

      Object.keys(obj[key]).forEach(function (key2) {
        if (obj[key][key2] !== null && typeof obj[key][key2] === 'object') {
          throw new Error('Maximum allowed object depth is 2');
        }
      });

      obj[key] = querystring.stringify(obj[key], ',', ':', {encodeURIComponent: passThrough});
    }
  });

  return querystring.stringify(obj, '&', '=', {encodeURIComponent: passThrough});

}

exports.decode = decode;
exports.encode = encode;
