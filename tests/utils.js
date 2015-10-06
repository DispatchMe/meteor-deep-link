var testEqual = function(test, a, b) {
  test.equal(JSON.stringify(a), JSON.stringify(b));
};

Tinytest.add('dispatch:deep-link - intentPattern', function(test) {
  test.isTrue(intentPattern.test('test://path?arguments'));
  test.isTrue(intentPattern.test('test:path?arguments'));
  test.isTrue(intentPattern.test('test://path'));
  test.isTrue(intentPattern.test('test://?arguments'));
  test.isTrue(intentPattern.test('test://?data:ejson;base64,arguments'));
  test.isTrue(intentPattern.test('test://?'));
  test.isTrue(intentPattern.test('test://'));

  testEqual(test, 'test://path?arguments'.match(intentPattern), [
    'test://path?arguments',
    'test',
    'path',
    null,
    'arguments']);

  testEqual(test, 'test:path?arguments'.match(intentPattern), [
    'test:path?arguments',
    'test',
    'path',
    null,
    'arguments']);

  testEqual(test, 'test://path'.match(intentPattern), [
    'test://path',
    'test',
    'path',
    null,
    null]);

  testEqual(test, 'test://?arguments'.match(intentPattern), [
    'test://?arguments',
    'test',
    null,
    null,
    'arguments']);

  testEqual(test, 'test://?data:ejson;base64,arguments'.match(intentPattern), [
    'test://?data:ejson;base64,arguments',
    'test',
    null,
    'base64',
    'arguments']);

  testEqual(test, 'test://?'.match(intentPattern), [
    'test://?',
    'test',
    null,
    null,
    '']);

  testEqual(test, 'test://'.match(intentPattern), [
    'test://',
    'test',
    null,
    null,
    null]);

  testEqual(test, 'test://?foo=bar&bar=foo'.match(intentPattern), [
    'test://?foo=bar&bar=foo',
    'test',
    null,
    null,
    'foo=bar&bar=foo']);
});

Tinytest.add('dispatch:deep-link - browserIntentPattern', function(test) {

  var browserIntentPatternTest = function(url, intent) {
    test.equal(intent, url.match(browserIntentPattern).pop());
  };

  test.isTrue(browserIntentPattern.test('http://localhost/test://path?arguments'));
  test.isTrue(browserIntentPattern.test('http://localhost:3000/test://path?arguments'));
  test.isTrue(browserIntentPattern.test('http://1.1.1.1:3000/test://path?arguments'));
  test.isTrue(browserIntentPattern.test('http://foo.bar.com:3000/test://path?arguments'));
  test.isTrue(browserIntentPattern.test('http://foo.bar12.com:3000/test://path?arguments'));
  test.isTrue(browserIntentPattern.test('http://foo.bar12.com:3000/test:path?arguments'));

  test.isFalse(browserIntentPattern.test('http://localhost/test//path?arguments'));

  browserIntentPatternTest('http://foo.bar12.com:3000/test:path?arguments', 'test:path?arguments');
  browserIntentPatternTest('http://foo.bar12.com:3000/test://path?arguments', 'test://path?arguments');
});

Tinytest.add('dispatch:deep-link - parseQueryString', function(test) {
  var parseQueryStringTest = function(str, obj) {
    var parsedString = parseQueryString(str);
    test.equal(JSON.stringify(parsedString), JSON.stringify(obj));
  };

  parseQueryStringTest('foo=bar', { foo: 'bar' });

  parseQueryStringTest('foo=bar&bar=foo', { foo: 'bar', bar: 'foo' });

  parseQueryStringTest('foo=', { foo: '' });

  parseQueryStringTest('foo=&bar=foo', { foo: '', bar: 'foo' });

  parseQueryStringTest('text=foo%3Dbar%26bar%3Dfoo', { text: 'foo=bar&bar=foo' });
});

Tinytest.add('dispatch:deep-link - objectToQueryString', function(test) {
  var objectToQueryStringTest = function(obj, str) {
    var parsedObject = objectToQueryString(obj);
    test.equal(parsedObject, str);
  };

  objectToQueryStringTest({ foo: 'bar' }, 'foo=bar');

  objectToQueryStringTest({ foo: 'bar', bar: 'foo' }, 'foo=bar&bar=foo');

  objectToQueryStringTest({ foo: true, bar: 10 }, 'foo=true&bar=10');

  objectToQueryStringTest({ foo: undefined, bar: null }, 'foo=undefined&bar=null');

});

Tinytest.add('dispatch:deep-link - EJSON Base64', function(test) {
  var testObject = {
    foo: 'bar',
    bar: 'foo',
    date: new Date(2015, 01, 01, 01, 01, 0, 0)
  };

  var str = objectToBase64(testObject);
  var newObject = objectFromBase64(str);

  test.equal(str, 'data:ejson;base64,eyJmb28iOiJiYXIiLCJiYXIiOiJmb28iLCJkYXRlIjp7IiRkYXRlIjoxNDIyNzQ4ODYwMDAwfX0=');
  test.equal(testObject.foo, newObject.foo);
  test.equal(testObject.bar, newObject.bar);
  test.equal(+testObject.date, +newObject.date);


  str = objectToBase64(null);
  newObject = objectFromBase64(str);

  test.equal(str, 'data:ejson;base64,bnVsbA==');
  test.equal(null, newObject);
});

Tinytest.add('dispatch:deep-link - createQueryString', function(test) {
// The createQueryString will convert depending on the data type
// 1. string will be 1:1
// 2. flat object will be query string
// 3. nested object will be base64
  test.equal(createQueryString('plaintext'), 'plaintext');
  test.equal(createQueryString({ foo: 'bar', bar: 'foo'}), 'foo=bar&bar=foo');
  test.equal(createQueryString({ date: new Date(2015, 1, 1, 0, 0, 0, 0) }),
          'data:ejson;base64,eyJkYXRlIjp7IiRkYXRlIjoxNDIyNzQ1MjAwMDAwfX0=');

});

Tinytest.add('dispatch:deep-link - isNested', function(test) {
  test.isFalse(isNested({ foo: 'bar' }));
  test.isTrue(isNested({ foo: { bar: 'isNested' } }));
});

Tinytest.add('dispatch:deep-link - basic test', function(test) {
  var myCoolApp = new DeepLink('mycoolapp', {
    // Optional
    appId: 'me.dispatch.qa.test.deep.link',
    url: 'http://foo.com', // Homepage with intent support
    fallbackUrl: 'http://meteor.com' // Only android
  });

  test.equal(myCoolApp.createLink('path',  { foo: 'bar' }), 'path?foo=bar');
  test.equal(myCoolApp.intentLink('path',  { foo: 'bar' }), 'mycoolapp://path?foo=bar');
  test.equal(myCoolApp.iosLink('path',  { foo: 'bar' }), 'mycoolapp://path?foo=bar');
  test.equal(myCoolApp.browserLink('path',  { foo: 'bar' }), 'http://foo.com/mycoolapp://path?foo=bar');
  test.equal(myCoolApp.androidLink('path',  { foo: 'bar' }), 'intent://path?foo=bar#Intent;scheme=mycoolapp;package=' +
          'me.dispatch.qa.test.deep.link;S.browser_fallback_url=http://meteor.com;end');

});

//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equal(actual, expected, message, not)
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
