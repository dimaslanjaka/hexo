/* global describe, it */
// mocha --timeout=700000 test/event-emitter.js --require ts-node/register

const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const Hexo = require('..');
const chai = require('chai');
const path = require('path');

describe('Hexo EventEmitter', () => {
  it('should instance of Event Emitter', () => {
    chai.expect(new Hexo() instanceof EventEmitter).to.equal(true);
  });

  describe('#emit()', () => {
    it('should same interface', () => {
      const siteDir = path.join(__dirname, 'fixtures/yarn-workspace/site');
      const hexo = new Hexo(siteDir);
      chai.expect(hexo.on('ready', sinon.spy) instanceof Hexo).to.equal(true);
    });

    it('should invoke the callback', async () => {
      const spy = sinon.spy();
      const siteDir = path.join(__dirname, 'fixtures/yarn-workspace/site');
      const hexo = new Hexo(siteDir);

      hexo.on('ready', spy);
      await hexo.init();
      chai.expect(spy.called).to.equal(true);
    });

    it('should pass arguments to the callback', () => {
      const spy = sinon.spy();
      const siteDir = path.join(__dirname, 'fixtures/yarn-workspace/site');
      const hexo = new Hexo(siteDir);

      hexo.on('ready', spy);
      hexo.emit('ready', 'bar', 'baz');
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, 'bar', 'baz');
    });
  });
});
