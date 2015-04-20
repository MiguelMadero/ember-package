'use strict';
var CoreObject = require('core-object');
var run = require('../utils/run');
var path = require('path');

module.exports = CoreObject.extend({
  run: function(/*scenario, commandArgs, commandOptions*/){
    var addonPath = this.project.addonPackages['ember-package'].path;
    var broccoliPath = path.join(addonPath, 'lib', 'packaging');
    return run('broccoli', ['build', 'dist'], {cwd: broccoliPath});
  }
});
