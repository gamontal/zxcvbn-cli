#!/usr/bin/env node

var zxcvbn = require('zxcvbn');
var cli = require('commander');
var chalk = require('chalk');
var pkg = require('./package');

cli
  .version(pkg.version)
  .description('A realistic password strength estimator.')
  .option('-l, --limit-results', 'display the password score, a warning (if any), and suggestions (if any)')
  .option('-S, --sequence', 'display match sequence along with the results')
  .option('-s, --crack-times-sec', 'display crack time estimations in seconds')
  .option('--no-color', 'disable output colors')
  .arguments('<password>')
  .action(function (password) {
    pwd = password;
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

var res = zxcvbn(pwd);
var output = function (res) {
  if (cli.limitResults) { console.log('\nPassword:\t' + res.password + '\nScore:\t\t(' + res.score + ' / 4)'); } else {
    console.log('\nPassword:\t' + res.password +
                '\nScore:\t\t' + '(' + res.score + ' / 4)' +
                '\nCalc time:\t' + res.calc_time + ' ms' +
                '\nGuesses:\t' + res.guesses + ' (OOM: ' + res.guesses_log10.toFixed(3) + ')');
    if (cli.crackTimesSec) {
      console.log('\nCrack time estimations:\n\n' +
                  '100 / hour:\t' + res.crack_times_seconds.online_throttling_100_per_hour +
                  ' (throttled online attack)' + '\n10  / second:\t' +
                  res.crack_times_seconds.online_no_throttling_10_per_second +
                  ' (unthrottled online attack)' + '\n10k / second:\t' +
                  res.crack_times_seconds.offline_slow_hashing_1e4_per_second +
                  ' (offline attack, slow hash, many cores)' + '\n10B / second:\t' +
                  res.crack_times_seconds.offline_fast_hashing_1e10_per_second +
                  ' (offline attack, fast hash, many cores)');
    } else {
      console.log('\nCrack time estimations:\n\n' +
                  '100 / hour:\t' + res.crack_times_display.online_throttling_100_per_hour +
                  ' (throttled online attack)' + '\n10  / second:\t' +
                  res.crack_times_display.online_no_throttling_10_per_second +
                  ' (unthrottled online attack)' + '\n10k / second:\t' +
                  res.crack_times_display.offline_slow_hashing_1e4_per_second +
                  ' (offline attack, slow hash, many cores)' + '\n10B / second:\t' +
                  res.crack_times_display.offline_fast_hashing_1e10_per_second +
                  ' (offline attack, fast hash, many cores)');
    }
  }

  if ((res.feedback.warning === '') && (res.feedback.suggestions.length === 0)) {
    console.log('');
  }

  if (res.feedback.warning !== '') {
    console.log(chalk.red.bold('\nWarning:\t') + res.feedback.warning);
  }

  var suggest = res.feedback.suggestions;
  if (suggest.length !== 0) {
    console.log('\nSuggestions:');
    for (var key in suggest) {
      console.log('\t\t- ' + suggest[key]);
    }
    console.log('');
  }

  if (cli.sequence) {
    var pattern, token;
    console.log('Match sequence:');

    for (var s in res.sequence) {
      console.log('');
      console.log('_______________________________________________\n');
      var count = 0;

      for (var p in res.sequence[s]) {
        if (p === 'pattern') {
          pattern = res.sequence[s][p];
          count++;
          continue;

        } else if (p === 'token') {
          token = res.sequence[s][p];
          count++;
          continue;

        } else if ((p === 'i') || (p === 'j') || (p === 'sub')) {
          continue;
        }

        if (count === 2) {
          console.log(' \'' + chalk.yellow(token) + '\'');
          console.log(' Pattern:\t\t' + pattern);
        }
        var tabs = '\t\t'; // I feel like I'm obligated to do this... looking for a better way to format the output...
        if (p.length >= 13) { tabs = '\t'; } else if (p.length <= 4) { tabs = '\t\t\t'; }
        console.log(' ' + formatStr(p) + ': ' + tabs + res.sequence[s][p]);
        count++;
      }
    }
    console.log('');
  }
}(res);

function formatStr(str) {
  var frags = str.split('_');
  for (var i = 0; i < frags.length; i++) {
    if (i === 0) { frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1); continue; }
    frags[i] = frags[i].charAt(0) + frags[i].slice(1);
  }
  return frags.join(' ');
}
