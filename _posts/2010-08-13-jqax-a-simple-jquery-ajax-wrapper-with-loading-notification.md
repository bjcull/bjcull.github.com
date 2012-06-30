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

<a href="/wp-content/uploads/2010/08/ajax.png"><img class="alignright size-medium wp-image-95" title="I dont think this is quite what I meant" src="/wp-content/uploads/2010/08/ajax-300x235.png" alt="I dont think this is quite what I meant" width="300" height="235" /></a>If you just want a simple way of connecting your web page to a .NET web service or page method using ajax, then the following snippet of javascript is for you. By the way, if you place a div with an id of “divLoader” somewhere on your page, it will automatically fade in during loading and fade out when its complete.

<strong>UPDATE: I've created a jQuery plugin version of this code which I've <a title="jQax jQuery plugin – The jQuery plugin version of the jQax ajax wrapper" href="http://benjii.me/2010/08/jqax-jquery-plugin-the-jquery-plugin-version-of-the-jqax-ajax-wrapper/">blogged about here</a>!</strong>
<h2>Yeah, Yeah, What do I copy?</h2>
The full code is below:
<pre class="prettyprint">// jQax.js - A wrapper for jQuery ajax functionality aimed at .NET services and page methods
// Ben Cull - 12 August 2010

function jQax() {

    this.CallWebServiceWithGET = function (WebService, GetData, ShowLoading, LoaderText, SuccessCallBack, ErrorCallback) {

        if (ShowLoading)
            ShowLoader(LoaderText);

        if (WebService == "")
            return 1; // Incorrect Parameters

        if (ErrorCallback == null)
            ErrorCallback = jQax.DefaultErrorCallBack;

        if (typeof (GetData) === "object")
            GetData = $.param(GetData);

        $.ajax({
            type: "GET",
            url: WebService,
            data: GetData,
            success: SuccessCallBack,
            error: ErrorCallback
        });

        return 0; // Successful
    }

    this.CallWebServiceWithJSON = function (WebService, JsonData, ShowLoading, LoaderText, SuccessCallBack, ErrorCallback) {

        if (ShowLoading)
            ShowLoader(LoaderText);

        if (WebService == "")
            return 1; // Incorrect Parameters

        if (ErrorCallback == null)
            ErrorCallback = jQax.DefaultErrorCallBack;

        if (typeof(JsonData) === "object")
            JsonData = JSON.stringify(JsonData);

        $.ajax({
            type: "POST",
            url: WebService,
            data: JsonData,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: SuccessCallBack,
            error: ErrorCallback
        });

        return 0; // Successful
    };

    function ShowLoader(LoaderText) {
        var loadingText = "Loading...";
        if (LoaderText != null &amp;&amp; LoaderText != "") {
            loadingText = LoaderText;
        }

        $("#divLoader").text(loadingText);
        $("#divLoader").fadeIn("fast");
    }

    this.DefaultErrorCallBack = function (XMLHttpRequest, textStatus, errorThrown) {
        var response = eval("(" + XMLHttpRequest.responseText + ")");
        var output = "Message: " + response.Message + "\n\n";
        output += "StackTrace: " + response.StackTrace;
        alert(output);
    }

    $(document).ready(function () {

        $("#divLoader").ajaxStop(function () {
            $(this).stop(true, true).fadeOut("fast");
        });

    });

};

jQax = new jQax();</pre>
<h2>That’s all well and good, but how do I use it?</h2>
Well Its quite simple, if you have a page method or web service you call It like so (the call using the GET method is much the same):
<pre class="prettyprint">jQax.CallWebServiceWithJSON(
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
    });</pre>
<strong>To enable automatic JSON serialization you must download the following and add it to your head section:</strong>

<strong>json2.js from <a title="http://www.json.org/json2.js" href="http://www.json.org/json2.js">http://www.json.org/json2.js</a></strong>
<h2>Page Methods must be setup like this!</h2>
If you want to use page methods with your fancy new ajax wrapper, you need to ensure the following two things:
<ul>
	<li>Your page methods are static</li>
	<li>Your page methods are decorated with the [WebMethod] attribute, found in the System.Web.Services namespace</li>
</ul>
Like so:
<pre class="prettyprint">[WebMethod]
public static string MyMethod(string parameterName, string horses)
{
    // Keep in mind, everything comes in and goes out as a string

    return parameterName + horses;
}</pre>
<h2>If you need more help…</h2>
Here are some links to help you out with some more complex uses of the above code:
<ul>
	<li><a title="Javascript Classes are a Best Practice for Cleaner Javascript" href="http://benjii.me/2010/04/javascript-classes-are-a-best-practice-for-cleaner-javascript/" target="_blank">Javascript Classes are a Best Practice for Cleaner Javascript</a> – This explains why my javascript is laid out the way it is.</li>
	<li><a title="How to return multiple=" target="_blank">How to return multiple formats with WCF including XML, JSON and ATOM</a> – A very quick guide on how to return different formats with WCF (Web Services).</li>
	<li><a title="5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4" href="http://benjii.me/2010/03/5-lifesaving-tips-for-creating-a-wcf-restful-api-in-net-4/" target="_blank">5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4</a> – In case you are using WCF, here are some tips so you don’t go through the same pain I did.</li>
</ul>