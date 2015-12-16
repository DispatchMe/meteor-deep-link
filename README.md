dispatch:deep-link
===================

This package enables deep linking to cordova or browser app.

### Install
```
$ meteor add dispatch:deep-link
```

### Basic usage

#### Configuration
Edit your `mobile-config.js`
```
App.configurePlugin('cordova-plugin-customurlscheme', {
  URL_SCHEME: 'mycoolapp'
});
```

#### Usage
Create an `iosBanner` or have a `link` for the user to click on - when the app recieves the link you can catch it like:
```js

  DeepLink.once('mycoolapp', function(data, url, scheme, path, querystring){
    alert('Got some deep linked data...');
  });

```
*Have a look at the [QA/Demo app](qa-app)*

### Additional api / helpers
Thers added an extra api of helpers making it easy to send data to the app:
*   `link(path, data)` *generates a url string*
*   `browserLink(path, data)` *(requires url to be set)*
*   `open(path, data)` *opens app using window.open*
*   `iosBanner(path, data)` *add/update ios banner meta tag*

### Example code
```js
  var myCoolApp = new DeepLink('mycoolapp', {
    // Optional
    appId: 'me.dispatch.qa.test.deep.link',
    url: 'http://foo.com', // Homepage with intent support
    fallbackUrl: 'http://meteor.com' // Only android
  });

  myCoolApp.link('', { foo: 'bar' }); // This will generate the url to the app
  myCoolApp.open('', { foo: 'bar' }); // This will open via window.open
  myCoolApp.iosBanner('', { foo: 'bar' }); // This will add/update the meta tag for ios users

  // This will use base64 ejson to carry the data - because it contains nested data
  myCoolApp.link('path', { foo: 'bar', date: new Date() });

  // To create a browser intent
  myCoolApp.browserLink('', { foo: 'bar' });
```
*Read more in [ADVANCED.md](ADVANCED.md)*

#### Credit
Thanks goes to [Eddy Verbruggen](https://github.com/EddyVerbruggen) for his [Custom URL scheme PhoneGap Plugin](https://github.com/EddyVerbruggen/Custom-URL-scheme)


