Package.describe({
  name: 'dispatch:deep-link',
  version: '4.0.1',
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
  api.use(['ecmascript', 'underscore'], 'web');

  api.use([
    'ejson',
    'raix:eventstate@0.0.4'
  ], 'web');

  api.addFiles([
    'lib/common.js'
  ], 'web');

  api.export('DeepLink', 'web');

  // Adds a global "handleOpenURL" on cordova
  api.export('handleOpenURL', 'web.cordova');

  // Test exports
  api.export('intentPattern', 'client', { testOnly: true });
  api.export('browserIntentPattern', 'client', { testOnly: true });

  api.export('parseQueryString', 'client', { testOnly: true });
  api.export('objectToQueryString', 'client', { testOnly: true });
  api.export('objectToBase64', 'client', { testOnly: true });
  api.export('objectFromBase64', 'client', { testOnly: true });
  api.export('isNested', 'client', { testOnly: true });
  api.export('createQueryString', 'client', { testOnly: true });
});

Package.onTest(function(api) {
  api.use(['ecmascript'], 'web');

  api.use(['dispatch:deep-link']);
  api.use('test-helpers', 'client');
  api.use('tinytest', 'client');

  api.addFiles('tests/utils.js', 'client');
});
