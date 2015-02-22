'use strict';

var expect = require('chai').expect;
var urljson = require('../');

describe('UI State', function () {


  describe('encode', function () {


    it('should convert 1st level to query params', function () {
      expect(urljson.encode({
        first: 'string'
      })).to.equal('first=string');

      expect(urljson.encode({
        x: '1', y: 2
      })).to.equal('x=1&y=\\2');
    });


    it('should handle \\true', function () {
      expect(urljson.encode({
        first: true
      })).to.equal('first=\\true');

      expect(urljson.encode({
        first: {
          second: true
        }
      })).to.equal('first=second:\\true');

    });


    it('should handle \\false', function () {
      expect(urljson.encode({
        first: false
      })).to.equal('first=\\false');

      expect(urljson.encode({
        first: {
          second: false
        }
      })).to.equal('first=second:\\false');

    });


    it('should handle empty string', function () {

      expect(urljson.encode({
        first: ''
      })).to.equal('first=');

      expect(urljson.encode({
        first: {
          second: ''
        }
      })).to.equal('first=second:');

    });


    it('should handle \\null', function () {

      expect(urljson.encode({
        first: null
      })).to.equal('first=\\null');

      expect(urljson.encode({
        first: {
          second: null
        }
      })).to.equal('first=second:\\null');
    });


    it('should handle \\undefined', function () {

      expect(urljson.encode({
        first: undefined
      })).to.equal('first=\\undefined');

      expect(urljson.encode({
        first: {
          second: undefined
        }
      })).to.equal('first=second:\\undefined');

    });


    it('should convert 2nd level to simplified json', function () {
      expect(urljson.encode({
        first: {
          second: 'string'
        }
      })).to.equal('first=second:string');

      expect(urljson.encode({
        first: {
          x: '1', y: '2'
        }
      })).to.equal('first=x:1,y:2');
    });


    it('should throw on 3rd (and deeper) level', function () {
      expect(function () {
        return urljson.encode({
          first: {
            second: {
              third: 'string'
            }
          }
        });
      }).to.throw('Maximum allowed object depth is 2');

      expect(function () {
        return urljson.encode({
          first: {
            second: {
              third: {
                x: '1', y: '2'
              }
            }
          }
        });
      }).to.throw('Maximum allowed object depth is 2');

    });
  });


  describe('decode', function () {
    it('should convert 1st level to query params', function () {
      expect(urljson.decode('first=string')).to.deep.equal({
        first: 'string'
      });

      expect(urljson.decode('x=1&y=2')).to.deep.equal({
        x: '1', y: '2'
      });
    });


    it('should convert 2nd level to simplified json', function () {
      expect(urljson.decode('first=second:string')).to.deep.equal({
        first: {
          second: 'string'
        }
      });

      expect(urljson.decode('first=x:1,y:2')).to.deep.equal({
        first: {
          x: '1', y: '2'
        }
      });
    });


    it('should handle \\true', function () {
      expect(urljson.decode('first=\\true')).to.deep.equal({
        first: true
      });

      expect(urljson.decode('first=second:\\true')).to.deep.equal({
        first: {
          second: true
        }
      });
    });


    it('should handle \\false', function () {
      expect(urljson.decode('first=\\false')).to.deep.equal({
        first: false
      });

      expect(urljson.decode('first=second:\\false')).to.deep.equal({
        first: {
          second: false
        }
      });
    });


    it('should handle empty string', function () {

      expect(urljson.decode('first=')).to.deep.equal({
        first: ''
      });

      expect(urljson.decode('first=second:')).to.deep.equal({
        first: {
          second: ''
        }
      });
    });


    it('should handle \\null', function () {
      expect(urljson.decode('first=\\null')).to.deep.equal({
        first: null
      });

      expect(urljson.decode('first=second:\\null')).to.deep.equal({
        first: {
          second: null
        }
      });
    });


    it('should handle \\undefined', function () {
      expect(urljson.decode('first=\\undefined')).to.deep.equal({
        first: undefined
      });

      expect(urljson.decode('first=second:\\undefined')).to.deep.equal({
        first: {
          second: undefined
        }
      });
    });


    it('should handle numbers', function () {
      expect(urljson.decode('first=\\1')).to.deep.equal({
        first: 1
      });

      expect(urljson.decode('first=second:\\3.14')).to.deep.equal({
        first: {
          second: 3.14
        }
      });
    });

  });


  describe('2-way conversions equality', function () {


    it('should convert string -> json -> string', function () {
      var query;

      query = 'first=second:\\undefined';
      expect(urljson.encode(urljson.decode(query))).to.equal(query);

      query = 'first1=second:\\false&first2=x:1,y:2&first3=second1:\\null,second2:';
      expect(urljson.encode(urljson.decode(query))).to.equal(query);
    });


    it('should convert json -> string -> json', function () {
      var obj;

      obj = {
        x: '1234', y: 2345, z: {
          a: 1234, b: 'string', c: null, d: '', e: false, f: true, g: undefined
        }
      };
      expect(urljson.decode(urljson.encode(obj))).to.deep.equal(obj);
    });

  });


});
