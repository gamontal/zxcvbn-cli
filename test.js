var expect = require('chai').expect;
require('mocha-sinon');
var outputData = require('./lib/index');

var options = {
  limitResults: true,
  crackTimesSec: false,
  sequence: false
};

describe('output()', function() {

  beforeEach(function() {
    this.sinon.stub(console, 'log');
  });

  it('should log "Password: correcthorsebatterystaple and Score: [4 / 4]" for that password input and -l option enabled', function() {
    outputData.output('correcthorsebatterystaple', options);
    expect(console.log.calledOnce).to.be.false;
    expect(console.log.calledWith('\nPassword:\tcorrecthorsebatterystaple\n\nScore:\t\t[4 / 4]')).to.be.true;
  });

});
