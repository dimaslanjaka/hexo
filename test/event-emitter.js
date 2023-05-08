'use strict';

// mocha --timeout=700000 test/event-emitter.js --require ts-node/register

// const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const Hexo = require('..');
const chai = require('chai');

describe('Hexo EventEmitter', () => {
  it('should instance of Event Emitter', () => {
    chai.expect(new Hexo() instanceof EventEmitter).to.be.true;
  });

  describe('#emit()', () => {


    /* it('should invoke the callback', () => {
      const spy = sinon.spy();
      const emitter = new Hexo();

      emitter.on('ready', spy);
      emitter.emit('ready');
      spy.called.should.equal.true;
    });

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
