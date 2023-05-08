'use strict';

// mocha --timeout=700000 test/event-emitter.js --require ts-node/register

const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const Hexo = require('..');
const chai = require('chai');
const path = require('path');

describe('Hexo EventEmitter', () => {

  it('should instance of Event Emitter', () => {
    chai.expect(new Hexo() instanceof EventEmitter).to.be.true;
  });

  describe('#emit()', () => {

    it('should same interface', () => {
      const siteDir = path.join(__dirname, 'fixtures/yarn-workspace/site');
      const hexo = new Hexo(siteDir);
      chai.expect(hexo.on('ready', sinon.spy) instanceof Hexo).to.be.true;
    });

    it('should invoke the callback', async () => {
      const spy = sinon.spy();

      const siteDir = path.join(__dirname, 'fixtures/yarn-workspace/site');
      const hexo = new Hexo(siteDir);

      hexo.on('ready', spy);
      await hexo.init();
      chai.expect(spy.called).to.be.true;
    });

    /*

    it('should pass arguments to the callbacks', () => {
      const spy = sinon.spy();
      const emitter = new Hexo();

      emitter.on('foo', spy);
      emitter.emit('foo', 'bar', 'baz');
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, 'bar', 'baz');
    });*/
  });
});
