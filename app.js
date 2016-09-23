'use strict';
let appname = 'IOT Dashboard',
  express = require('express'),
  bodyParser = require('body-parser'),
  serveStatic = require('serve-static'),
  proxy = require('express-request-proxy'),
  app = express();

// ========================================================================
// TEST ENDPOINTS
// These endpoints respond with the query strings and body, respectively
// They're used to test that GET and POST params are properly passed through a hub
app.use('/querytest/*', (req, res) => {
  res.send(JSON.stringify(req.query));
});
app.use(bodyParser.json()); // Needed to examine req.body
app.all('/posttest', (req, res) => {
  res.send(JSON.stringify(req.body));
});

// ========================================================================
// NAV SERVICE
// TODO: Don't serve a static file here. Return a function which builds
//       out the nav dynamically.
app.use('/nav', serveStatic('public/nav/nav.json'));

// ========================================================================
// SERVICE PROXIES
const defaultTimeout = 30000;

// Stub service for local dev
let stubService = 'http://ui-stub-service-dev.grc-apps.svc.ice.ge.com';
// If we're in production, get the stub service from an environment var
if (process.env.NODE_ENV === 'production') {
  stubService = process.env.stubProxyConfig;
}
app.use('/service/*', (req, res, next) => {
  proxy({
    url: stubService + '/*',
    timeout: parseInt(req.headers.timeout) || defaultTimeout,
    originalQuery: req.originalUrl.indexOf('?') >= 0 // Don't sanitize query parameters (allow square braces to pass). But only enable if query params are present.
  })(req, res, next);
});


// ========================================================================
// STATIC ASSETS
// serveStatic() here will cache these static assets in memory so we don't
// read them from the filesystem for each request. Additionally,
// setStaticAssetsCacheControl() will look for a 'Cache-Control' header on the
// request and add it to the response for these static assets. This can be
// used by a tenant who needs aggressive caching.
function setStaticAssetsCacheControl(res, path) {
  if (res.req.headers['Cache-Control'] || res.req.headers['cache-control']) {
    res.setHeader('Cache-Control', res.req.headers['Cache-Control'] || res.req.headers['cache-control']);
  }
}
// http://expressjs.com/en/advanced/best-practice-performance.html
app.use('/', serveStatic('public', {
  setHeaders: setStaticAssetsCacheControl
}));

// ========================================================================
// START THE SERVER
// Need to let CF set the port if we're deploying there.
var port = process.env.PORT || 9000;
app.listen(port);
console.log(appname + ' started on port ' + port);
