App.info({
  id: 'me.dispatch.qa.test.deep.link',
  name: 'Deep link',
  description: 'Manual QA of deep link',
  author: 'Morten Henriksen',
  email: 'morten@dispatch.me',
  website: 'http://test.deep.link.dispatch.me'
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xffffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

App.accessRule('http://*');
App.accessRule('https://*');
App.accessRule('mailto:*', { launchExternal: true });
App.accessRule('sms:*', { launchExternal: true });

// Setup deeplink
App.configurePlugin('cordova-plugin-customurlscheme', {
  URL_SCHEME: 'dispatchdeeplinktest'
});
