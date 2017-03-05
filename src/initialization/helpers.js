"use strict";

function addJs(urls, options) {
    if(typeof(options.data.root["jsUrls"]) === 'undefined'){
        options.data.root["jsUrls"] = []
    }

    var parsedUrls
    try {
        parsedUrls = JSON.parse(urls);
    } catch (e) {
        if(typeof(urls) === "string"){
            options.data.root["jsUrls"].push(urls)  
        }
        return
    }

    if(parsedUrls instanceof Array){      
        var mergedArray = options.data.root["jsUrls"].concat(parsedUrls)
        options.data.root["jsUrls"] = mergedArray
    }
}

function addCss(urls, options) {
    if(typeof(options.data.root["cssUrls"]) === 'undefined'){
        options.data.root["cssUrls"] = []
    }

    var parsedUrls
    try {
        parsedUrls = JSON.parse(urls);
    } catch (e) {
        if(typeof(urls) === "string"){
            options.data.root["cssUrls"].push(urls)  
        }
        return
    }
    
    if(parsedUrls instanceof Array){      
        var mergedArray = options.data.root["cssUrls"].concat(parsedUrls)
        options.data.root["cssUrls"] = mergedArray
    }
}

module.exports = {
    'helpers': {
        addJs,
        addCss
    }
}