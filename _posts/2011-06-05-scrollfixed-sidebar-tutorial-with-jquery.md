---
title: Scrollfixed Sidebar Tutorial with jQuery
date: 2011-06-05
layout: post
categories:
- Javascript
tags:
- CSS
---

<p>With the unveiling of my brand new blog theme, you may notice a cool little quirk that appears every time you scroll past the header. That’s right not only does the sidebar follow you, but it also pops up a cool mini version of my main header. This post will describe the surprisingly difficult time I had getting my head around the usage of the position fixed css property.</p>  <h2>A little bit of CSS</h2>  <p>The CSS for this isn’t actually the hard part, see below:</p>  <pre class="prettyprint">#wrapper
{
    margin: 0 auto;
    min-width: 1000px;
    width:80%;
    max-width:1400px;
    overflow:hidden;
    position:relative;
}
aside 
{
    padding-top:30px;
    overflow: hidden;
    width: 300px;
    float: right;
    clear: none;
}
aside.fixed
{
    position:fixed;
    top:0;
}</pre>

<p>Here I include the fluid width for the wrapper, and set the sidebar to it’s regular place of floated right with 300px width. Simple. The tricky part comes when trying to position the sidebar with a fixed position. Little did I know that position relative has no effect on the position fixed child. <strong>Position fixed is always relative to the viewport.</strong></p>

<h2>jQuery to the Rescue</h2>

<p>Luckily for us, jQuery makes this a very simple problem to fix. At the same time we detect if the sidebar has scrolled far enough, we’ll also measure the correct position for the left property of the sidebar. Thus solving the problem forever. Take a look:</p>

<pre class="prettyprint">$(document).ready(function () {

    var $sidebar = $(&quot;aside&quot;),
        $window = $(window),
        offset = $sidebar.offset();

    var bodyRight = $(&quot;#wrapper&quot;).offset().left + $(&quot;#wrapper&quot;).width();

    $window.scroll(function () {
        if ($window.scrollTop() &gt; offset.top) {
            $(&quot;aside&quot;).addClass(&quot;fixed&quot;);
            $(&quot;aside&quot;).css(&quot;left&quot;, bodyRight - $(&quot;aside&quot;).width());
            $(&quot;.miniHeader&quot;).slideDown(&quot;fast&quot;);
        } else {
            $(&quot;aside&quot;).removeClass(&quot;fixed&quot;);
            $(&quot;.miniHeader&quot;).slideUp(&quot;fast&quot;);
        }
    });

});</pre>

<p>Here you’ll notice that we calculate the correct position of the sidebar, then if the window has scrolled far enough, we apply the class and position. You’ll also notice I slide down the mini header. It was just hiding with display none.</p>

<p>These simple pieces of code result in quite a snappy looking sidebar if I do say so myself :)</p>