'use strict';
// throw 'error';
module.exports = {
  name: 'package',
  description: 'Packages your add-ons Javascript and CSS',
  works: 'insideProject',

  run: function (commandOptions) {
    var PackageTask = require('../tasks/package');
    var packageTask = new PackageTask({
      ui: this.ui,
      project: this.project
    });
    return packageTask.run(commandOptions);
  }
};
