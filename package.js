Package.describe({
  summary: "Wunderlist OAuth flow",
  version: "0.1.0"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Wunderlist');

  api.addFiles(
    ['wunderlist_configure.html', 'wunderlist_configure.js'],
    'client');

  api.addFiles('wunderlist_server.js', 'server');
  api.addFiles('wunderlist_client.js', 'client');
});