var expect = require('chai').expect;
require('mocha-sinon');
var outputData = require('./lib/index');

var options = {};
var console_log = [];

describe('output()', function() {

  beforeEach(function() {
    // clear any previously logged console messages
    console_log = [];
    // stub console.log, we'll collect the messages instead
    this.sinon.stub(console, 'log').callsFake(function () {
      [].slice.call(arguments).forEach(function (output) {
        console_log.push(output);
      });
    });

    // reset options to default
    options = {
      jsonOutput: false,
      limitResults: false,
      crackTimesSec: false,
      sequence: false
    };
  });

  it('should log "Password: correcthorsebatterystaple" and "Score: [4 / 4]" for a strong password, with -l option enabled', function() {
    var message;
    options.limitResults = true;
    outputData.output('correcthorsebatterystaple', options);

    expect(console.log.calledOnce).to.be.false;

    message = console_log.shift();
    expect(message).to.match(/Password:.*correcthorsebatterystaple/m);
    expect(message).to.match(/Score:.*[4 / 4]/m);
  });

  it('should output raw results as a json-encoded object when -j option is enabled', function() {
    var data;
    options.jsonOutput = true;
    outputData.output('correcthorsebatterystaple', options);

    expect(console.log.calledOnce).to.be.true;

    // test will also fail if JSON.parse errors
    data = JSON.parse(console_log.shift());

    expect(data).to.have.all.keys(
      'password',
      'guesses',
      'guesses_log10',
      'sequence',
      'calc_time',
      'crack_times_seconds',
      'crack_times_display',
      'score',
      'feedback'
    );

    expect(data.score).to.equal(4);
  });
});
