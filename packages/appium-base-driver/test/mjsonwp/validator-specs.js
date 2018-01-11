// transpile:mocha

import { validators } from '../../lib/mjsonwp/validators';
import chai from 'chai';
import BaseDriver from "../../lib/basedriver/driver";


chai.should();

describe('MJSONWP', () => {
  describe('direct to driver', () => {

    describe('setUrl', () => {
      it('should fail when no url passed', async () => {
        (() => {validators.setUrl();}).should.throw(/url/i);
      });
      it('should fail when given invalid url', async () => {
        (() => {validators.setUrl('foo');}).should.throw(/url/i);
      });
      it('should succeed when given url starting with http', async () => {
        (() => {validators.setUrl('http://appium.io');}).should.not.throw();
      });
      it('should succeed when given an android-like scheme', async () => {
        (() => {validators.setUrl('content://contacts/people/1');}).should.not.throw();
      });
      it('should succeed with hyphens dots and plus chars in the scheme', async () => {
        (() => {validators.setUrl('my-app.a+b://login');}).should.not.throw();
      });
      it('should succeed when given an about scheme', async () => {
        (() => {validators.setUrl('about:blank');}).should.not.throw();
      });
      it('should succeed when given a data scheme', async () => {
        (() => {validators.setUrl('data:text/html,<html></html>');}).should.not.throw();
      });
    });
    describe('implicitWait', () => {
      it('should fail when given no ms', async () => {
        (() => {validators.implicitWait();}).should.throw(/ms/i);
      });
      it('should fail when given a non-numeric ms', async () => {
        (() => {validators.implicitWait("five");}).should.throw(/ms/i);
      });
      it('should fail when given a negative ms', async () => {
        (() => {validators.implicitWait(-1);}).should.throw(/ms/i);
      });
      it('should succeed when given an ms of 0', async () => {
        (() => {validators.implicitWait(0);}).should.not.throw();
      });
      it('should succeed when given an ms greater than 0', async () => {
        (() => {validators.implicitWait(100);}).should.not.throw();
      });
    });
    describe('asyncScriptTimeout', () => {
      it('should fail when given no ms', async () => {
        (() => {validators.asyncScriptTimeout();}).should.throw(/ms/i);
      });
      it('should fail when given a non-numeric ms', async () => {
        (() => {validators.asyncScriptTimeout("five");}).should.throw(/ms/i);
      });
      it('should fail when given a negative ms', async () => {
        (() => {validators.asyncScriptTimeout(-1);}).should.throw(/ms/i);
      });
      it('should succeed when given an ms of 0', async () => {
        (() => {validators.asyncScriptTimeout(0);}).should.not.throw();
      });
      it('should succeed when given an ms greater than 0', async () => {
        (() => {validators.asyncScriptTimeout(100);}).should.not.throw();
      });
    });
    describe('timeouts', () => {
      it('should fail when given no ms', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'page load', ms: undefined});}).should.throw(/ms/i);
      });
      it('should fail when given a non-numeric ms', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'page load', ms: 'five'});}).should.throw(/ms/i);
      });
      it('should fail when given a negative ms', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'page load', ms: -1});}).should.throw(/ms/i);
      });
      it('should succeed when given an ms of 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'page load', ms: 0});}).should.not.throw();
      });
      it('should succeed when given an ms greater than 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'page load', ms: 100});}).should.not.throw();
      });
      it('should not allow an invalid timeout type', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.MJSONWP, type: 'foofoo', ms: 100});}).should.throw(/'foofoo'/);
      });
      it('should fail when given a non-numeric scriptDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: 'one', pageLoad: undefined, implicit: undefined});}).should.throw(/ms/i);
      });
      it('should fail when given a non-numeric pageLoadDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: 'one', implicit: undefined});}).should.throw(/ms/i);
      });
      it('should fail when given a non-numeric implicitDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: undefined, implicit: 'one'});}).should.throw(/ms/i);
      });
      it('should fail when given a negative scriptDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: -1, pageLoad: undefined, implicit: undefined});}).should.throw(/ms/i);
      });
      it('should fail when given a negative pageLoadDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: -1, implicit: undefined});}).should.throw(/ms/i);
      });
      it('should fail when given a negative implicitDuration', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: undefined, implicit: -1});}).should.throw(/ms/i);
      });
      it('should succeed when given scriptDuration of 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: 0, pageLoad: undefined, implicit: undefined});}).should.not.throw(/ms/i);
      });
      it('should succeed when given pageLoadDuration of 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: 0, implicit: undefined});}).should.not.throw(/ms/i);
      });
      it('should succeed when given implicitDuration of 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: undefined, implicit: 0});}).should.not.throw(/ms/i);
      });
      it('should succeed when given scriptDuration greater than 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: 1, pageLoad: undefined, implicit: undefined});}).should.not.throw(/ms/i);
      });
      it('should succeed when given pageLoadDuration greater than 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: 1, implicit: undefined});}).should.not.throw(/ms/i);
      });
      it('should succeed when given implicitDuration greater than 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: undefined, pageLoad: undefined, implicit: 1});}).should.not.throw(/ms/i);
      });
      it('should succeed when given scriptDuration, pageLoadDuration and implicitDuration greater than 0', async () => {
        (() => {validators.timeouts({protocol: BaseDriver.DRIVER_PROTOCOL.W3C, script: 1, pageLoad: 1, implicit: 1});}).should.not.throw(/ms/i);
      });
    });
    describe('clickCurrent', () => {
      it('should fail when given an invalid button', async () => {
        (() => {validators.clickCurrent(4);}).should.throw(/0, 1, or 2/i);
      });
      it('should succeed when given a valid button', async () => {
        (() => {validators.clickCurrent(0);}).should.not.throw();
        (() => {validators.clickCurrent(1);}).should.not.throw();
        (() => {validators.clickCurrent(2);}).should.not.throw();
      });
    });
    describe('setNetworkConnection', () => {
      it('should fail when given no type', async () => {
        (() => {validators.setNetworkConnection();}).should.throw(/0, 1, 2, 4, 6/i);
      });
      it('should fail when given an invalid type', async () => {
        (() => {validators.setNetworkConnection(8);}).should.throw(/0, 1, 2, 4, 6/i);
      });
      it('should succeed when given a valid type', async () => {
        (() => {validators.setNetworkConnection(0);}).should.not.throw();
        (() => {validators.setNetworkConnection(1);}).should.not.throw();
        (() => {validators.setNetworkConnection(2);}).should.not.throw();
        (() => {validators.setNetworkConnection(4);}).should.not.throw();
        (() => {validators.setNetworkConnection(6);}).should.not.throw();
      });
    });
  });
});
