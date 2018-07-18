#!/usr/bin/env node

var sResults = require('./lib/index');
var cli = require('commander');
var pkg = require('./package');

// option parsing
cli
  .version(pkg.version)
  .description('A realistic password strength estimator.')
  .option('-l, --limit-results', 'display the password score, a warning (if any), and suggestions (if any)')
  .option('-S, --sequence', 'display match sequence along with the results')
  .option('-s, --crack-times-sec', 'display crack time estimations in seconds')
  .option('--no-color', 'disable color support')
  .arguments('<password> [userdata]')
  .action(function (password, userdata) {
    pwd = password;

    if (! userdata) {
      data = [];
    } else {
      try {
        data = JSON.parse(userdata);
      } catch (error) {
        data = userdata.split(' ');
      }
    }
  });

cli.on('--help', function () {
  console.log('  Notes:');
  console.log('');
  console.log('    - Remember to surround your password in quotes if it contains special characters');
  console.log('');
  console.log('  For more details see:');
  console.log('    https://blogs.dropbox.com/tech/2012/04/zxcvbn-realistic-password-strength-estimation/');
  console.log('    https://github.com/dropbox/zxcvbn');
  console.log('');
});

cli.parse(process.argv);

if (typeof pwd === 'undefined') {
  cli.outputHelp();
  process.exit(0);
}

var options = {
  data: data,
  limitResults: cli.limitResults,
  sequence: cli.sequence,
  crackTimesSec: cli.crackTimesSec
};

sResults.output(pwd, options);
