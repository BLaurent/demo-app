# Microapp Seed

This is the microapp seed, which uses [Node](https://nodejs.org/) and [Express](http://expressjs.com/) on the back-end, and [ES6/ES2015](https://babeljs.io/docs/learn-es2015/), [Babel](https://babeljs.io/) and [JSPM](http://jspm.io/) on the front-end to serve up a microapp for the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). It is based on the [es6-jspm seed](https://github.build.ge.com/seeds/es6-jspm).

## What's a microapp?

The first rule of building large single-page web applications is _don't build large single-page web applications._ As our projects have grown we've found a need to break them into multiple, smaller single-page apps. We call these apps "microapps".

A microapp is designed to be loaded into the main content area of the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). The App Hub includes the microapp's `index.html` directly into the content section in its template, and proxies any further resource requests directly to the microapp itself.

A microapp should contain all the `<link>` and `<script>` tags needed to run itself. It should expect nothing other than basic styles from the [App Hub](https://github.build.ge.com/hubs/ui-app-hub), which includes the left navigation drawer, the logged-in user module, the persistent view header, and the view section that wraps around the microapp. These styles are provided by the App Hub's single front-end dependency [pxh-chrome](http://github.build.ge.com/hubs/pxh-chrome), which is built to be mobile-first and fully responsive.

The App Hub is unopinionated, and aside from pxh-chrome has no external front-end dependencies. It does not load Angular, Polymer, Highstocks, D3, jQuery, or any other niceties. Because of this, any microapp is free to use any client-side stack it wants, and any versions of external dependencies it needs.

Multiple microapps within the same App Hub can have completely different client-side stacks, dependencies and dependency versions without fear of conflicting with one another.

### Important Note

Within your microapp you must always use **RELATIVE URLS** with **NO LEADING SLASHES**!

When running behind an App Hub, your URLs will have a path prepended to them, to distinguish your microapp from the other microapps running in the same App Hub. 

**This works as you'd expect:**

```
<script src="foo/bar.js">
```

**This won't work:**

```
<script src="/foo/bar.js">
```

In the second case, your microapp's path won't be prepended to the URL, resulting in a 404 (or worse).

## Getting Started

To run your microapp locally you'll need to download and build two things; this [ui-microapp](https://github.build.ge.com/hubs/ui-microapp) repository and the [ui-app-hub](https://github.build.ge.com/hubs/ui-app-hub) repository.

### Installing dependencies

If you haven't already done so, [install Node](https://nodejs.org/en/) (version 4.4 or above).

You can also install Node using [nvm](https://github.com/creationix/nvm), which installs Node to a hidden folder in your User folder and allows you to sidestep all sorts of frustrating `sudo` and `file.lock` issues.

Install Bower, Gulp, JSPM and nodemon:

```
sudo npm install -g bower
sudo npm install -g gulp
sudo npm install -g jspm
sudo npm install -g nodemon
```

Make sure `github.build.ge.com` is in your `no_proxy` bash variable. In your `~/.bashrc` (or `.zshrc` or `.bash_profile` or whatever you use) add the following line:

```
export no_proxy="github.build.ge.com"
```

**Dealing with the proxy is single hardest thing about building stuff at GE.** If nothing is working and you're at a loss, don't panic. Ask someone who's been here awhile, or [look at this gist](https://github.build.ge.com/gist/212326609/be807819103e537fac83) for some help getting your proxy settings configured.

If you haven't already created a JSPM endpoint for Github Enterprise, do so:

```
jspm registry create ge jspm-github
Are you setting up a GitHub Enterprise registry? [yes]:yes
Enter the hostname of your GitHub Enterprise server:github.build.ge.com
Would you like to set up your GitHub credentials? [yes]:no
```

### Install ui-microapp and ui-app-hub

Clone the [ui-microapp](https://github.build.ge.com/hubs/ui-microapp) repo:

```
git clone https://github.build.ge.com/hubs/ui-microapp.git
```

Use NPM, Bower and JSPM to install all dependencies:

```
cd ui-microapp
npm install
bower install
jspm install
```

This will create the `/node_modules`, `src/bower_components` and `src/jspm_packages` folders.

**Note:** We would like to get rid of [Bower](http://bower.io) and use a single package manager, but currently we need Bower to manage Px/Polymer dependencies. Predix UI components have hard-coded relative URLs so they can share resources (e.g. `../some-component/component.html`) and as a result they must be siblings within the same `/bower_components` folder.

Start your server:

```
gulp serve
```

This command compiles all the Sass files to CSS, watches for any change in JavaScript, Sass or HTML files, and refreshes your browser automatically when it detects them.

Open http://localhost:9000 in your browser. If you want to run the app on a different port, edit the `server` task in `app.js`

**Looks weird, eh?** That's because we haven't proxied your microapp into an App Hub yet! Let's fix that.

Clone the [ui-app-hub](https://github.build.ge.com/hubs/ui-app-hub) repo:

```
git clone https://github.build.ge.com/hubs/ui-app-hub.git
```

Use NPM and Bower to install all dependencies (the App Hub doesn't need JSPM):

```
cd ui-app-hub
npm install
bower install
```

Quit your microapp server if it's currently running by typing `CTRL+C`.

Start your App Hub server:

```
nodemon
```

This will start a local App Hub server at http://localhost:3000, which looks at http://localhost:9000 for a microapp to proxy into its content area

Finally, start your microapp server again:

```
cd ../ui-microapp
gulp serve
```

**Once your microapp server starts, navigate to http://localhost:3000 in your browser to see your local App Hub with your microapp proxied into it.**

## Test your microapp

```
gulp test:unit
```
This runs the JavaScript unit tests for the microapp. Open `karma.conf` to view the configuration file, where you can change the browser, set `singleRun` to false, etc.

```
gulp test:backend
```

This runs integration tests, if any, using the Mocha framework.

```
gulp test:e2e
```

This runs the end-to-end tests for the microapp using [protractor](http://www.protractortest.org). Open `test/e2e/protractor.config.js` to view the configuration file and make any changes to it.

## Working with your microapp

### Listening for resize events

Since [pxh-chrome](http://build.ge.com/hubs/pxh-chrome) is mobile-first and responsive, there may be cases where you need to rerender your microapp content based on changes in width to the `pxh-view` wrapping element. This is common with SVGs or other types of content that need to render at a specific and known pixel width.

Listening to `window.width` will cover many responsive use cases, but it doesn't cover the expansion (and collapse) of the navigation drawer, as that behavior changes the width of `pxh-view` without changing the width of the browser window.

Fortunately, pxh-chrome and the App Hub provide a custom event, `pxhViewResized`, that fires whenever the `pxh-view` element changes size. Simply listen for this event in your microapp, and respond as necessary after it fires.

**1)** pxh-chrome includes the `ResizeSensor` class from [css-element-queries](https://github.com/marcj/css-element-queries) to give itself the ability to track when elements resize.

**2) For the `pxhViewResized` event to work you must add the `js-view` id to the `<section class="pxh-view">` element in your microapp's `index.html` like so:**

```html
<section class="pxh-view pxh-view--wide@md pxh-view--narrow@lg" id="js-view"> 
  ... 
</section>
```

**3)** pxh-chrome grabs `pxh-view` using the `js-view` id and puts it in a var:

```javascript
document.getElementById('js-view');
```

**Note:** In cases where pxh-chrome uses classes or ids to grab elements via JavaScript, we follow a convention of prefixing them with `js-*` so we know there are no actual CSS styles associated with that attribute.

**Sub-note:** Never ever apply CSS styles by id, as they are nearly impossible to override and prevent reusability (as there can only be one element per id per DOM). Always use classes to apply styles to elements.

**4)** pxh-chrome creates a new custom event called `pxhViewResized`:

```javascript
var pxhViewResized = new CustomEvent('pxhViewResized', {
 'detail' : pxhView.offsetWidth
});
```

**5)** pxh-chrome adds a new `ResizeSensor` to the `pxh-view` element, which dispatches the `pxhViewResized` event when it fires:

```javascript
new ResizeSensor(pxhView, function() {
  document.dispatchEvent(pxhViewResized);
});
```

**Here's a basic usage example (add this code to your microapp and pxh-chrome will handle the rest):**

```javascript
document.addEventListener('pxhViewResized', function(event) {
  console.log('pxhViewResized was fired!');
});
```

**Note:** If you look at the console output for this example, you'll see you will want to implement some debouncing on your event listener for `pxhViewResized`. Our perspective is that the debouncing should be the responsibility of the microapp, not the event itself, so you are free to manage how frequently you redraw your content.

## Creating a production version

This task:

```
gulp dist
```

Will create a bundled, optimized distribution version of the microapp along with documentation and a test coverage summary in `dist/`. The `manifest.yml` file expects your app to be in `dist/` so **run this task before doing a `cf push`.**

## Generating documentation

We use [ngdoc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) to compile inline documentation into an online doc system. Running the `gulp docs` task will compile all inline comments preceded with `@ngdoc` into a mini-website at `docs/`. It's up to you whether/how to deploy this.

For more information see the documentation at https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
