/* jshint maxlen: 130 */

/**
 * Cordova intent pattern
 *
 * eg.:
 * "intentname://path?arguments"
 *
 * @type {RegExp}
 */
intentPattern = /([a-zA-Z0-9]+):(?:\/\/)?([a-zA-Z0-9\/-]+)?(?:\?(?:data:ejson;(base64),)?(.*))?/;

/**
 * Browser intent pattern
 *
 * eg.:
 * "http://foo.com/intentname://path?arguments"
 *
 * @type {RegExp}
 */
browserIntentPattern = /(?:.*):\/\/(?:[a-zA-Z0-9:\.])+\/((?:[a-zA-Z0-9]+):(?:\/\/)?(?:.*))/;

/**
 * Url pattern
 *
 * eg.:
 * "http://foo.com/path?arguments"
 *
 * @type {RegExp}
 */
urlPattern =  /^(https?):\/\/?[\da-z\.-]+\.[a-z\.]{2,6}(.*)\/?$/;

/**
 * Converts an object into a querystring
 * @param  {Object} obj) Source
 * @return {String}      Query string
 */
objectToQueryString = (obj) => _.map(obj, (val, key) => `${key}=${val}`).join('&');

/**
 * Converts object into an EJSON base64 string
 * @param  {Object} obj Source
 * @return {String}     EJSON bae64 string
 */
objectToBase64 = (obj) => 'data:ejson;base64,' + btoa(EJSON.stringify(obj));

/**
 * Converts EJSON base64 string into object
 * @param  {String} str String to parse
 * @return {Object}     Parsed object
 */
objectFromBase64 = (str) => EJSON.parse(atob(str.replace(/^data:ejson;base64,/, '')));

/**
 * Check if object as nested objects
 * @param  {Object} obj) Source
 * @return {Boolean}     true=nested objects, false=flat object
 */
isNested = (obj) => _.some(obj, (val) => _.isObject(val));

/**
 * Creates the appropiate querystring depending on the data type
 * if its a nested object it will be a base64 version if it's a
 * "flat" object it will convert 1:1 with a querystring
 * @param  {String|Object} data Source
 * @return {String}        Formatted data
 */
createQueryString = (data='') => {
  if (data !== ''+data) {
    data = (isNested(data)) ? objectToBase64(data) : objectToQueryString(data);
  }

  return encodeURI(data);
};

/**
 * Parse a query string into a key/value object
 * @param  {String} queryString String to parse
 * @return {Object}             Key/value object
 */
parseQueryString = function(queryString) {
  return _.object(_.map(queryString
            .split('&'), function(val) {
              return _.map(val.split('='), (val) => decodeURIComponent(val));
          }));
};

var eventState = new EventState();

/**
 * The DeepLink class
 * @param {String} name Url scheme
 * @param {Object} options Options
 * @param {String} options.appId The app id
 * @param {String} options.url Browser url for browser intents eg. "http://foo.com/"
 * @param {String} options.fallbackUrl Fallback url in case intent fails
 */
DeepLink = class DeepLink {
  constructor(name, { appId, fallbackUrl, url } = {}) {
    this.name = name;
    this.appId = appId;
    this.url = (url) ? url.replace(/\/$/,'') + '/' : ''; // Add traling slash
    this.fallbackUrl = (fallbackUrl) ? encodeURI(fallbackUrl):'';
    // Helpers
    if (Meteor.isClient) {
      this.isIOS = /iPhone|iPod|iPad/i.test(navigator.userAgent);
      this.isAndroid = !this.isIOS && /android/i.test(navigator.userAgent);
    }
  }

  createLink(path='', data='') {
    data = createQueryString(data);
    return (data === '')? path: `${path}?${data}`;
  }

  intentLink() {
    var uri = this.createLink(...arguments);
    return `${this.name}://${uri}`;
  }

  /**
   * Create browser link for a browser intent
   * @param  {String} path Path
   * @param  {Object} data Data
   * @return {String}      Link
   */
  browserLink(path='', data='') {
    return this.url + this.intentLink(path, data);
  }

  androidLink(path='', data='') {
    var uri = this.createLink(path, data);
    if (this.appId) {
      if (this.fallbackUrl) {
        return `intent://${uri}#Intent;scheme=${this.name};package=${this.appId};S.browser_fallback_url=${this.fallbackUrl};end`;
      } else {
        return `intent://${uri}#Intent;scheme=${this.name};package=${this.appId};end`;
      }
    }
    return this.intentLink(...arguments);
  }

  iosLink() {
    return this.intentLink(...arguments);
  }

  /**
   * Create a link depending on settings and OS
   * @param  {String} path   Optional path
   * @param  {String|Object} data Optional data
   * @return {String}        Link to app
   */
  link(path='', data='') {
    if (this.isIOS) {
      return this.iosLink(path, data);
    } else if (this.isAndroid) {
      return this.androidLink(path, data);
    }
    return this.intentLink(...arguments);
  }

  /**
   * Set the ios banner in the header
   * This is the meta tag that ios supports, this helper
   * makes it easier to pass on data.
   * (It will create the meta tag if not found)
   *
   * @param  {String} path Optional path
   * @param  {String} data Optional data
   *
   * @where  client
   */
  iosBanner(path='', data='') {
    if (this.appId && Meteor.isClient) {

      var link = this.intentLink(path, data);
      var content = `app-id=${this.appId}, app-argument=${link}`;

      var el = $('meta[name=apple-itunes-app]')[0];

      if (el) {
        el.setAttribute('content', content);
      } else {
        $('head').append(`<meta name="apple-itunes-app" content="${content}"/>`);
      }

    }


  }

  /**
   * Open the app
   * @param  {String} path  Optional path
   * @param  {String} data  Optional data
   * @param  {String} where Optional destination (_system)
   *
   * @where  client
   */
  open(path='', data='', where='_system') {
    if (Meteor.isClient) {
      window.open(this.link(path, data), where);
    } else {
      throw new Error('DeepLink.open is not implemented on the server');
    }
  }

  static emit() { return eventState.emit(...arguments); }
  static emitState() { return eventState.emitState(...arguments); }
  static on() { return eventState.on(...arguments); }
  static once() { return eventState.once(...arguments); }
  static off() { return eventState.off(...arguments); }
};
