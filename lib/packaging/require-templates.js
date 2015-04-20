/* jshint node: true */

var Writer = require('broccoli-writer'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('rsvp').Promise,
    walk = require('walk-sync'),
    REDUNDANT_PREFIX = 'app/',
    EXTENSION = '.js';


var RequireTemplates = function (inputTree, options) {
    options = options || {};
    if ( !( this instanceof RequireTemplates ) ) {
        return new RequireTemplates(inputTree, options);
    }
    this.inputTree = inputTree;
    this.outputPrefix = 'app';
};

RequireTemplates.prototype = Object.create( Writer.prototype );
RequireTemplates.prototype.constructor = RequireTemplates;

RequireTemplates.prototype.write = function (readTree, destDir) {
    var _this = this;
    console.log('promise for RequireTemplates');
    return new Promise(function(resolve) {
        return readTree( _this.inputTree).then(function (srcDir) {
            var files = walk(srcDir).filter(function(f) {
                return /\.js$/.test(f);
            });
            var output = ['define(\'tyrion-templates\', [\'exports\','];

            files.forEach(function(filename) {
                var module = filename.substring(REDUNDANT_PREFIX.length, filename.length- EXTENSION.length);
                if (_this.outputPrefix) {
                    module = _this.outputPrefix + '/' + module;
                }
                output.push('\'' + module + '\',');
            });
            output.push('\'exports\'], function (__exports__) {');
            output.push('   __exports__["default"] = true;');
            output.push('});');
            fs.writeFileSync(path.join(destDir, 'tyrion-templates.js'), output.join('\n'));
            console.log('resolving promise for RequireTemplates');
            resolve();
        });
    });
};

module.exports = RequireTemplates;
