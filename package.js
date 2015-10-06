Package.describe({
  name: 'dispatch:deep-link',
  version: '4.0.3',
  summary: 'Handle deep linked data'
});

Cordova.depends({
  // xxx: Includes a fix for Meteor android
  // ref: https://github.com/EddyVerbruggen/Custom-URL-scheme/pull/110
  'cordova-plugin-customurlscheme': 'https://github.com/EddyVerbruggen/Custom-URL-scheme/' +
          'tarball/c3adccd39b116a1fc93b0dd741fc3fdb5e30989c' // 4.0.0+
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');

  api.use([
    'ecmascript',
    'underscore',
    'ejson',
    'raix:eventstate@0.0.4'
  ]);

  api.addFiles([
    'lib/server.js'
  ], 'server');

  api.addFiles([
    'lib/common.js'
  ]);

  api.addFiles([
    'lib/client.js'
  ], 'client');

  api.export('DeepLink');

  // Adds a global "handleOpenURL" on cordova
  api.export('handleOpenURL', 'web.cordova');

  // Test exports
  api.export('intentPattern', { testOnly: true });
  api.export('browserIntentPattern', { testOnly: true });

  api.export('parseQueryString', { testOnly: true });
  api.export('objectToQueryString', { testOnly: true });
  api.export('objectToBase64', { testOnly: true });
  api.export('objectFromBase64', { testOnly: true });
  api.export('isNested', { testOnly: true });
  api.export('createQueryString', { testOnly: true });
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'dispatch:deep-link',
    'test-helpers',
    'tinytest'
  ]);

  api.addFiles('tests/utils.js');
});
