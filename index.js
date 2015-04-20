/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-package',
  includedCommands: function () {
    return require('./lib/commands');
  }
};
