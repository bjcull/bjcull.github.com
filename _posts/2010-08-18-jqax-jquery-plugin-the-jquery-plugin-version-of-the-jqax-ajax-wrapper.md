---
title: "jQax jQuery plugin – The jQuery plugin version of the jQax ajax wrapper"
date: 2010-08-18
layout: post
categories:
- &o0 Javascript
tags:
- Ajax
- *o0
- jQuery
---

<p>Upgraded by popular demand, the jQax ajax wrapper has been turned into a full fledged jQuery plugin, conforming to the plugin authoring guidelines and compatible with compression.</p>  <h2>Rain sweet code down on me:</h2>  <p>Below is the full code as of writing, if you’re interested in helping out, the source can also be <a title="jquery.jqax.js" href="http://gist.github.com/534526" target="_blank">found here on github</a></p>  <p>[gist id=534526 file=jquery.jqax.js]</p>  <h2>Show me the usage:</h2>  <p>Once you’ve referenced the script in the head section you can use the code like so:</p>  <pre class="prettyprint">var x = $.jQax({
    LoaderContainerId: &quot;#divMyLoadingDiv&quot;,
    LoaderText: &quot;I'm loading, wait up...&quot;
});</pre>

<p>Now you can perform the following function anywhere you need within scope of the above declaration:</p>

<pre class="prettyprint">var data = {
    myTrackRecord: &quot;52 Seconds&quot;,
    activity: &quot;go karts&quot;
};
x.Post(&quot;MyWebService.asmx/Record&quot;, data, function (data, eventArgs) {
    var result = $.parseJSON(data.d); // Please note: You may not need &quot;.d&quot;
    // Do stuff here
});</pre>

<p>The original non-plugin version of my code can be found in my previous post: </p>

<p><a title="jQax – A Simple jQuery Ajax Wrapper with Loading Notification" href="http://benjii.me/2010/08/jqax-a-simple-jquery-ajax-wrapper-with-loading-notification/" target="_blank">jQax – A Simple jQuery Ajax Wrapper with Loading Notification</a></p>