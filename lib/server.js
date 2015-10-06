btoa = (str) => new Buffer(str).toString('base64');

atob = (base64) => new Buffer(base64, 'base64').toString();
