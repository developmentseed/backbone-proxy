// Provides a `Backbone.sync` or `Model.sync` method for the server-side
// context. Uses `node-get` to retrieve models from another server allowing
// models to be backed by a REST JSON endpoint elsewhere.
//
// - `options.hostname` Optional. Hostname (and port) to use for any models
//   whose `url` property/function does not contain a hostname. Should not
//   include a trailing slash. Example: `http://www.twitter.com`.
// - `options.cache` Time to retain models in memory cache in seconds. Pass 0
//   to disable cache entirely. Defaults to 600 seconds (10 minutes).
var get = require('get'),
    path = require('path'),
    url = require('url'),
    cache = {};

module.exports = function(options) {
    options = options || {};
    options.hostname = options.hostname || '';
    options.cache = (options.cache === undefined) ? 600 : options.cache;

    // Helper function to get a URL from a Model or Collection as a property
    // or as a function.
    var getUrl = function(object) {
        if (object.url instanceof Function) {
            return object.url();
        } else if (typeof object.url === 'string') {
            return object.url;
        }
    };

    var sync = function(method, model, success, error) {
        switch (method) {
        case 'read':
            var u = getUrl(model);
                time = parseInt((+ new Date()) / 1000);
            (!url.parse(u).hostname) && (u = options.hostname + u);

            // Warmed cache.
            if (cache[u] && (time - options.cache) < cache[u].time) {
                return cache[u].status
                    ? success(cache[u].data)
                    : error(cache[u].data);
            }
            // Stale cache.
            (new get(u)).asString(function(err, str) {
                cache[u] = {
                    status: !err,
                    time: time,
                    data: err ? err : JSON.parse(str)
                };
                return cache[u].status
                    ? success(cache[u].data)
                    : error(cache[u].data);
            });
            break;
        // @TODO: support Create/Update/Delete operations -- requires
        // HTTP method support in `node-get`.
        default:
            return error(method + ' not supported by backbone-proxy.');
        }
    };

    return { sync: sync };
};

