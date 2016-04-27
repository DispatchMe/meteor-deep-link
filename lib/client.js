// Handle
window.handleOpenURL = function handleOpenURL(intent) {
  console.info('Triggered by intent:', intent);
  // Dont block the cordova plugins
  Meteor.defer(function () {
    var parsedUrl = intent.match(intentPattern);

    if (parsedUrl) {
      var [ /* url */ , name, /* path */ , base64, queryString] = parsedUrl;
      var data = {};

      // convert queryString into object
      if (queryString) {
        if (base64) {
          try {
            data = objectFromBase64(queryString);
          } catch (ignore) {}
        } else {
          data = parseQueryString(queryString);
        }
      }

      DeepLink.emitState(name, data, ...parsedUrl);
    }

    DeepLink.emitState('INTENT', intent);

  });
};

handleOpenURL = window.handleOpenURL;

// Support browser intents
if (!Meteor.isCordova) {
  var parsedBrowserUrl = window.location.href.match(browserIntentPattern);
  if (parsedBrowserUrl) {
    var [, intent] = parsedBrowserUrl;
    handleOpenURL(intent);
  }
}
