"use strict";

function addJs(url, options) {
    var array = []
    array.push(url)
    options.data.root["jsUrls"] = array
};

module.exports = {
    'helpers': {
        addJs
    }
};