Backbone Proxy
--------------
Provides a `Backbone.sync` or `Model.sync` method for the server-side
context. Uses `node-get` to retrieve models from another server allowing
models to be backed by a REST JSON endpoint elsewhere.

### Compatibility

    documentcloud backbone 0.3.3
    tmcw node-get 0.1.0

### Usage

    var Backbone = require('backbone');
    Backbone.sync = require('backbone-proxy')();

    // Backbone.sync will now load models from the URL specified by `Model.url`

### Authors

- [Will White](http://github.com/willwhite)

