import zxcvbn from 'zxcvbn';
import chalk from 'chalk';
import Table from 'cli-table';
var res = [];


function formatStr(str) {
  var frags = str.split('_');
  for (var i = 0; i < frags.length; i++) {
    if (i === 0) { frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1); continue; }
    frags[i] = frags[i].charAt(0) + frags[i].slice(1);
  }
  return frags.join(' ');
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

export default {

  output: function (pwd, options) {
    var limitResults = options.limitResults;
    var crackTimesSec = options.crackTimesSec;
    var sequence = options.sequence;
    res = zxcvbn(pwd, options.data);

    if (options.jsonOutput) {
      console.log(JSON.stringify(res));
      return;
    }

    if (limitResults) { console.log('\nPassword:\t' + res.password + '\n\nScore:\t\t[' + res.score + ' / 4]'); } else {
      console.log('\nPassword:\t' + res.password +
                  '\n\nScore:\t\t' + '[' + res.score + ' / 4]' +
                  '\n\nCalc time:\t' + res.calc_time + ' ms' +
                  '\n\nGuesses:\t' + res.guesses + ' (' + res.guesses_log10.toFixed(3) + ')');

      if (crackTimesSec) {
        console.log(chalk.underline('\nCrack time estimations:\n'));

        table.push(
          { '100 / hour': [res.crack_times_seconds.online_throttling_100_per_hour +
                           ' (throttled online attack)'] },
          { '10  / second': [res.crack_times_seconds.online_no_throttling_10_per_second +
                             ' (unthrottled online attack)'] },
          { '10k / second': [res.crack_times_seconds.offline_slow_hashing_1e4_per_second +
                             ' (offline attack, slow hash, many cores)'] },
          { '10B / second': [ res.crack_times_seconds.offline_fast_hashing_1e10_per_second +
                              ' (offline attack, fast hash, many cores)'] });

        console.log(table.toString());

      } else {
      console.log(chalk.underline('\nCrack time estimations') + ':\n');

        table.push(
          { '100 / hour': [res.crack_times_display.online_throttling_100_per_hour +
                           ' (throttled online attack)'] },
          { '10  / second': [res.crack_times_display.online_no_throttling_10_per_second +
                             ' (unthrottled online attack)'] },
          { '10k / second': [res.crack_times_display.offline_slow_hashing_1e4_per_second +
                             ' (offline attack, slow hash, many cores)'] },
          { '10B / second': [ res.crack_times_display.offline_fast_hashing_1e10_per_second +
                              ' (offline attack, fast hash, many cores)'] });

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

    if (sequence) {
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
  }
};
