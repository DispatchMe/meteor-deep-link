/* global __meteor_runtime_config__:false */
if (Meteor.isClient) {

  var query = new ReactiveVar({});

  // Listen to deep links
  DeepLink.on('dispatchdeeplinktest', function(q) {
    query.set(q);
  });

  // Set up a deep link helper object
  var testApp = new DeepLink('dispatchdeeplinktest', {
    appId: 'me.dispatch.qa.test.deep.link',
    fallbackUrl: 'http://meteor.com'
  });

  // Add the ios banner meta tag with attached data
  testApp.iosBanner('', { method: 'banner?', foo: 'bar', date: new Date() });

  Template.hello.helpers({
    'isAndroid': function() {
      return testApp.isAndroid;
    },
    'isCordova': function() {
      return Meteor.isCordova;
    },
    'customLink': function() {
      return testApp.link('', { method: 'link', cool: true });
    },
    'base64Link': function() {
      return testApp.link('', { method: 'ejsonbase64', cool: true, date: new Date() });
    },
    'query': function() {
      return _.map(query.get(), function(val, key) {
        return { key: key, val: val };
      });
    },
  });

  Template.hello.events({
    'click .btnOpenApp': function() {
      testApp.open('', { method: 'open', cool: true });
    },
    'click .btnOpenFalseApp': function() {
      window.open('nonexistingapp://?method=invalid&cool=false');
    },
    'click .btnCompose': function() {
      window.location = encodeURI('mailto:foo@bar.com?subject=Custom URL scheme demo&body=' +
            '<a href="dispatchdeeplinktest://?foo=bar">Link to app</a>');
    },
    'click .btnComposeSMS': function() {
      var phoneNumber = $('.inputNumber').val();
      window.location = encodeURI('sms:' + phoneNumber + '?subject=Custom URL scheme demo&body=' +
            '<a href="dispatchdeeplinktest://?foo=bar">Link to app</a>');
    },
    'click .btnBrowser': function() {
      cordova.InAppBrowser.open(__meteor_runtime_config__.ROOT_URL, '_system');
    }
  });
}
