// This is basically a port of webdriver-test.py
// https://github.com/hugs/appium/blob/master/sample-code/webdriver-test.py
/*global describe:true, it:true */
"use strict";

var wd = require('wd')
  , assert = require("assert")
  , _ = require("underscore")
  , caps = {
      browserName: 'iOS'
      , platform: 'Mac'
      , version: '6.0'
    };

describe('load calc app', function() {

  var values = null;
  var populate = function(type, driver, cb) {
    values = [];
    driver.elementsByTagName('textField', function(err, elems) {
      var next = function(num) {
        if (num >= elems.length) {
          return cb(elems);
        }
        var val = Math.round(Math.random()*10);
        values.push(val);
        var elem = elems[num++];

        if (type === "elem") {
          elem.sendKeys(val, function() {
            next(num);
          });
        } else if (type == "driver") {
          elem.click(function() {
            driver.keys(val, function(){
              next(num);
            });
          });
        }
      };
      next(0);
    });
  };

  var computeAndCheck = function(done){
    driver.elementsByTagName('button', function(err, buttons) {
      buttons[0].click(function() {
        driver.elementsByTagName('staticText', function(err, elems) {
          elems[0].text(function(err, text) {
            var sum = values[0] + values[1];
            assert.equal(parseInt(text, 10), sum);
            driver.quit(function() {
              done();
            });
          });
        });
      });
    });
  };

  var driver = wd.remote('127.0.0.1', 4723);
  // using findElementsAndSetKeys
  it('should fill two fields with numbers', function(done) {
    driver.init(caps, function(err, sessionId) {
      populate("elem", driver, _.bind(computeAndCheck, this, done));
    });
  });
  // using sendKeysToActiveElement
  it('should fill two fields with numbers - sendKeys', function(done) {
    driver.init(caps, function(err, sessionId) {
      populate("driver", driver, _.bind(computeAndCheck, this, done));
    });
  });

  it('should confirm that button is displayed', function(done){
    driver.init(caps, function(err, sessionId){
      driver.elementsByTagName('textField', function(err, elems) {
        elems[0].displayed(function(err, value){
          assert.equal(value, true);
          driver.quit(function() {
            done();
          });
        });
      });
    });
  });

  // TODO: add a disabled button to the app so we can test it!
  // TODO: wd.js has no enabled method
  // it('should confirm that button is enabled', function(done){
  //   driver.init(caps, function(err, sessionId){
  //     driver.elementsByTagName('textField', function(err, elems) {
  //       elems[0].enabled(function(err, value){
  //         assert.equal(value, true);
  //         driver.quit(function() {
  //           done();
  //         });
  //       });
  //     });
  //   });
  // });

  it('should return app source', function(done){
    driver.init(caps, function(err, sessionId){
      driver.source(function(err, value) {
        assert.notEqual(value.indexOf("UIATextField"), -1);
        assert.notEqual(value.indexOf("UIAButton"), -1);
        assert.notEqual(value.indexOf("UIAStaticText"), -1);
        driver.quit(function() {
          done();
        });
      });
    });
  });

  return it('should interact with alert', function(done){
    driver.init(caps, function(err, sessionId){
      driver.elementsByTagName('button', function(err, buttons) {
        buttons[1].click(function() {
          driver.acceptAlert(function(){
            buttons[1].click(function() {
              driver.alertText(function(err, value){
                // maybe we could get alert body text too?
                assert.equal(value, "Cool title");
                driver.dismissAlert(function(){
                  driver.quit(function() {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

});
