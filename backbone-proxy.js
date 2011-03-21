// Provides a `Backbone.sync` or `Model.sync` method for the server-side
// context. Uses `node-get` to retrieve models from another server allowing
// models to be backed by a REST JSON endpoint elsewhere.
//
// - `options.hostname` Optional. Hostname (and port) to use for any models
//   whose `url` property/function does not contain a hostname. Should not
//   include a trailing slash. Example: `http://www.twitter.com`.
var get = require('node-get'),
    path = require('path'),
    url = require('url');

module.exports = function(options) {
    options = options || {};
    options.hostname = options.hostname || '';

    // Helper function to get a URL from a Model or Collection as a property
    // or as a function.
    var getUrl = function(object) {
        if (object.url instanceof Function) {
            return object.url();
        } else if (typeof object.url === 'string') {
            return object.url;
        }
    };

    return function(method, model, success, error) {
        switch (method) {
        case 'read':
            var url = getUrl(model);
            (!url.parse(url).hostname)) && (url = options.hostname + url);

            (new get(url)).asString(function(err, str) {
                if (err) {
                    return error(err);
                } else {
                    return success(JSON.parse(str));
                }
            });
            break;
        // @TODO: support Create/Update/Delete operations -- requires
        // HTTP method support in `node-get`.
        default:
            return error(method + ' not supported by backbone-proxy.');
        }
    };
};

