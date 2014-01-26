---
title: "jQax – A Simple jQuery Ajax Wrapper with Loading Notification"
date: 2010-08-13
layout: post
categories:
- Javascript
- Web Services
tags:
- .NET
- Ajax
- Json
- Serialization
---

[![I dont think this is quite what I meant](/wp-content/uploads/2010/08/ajax-300x235.png "I dont think this is quite what I meant")](/wp-content/uploads/2010/08/ajax.png)If you just want a simple way of connecting your web page to a .NET web service or page method using ajax, then the following snippet of javascript is for you. By the way, if you place a div with an id of “divLoader” somewhere on your page, it will automatically fade in during loading and fade out when its complete.

**UPDATE: I've created a jQuery plugin version of this code which I've [blogged about here](http://benjii.me/2010/08/jqax-jquery-plugin-the-jquery-plugin-version-of-the-jqax-ajax-wrapper/ "jQax jQuery plugin – The jQuery plugin version of the jQax ajax wrapper")!**

## Yeah, Yeah, What do I copy?

The full code is below:

<script src="https://gist.github.com/bjcull/534526.js"></script>

## That’s all well and good, but how do I use it?

Well Its quite simple, if you have a page method or web service you call It like so (the call using the GET method is much the same):

    jQax.CallWebServiceWithJSON(
        "MyPage.aspx/MyMethod",
        {
            parameterName: "parameterValue",
            horses: 40
        },  // can be any javascript object (if json2.js is enabled), otherwise you must pass in a json string
        true, // shows the divLoader
        "Custom Text for Loader...", // use null for default
        function(data, eventArgs) { // This is called on success
            // data is exactly whats returned by the server
            // quick and easy JSON parsing can be done like so:

            var result = $.parseJSON(data);

            // Deal with result here
        });
        
**To enable automatic JSON serialization you must download the following and add it to your head section:**

**json2.js from [http://www.json.org/json2.js](http://www.json.org/json2.js "http://www.json.org/json2.js")**

## Page Methods must be setup like this!

If you want to use page methods with your fancy new ajax wrapper, you need to ensure the following two things:

*   Your page methods are static
*   Your page methods are decorated with the [WebMethod] attribute, found in the System.Web.Services namespace

Like so:
    [WebMethod]
    public static string MyMethod(string parameterName, string horses)
    {
        // Keep in mind, everything comes in and goes out as a string

        return parameterName + horses;
    }

## If you need more help…

Here are some links to help you out with some more complex uses of the above code:

*   [Javascript Classes are a Best Practice for Cleaner Javascript](http://benjii.me/2010/04/javascript-classes-are-a-best-practice-for-cleaner-javascript/ "Javascript Classes are a Best Practice for Cleaner Javascript") – This explains why my javascript is laid out the way it is.
*   <a title="How to return multiple=" target="_blank">How to return multiple formats with WCF including XML, JSON and ATOM</a> – A very quick guide on how to return different formats with WCF (Web Services).
*   [5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4](http://benjii.me/2010/03/5-lifesaving-tips-for-creating-a-wcf-restful-api-in-net-4/ "5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4") – In case you are using WCF, here are some tips so you don’t go through the same pain I did.
