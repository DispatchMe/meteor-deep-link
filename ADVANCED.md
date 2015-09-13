Advanced
========

#### Full api
*   `link(path, data)`
*   `open(path, data)`
*   `iosBanner(path, data)`

Internals:
*   `createLink(path, data)`
*   `intentLink(path, data)`
*   `browserLink(path, data)`
*   `androidLink(path, data)`
*   `iosLink(path, data)`
*   `isIOS`
*   `isAndroid`


#### Intent event
Theres a catch "all" event:
```js

  DeepLink.once('INTENT', function(intent){
    alert('Got some deep linked data...');
  });

```
