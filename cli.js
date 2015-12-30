#!/usr/bin/env node

var zxcvbn = require('zxcvbn');
var cli = require('commander');
var chalk = require('chalk');
var Table = require('cli-table');
var pkg = require('./package');

// option parsing
cli
  .version(pkg.version)
  .description('A realistic password strength estimator.')
  .option('-l, --limit-results', 'display the password score, a warning (if any), and suggestions (if any)')
  .option('-S, --sequence', 'display match sequence along with the results')
  .option('-s, --crack-times-sec', 'display crack time estimations in seconds')
  .option('--no-color', 'disable color support')
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

// call --help if no arguments are passed
if (typeof pwd === 'undefined') {
  cli.outputHelp();
  process.exit(0);
}

var table = new Table({
  head: [chalk.cyan('Guesses'), chalk.cyan('Time estimate')],
  style: {
    compact : true,
    head: [],
    'padding-left': 2,
    'padding-right': 2 }
});

var boxProp = {
  chars: { 'top-mid': '', 'bottom-mid': '', 'left-mid': '', 'mid': '' , 'mid-mid': '', 'right-mid': '', 'middle': '' },
  style: { 'padding-left': 2, 'padding-right': 2, head: [] }
};

var htable = new Table(boxProp);

var res = zxcvbn(pwd);
var output = function (res) {
  if (cli.limitResults) { console.log('\nPassword:\t' + res.password + '\n\nScore:\t\t[' + res.score + ' / 4]'); } else {
    console.log('\nPassword:\t' + res.password +
                '\n\nScore:\t\t' + '[' + res.score + ' / 4]' +
                '\n\nCalc time:\t' + res.calc_time + ' ms' +
                '\n\nGuesses:\t' + res.guesses + ' (' + res.guesses_log10.toFixed(3) + ')');

    if (cli.crackTimesSec) {
      console.log(chalk.underline('\nCrack time estimations:\n'));

      table.push(
        { '100 / hour': [res.crack_times_seconds.online_throttling_100_per_hour + ' (throttled online attack)'] },
        { '10  / second': [res.crack_times_seconds.online_no_throttling_10_per_second + ' (unthrottled online attack)'] },
        { '10k / second': [res.crack_times_seconds.offline_slow_hashing_1e4_per_second + ' (offline attack, slow hash, many cores)'] },
        { '10B / second': [ res.crack_times_seconds.offline_fast_hashing_1e10_per_second + ' (offline attack, fast hash, many cores)'] }
      );

      console.log(table.toString());

    } else {
      console.log(chalk.underline('\nCrack time estimations') + ':\n');

      table.push(
        { '100 / hour': [res.crack_times_display.online_throttling_100_per_hour + ' (throttled online attack)'] },
        { '10  / second': [res.crack_times_display.online_no_throttling_10_per_second + ' (unthrottled online attack)'] },
        { '10k / second': [res.crack_times_display.offline_slow_hashing_1e4_per_second + ' (offline attack, slow hash, many cores)'] },
        { '10B / second': [ res.crack_times_display.offline_fast_hashing_1e10_per_second + ' (offline attack, fast hash, many cores)'] }
      );

      console.log(table.toString());
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
          htable.push(['\'' + chalk.yellow.bold(token) + '\'', '']);
          htable.push(['Pattern:', pattern]);
        }
        htable.push([formatStr(p) + ': ', res.sequence[s][p]]);
        count++;
      }
      console.log(htable.toString());
      htable = new Table(boxProp);
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

