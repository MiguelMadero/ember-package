/* jshint node: true */
var inspect = require('broccoli-inspect');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var ES6Modules = require('broccoli-es6modules');
var TemplateCompiler = require('ember-cli-htmlbars');
var es3Safe = require('broccoli-es3-safe-recast');
var concatFilesWithSourcemaps = require('broccoli-sourcemap-concat');
var Funnel = require('broccoli-funnel');
var requireTemplates = require('./require-templates');
var compileLess = require('broccoli-less-single');
var exportTree = require('broccoli-export-tree');
var path = require('path');

var addonsRoot = '/Users/mmadero/pfcode/tyrion19'; // TODO: get this from ENV
var addonTree = pickFiles(path.join(addonsRoot, 'addon'), {srcDir: '/', destDir: 'tyrion'});
var appTree = pickFiles(path.join(addonsRoot, 'app'), { srcDir: '/', destDir: 'app'});

var templateTree = new TemplateCompiler(path.join(addonsRoot, 'app', 'templates'), {
  isHTMLBars: true,
  precompile: true,
  templateCompiler: require('../../bower_components/ember/ember-template-compiler')
});
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app/templates'});

var jsTree = mergeTrees([addonTree, appTree, templateTree], {overwrite: true});
jsTree = new Funnel(jsTree, { include: ['**/*.js']});
jsTree = new ES6Modules(jsTree, {
  esperantoOptions: {
    absolutePaths: true,
    strict: true,
  }
});
jsTree = inspect.tmpDir(jsTree, 'es6 module');

var tyrionTemplatesRequireFile = requireTemplates(templateTree);
tyrionTemplatesRequireFile = inspect.tmpDir(tyrionTemplatesRequireFile, 'tyrion-templates require file');
jsTree = mergeTrees([jsTree, tyrionTemplatesRequireFile]);

var concatenatedFile = concatFilesWithSourcemaps(jsTree, {
  inputFiles: ['tyrion/**/*.js', 'app/**/*.js'],
  footerFiles: [
    'tyrion-templates.js'
  ],
  outputFile: '/assets/tyrion.js',
  sourceMapConfig: { enabled: false },
  description: 'Concat: App'
});
concatenatedFile = inspect.tmpDir(concatenatedFile, 'concatenatedFiles');

templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app/templates'});

// var pfBaseCss = compileLess([appTree], 'app/styles/pfbase.less', '/assets/pfbase.css', {
//   paths: ['../app/styles']
// });

//Temporary to have 1:1 output with previous tyrion/grunt build. Will be removed
// var tyrionCss = compileLess([appTree], 'app/styles/tyrion.less', '/assets/tyrion.css', {
//   paths: ['../app/styles']
// });

// var fontsTree = pickFiles(appTree, {
//   srcDir: 'app/fonts',
//   files: ['ehr-icons.woff'],
//   destDir: '/fonts'
// });

var mergedTrees = mergeTrees([es3Safe(concatenatedFile)/*,fontsTree, pfBaseCss, tyrionCss*/]);

module.exports = exportTree(mergedTrees, {
  destDir: path.join(addonsRoot, 'ember-packages')
});
