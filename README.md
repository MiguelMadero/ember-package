# Ember-package

**Disclaimer:** This is just an experiment for now. Something we extracted from one of our internal add-ons, that is consumed by one of our non EmberCLI Apps. Please send us your feedback. The rest of the README explains the intention behind this, but most of it is not implented yet.

Ember Package helps add-on authors and add-on consumers by removing the need to use EmberCLI from non Ember CLI Applications. I think it's better to migrate the application to use Ember CLI, but this can help as an interim step. This is designed for add-ons consumed at runtime, not for add-ons that extend the build pipeline, add blueprints or commands.

## For consumers

Start by installing and initializing ember-package

```
npm install -g ember-package
ember-package init
```

Simply add the ember add-ons you want to consume to your non Ember CLI Application.


```
npm install ember-lgtm --save-dev
```

Running that, ember-package will detect the add-ons installed and will build static assets under `./ember-packages/`. From there, you can simply reference them from your application as needed. For example, we have an application using Ember EAK, so we simply add it to the index. In this case, ember-lgtm only has a Javascript file, so that's all we need to reference.

```
<script src="ember-packages/ember-lgtm/ember-lgtm.js"></script>
```

### How does it work

`ember-package init` adds a postinstall hook to your package json to run `ember-package` after installing node modules.

`ember-package` will inspect your package.json for ember-addons. For all of the add-ons it finds, it will package them, leaving the output under `ember-packages/package-name`. It will generate .js, .css.

### What it doesn't do for you

It won't concatenate the dependencies of your add-on, since it doesn't know which of those are you referrering to already and it doesn't have a way of adding them dynamically to your current build pipeline. We could potentially add a warning if we identify bower.json dependencie if the app is using bower.

### Development workflow

TODO: Describe how to `npm link` an addon and run `ember package --serve` to keep rebuilding as the addon code changes.

## For authors

Start by installing ember-package as an add-on.

```
ember install ember-package
```

Run `ember package` to build static assets for your add-on. You could then publish this assets for others to consume via bower or another package manager. This is similar to what ember does with [components/ember](https://github.com/components/ember)

## Limitations

* It won't work for add-ons that extend the build pipeline, add commands to ember-cli or have blueprints.
* It won't add your add-ons dependencies automatically, but it will warn you if you're missing them.
* It won't publish or version your add-on's dist assets. That's out of scope.
