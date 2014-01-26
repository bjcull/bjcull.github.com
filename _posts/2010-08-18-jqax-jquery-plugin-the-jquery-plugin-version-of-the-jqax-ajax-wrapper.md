---
title: "jQax jQuery plugin – The jQuery plugin version of the jQax ajax wrapper"
date: 2010-08-18
layout: post
categories:
- Javascript
tags:
- Ajax
- jQuery
---

Upgraded by popular demand, the jQax ajax wrapper has been turned into a full fledged jQuery plugin, conforming to the plugin authoring guidelines and compatible with compression.

## Rain sweet code down on me:

Below is the full code as of writing, if you’re interested in helping out, the source can also be [found here on github](http://gist.github.com/534526 "jquery.jqax.js")

[gist id=534526 file=jquery.jqax.js]

## Show me the usage:

Once you’ve referenced the script in the head section you can use the code like so:

    var x = $.jQax({
        LoaderContainerId: "#divMyLoadingDiv",
        LoaderText: "I'm loading, wait up..."
    });

Now you can perform the following function anywhere you need within scope of the above declaration:

    var data = {
        myTrackRecord: "52 Seconds",
        activity: "go karts"
    };
    x.Post("MyWebService.asmx/Record", data, function (data, eventArgs) {
        var result = $.parseJSON(data.d); // Please note: You may not need ".d"
        // Do stuff here
    });

The original non-plugin version of my code can be found in my previous post: 

[jQax – A Simple jQuery Ajax Wrapper with Loading Notification](http://benjii.me/2010/08/jqax-a-simple-jquery-ajax-wrapper-with-loading-notification/ "jQax – A Simple jQuery Ajax Wrapper with Loading Notification")
