---
title: Javascript Classes are a Best Practice for Cleaner Javascript
date: 2010-04-15
layout: post
categories:
- &o0 Javascript
tags:
- Best Practice
- *o0
---

<p>Javascript classes allow you to create reusable javascript code and cleaner and leaner web sites and web applications. In this post we’ll create a javascript class and describe when and where you should use them.</p>  <h2>Javascript Class Structure</h2>  <p>Javascript classes are structured just like regular object oriented classes, they have a class signature, constructor, public properties, private variables and public and private methods. The following code is an example of how all these are laid out.</p>  <pre class="brush: js;"><p>function myNotificationClass(myDefaultMessage) {    //Class Declaration

    // Private Variables
    var defaultMessage = &quot;Hi there&quot;;

    //Public Variables
    this.NotificationCount = 0;

    //Constructor Start</p><p>    if (myDefaultMessage != “”)</p><p>    {</p><p>        defaultMessage = myDefaultMessage;</p><p>    }</p><p>
</p><p>&#160;</p><p>    //Private Function</p><p>    function AddSignature(original) {</p><p>        return original + “ – By Ben Cull”;</p><p>    }</p><p>&#160;</p><p>    //Public Function</p><p>    this.DisplayNotification = function(message) {</p><p>        alert(AddSignature(message));</p><p>    }</p><p>&#160;</p><p>}</p><p>&#160;</p></pre>

<p>Now there are a few things to notice here so lets break this down and discuss each part separately.</p>

<h4>Class Declaration</h4>

<pre class="brush: js;">function myNotificationClass(myDefaultMessage) {
}</pre>

<p>A class in javascript is created the same way as a regular function, it’s what we put inside the class that really makes it useful. To access the contents of the class, we need to instantiate it like so:</p>

<pre class="brush: js;">var note = new myNotificationClass(“im a default message”);</pre>

<h4>Constructor</h4>

<p>Since the whole class is executed when the class is instantiated, adding some code inside the class but not inside any functions means that it will be run straight away. This mimics the purpose of a constructor and allows you to perform any setup for the class without the need for calling a function.</p>

<p>If you would like to pass in any parameters to the constructor, add them to the class declaration, like the above myDefaultMessage.</p>

<h4>Private Variables and Methods</h4>

<p>Private variables and methods are created the same way you would normally create them.</p>

<pre class="brush: js;"><p>var defaultMessage = &quot;Hi there&quot;; </p><p>&#160;</p><p>function AddSignature(original) {</p><p>    return original + “ – By Ben Cull”;</p><p>}</p></pre>

<p>These variables and methods can only be accessed from within the class itself, so they are useful for helper methods and keeping track of things you don’t want your page to see.</p>

<h4>Public Variables and Methods</h4>

<p>Public variables and methods are accessible anywhere that your instance is. eg. the “note” instance we created earlier.</p>

<p>Its important to note that public variables and methods are created by putting “this” in front of the declarations, like so:</p>

<pre class="brush: js;"><p>this.NotificationCount = 0; </p><p>&#160;</p><p>this.DisplayNotification = function(message) {</p><p>    alert(AddSignature(message));</p><p>}</p></pre>

<p>Also note that the function keyword now comes after the function name.</p>

<p>To call a public function or access a public variable, you must use the instance you created above.</p>

<pre class="brush: js;"><p>var myCount = note.NotificationCount;</p><p>&#160;</p><p>note.DisplayNotification(“Yes this is awesome”);</p></pre>

<h2>Why Should I Use Them?</h2>

<p>The quick answer is code organisation and reusability.</p>

<p>Start by moving your global javascript functions into their own class. This will allow you to reference the file only once, but create as many instances of it in your pages as you like. If we took the myNotificationClass for example, this would allow you to create two separate default message displays with ease, like so:</p>

<pre class="brush: js;">var MessageDisplayerOne = myNotificationClass(&quot;I like hotdogs&quot;);

var MessageDisplayerTwo = myNotificationClass(&quot;Icecream is my favourite&quot;);</pre>

<p>This opens up a world of opportunity for creating complex types within javascript.</p>

<h2>Real World Example</h2>

<p>Below are two real world examples I’ve used in some of my projects to help make life easier. Check them out if you’d like a better understanding of how javascript classes are implemented.</p>

<p><a href='/wp-content/uploads/2010/04/Map.debug_.js'>Map.debug</a>
<a href='/wp-content/uploads/2010/04/Ajax.debug_.js'>Ajax.debug</a></p>

<p>I hope this makes it easier to manage your javascript code. Drop me an email on the <a title="Contact Me" href="http://benjii.me/contact-me/">Contact Me</a> page if you have any questions.</p>