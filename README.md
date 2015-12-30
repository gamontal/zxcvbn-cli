```
_________________________________________________/\/\_______________________/\/\/\/\___/\/\______/\/\/\/\__
_/\/\/\/\/\__/\/\__/\/\____/\/\/\/\__/\/\__/\/\__/\/\________/\/\/\/\_____/\/\_________/\/\________/\/\____
_____/\/\______/\/\/\____/\/\________/\/\__/\/\__/\/\/\/\____/\/\__/\/\___/\/\_________/\/\________/\/\____
___/\/\________/\/\/\____/\/\__________/\/\/\____/\/\__/\/\__/\/\__/\/\___/\/\_________/\/\/\/\____/\/\____
_/\/\/\/\/\__/\/\__/\/\____/\/\/\/\______/\______/\/\/\/\____/\/\__/\/\_____/\/\/\/\___/\/\/\/\__/\/\/\/\__
___________________________________________________________________________________________________________
```
[![npm version](https://img.shields.io/npm/v/zxcvbn-cli.svg?style=flat)](https://www.npmjs.com/package/zxcvbn-cli)
[![Dependency Status](https://david-dm.org/gmontalvoriv/zxcvbn-cli.svg)](https://www.npmjs.com/package/zxcvbn-cli)
[![Build Status](https://travis-ci.org/gmontalvoriv/zxcvbn-cli.svg)](https://travis-ci.org/gmontalvoriv/zxcvbn-cli)

A CLI for zxcvbn ([Dropbox's realistic password strength estimator](https://blogs.dropbox.com/tech/2012/04/zxcvbn-realistic-password-strength-estimation/)).

## About zxcvbn

`zxcvbn` is a password strength estimator inspired by password crackers. Through pattern matching and conservative entropy calculations, it recognizes and weighs 30k common passwords, common names and surnames according to US census data, popular English words from Wikipedia and US television and movies, and other common patterns like dates, repeats (`aaa`), sequences (`abcd`), keyboard patterns (`qwertyuiop`), and l33t speak.

Visit the [official repository](https://github.com/dropbox/zxcvbn) for more details.

## Installation

```
$ [sudo] npm install -g zxcvbn-cli
```

## Usage

Typing `zxcvbn --help` will list all the available options.

```shell
$ zxcvbn --help

  Usage: zxcvbn [options] <password>

  A realistic password strength estimator.

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -l, --limit-results    display the password score, a warning (if any), and suggestions (if any)
    -S, --sequence         display match sequence along with the results
    -s, --crack-times-sec  display crack time estimations in seconds
    --no-color             disable output colors
  ...

```

## Screenshots

![](https://github.com/gmontalvoriv/zxcvbn-cli/blob/master/screenshots/sc1.png)

![](https://github.com/gmontalvoriv/zxcvbn-cli/blob/master/screenshots/sc2.png)

### Notes:

- Consider adding an alias for this command in your bash_profile if you are having trouble typing it.
- Make sure to surround your password in quotes if it contains special characters.

## Contribute

Contributions are always welcomed.

## License

MIT © [Gabriel Montalvo](http://gmontalvoriv.github.io/)
