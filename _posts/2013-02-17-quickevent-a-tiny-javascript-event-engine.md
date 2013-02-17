---
title: QuickEvent - A tiny javascript event engine
date: 2013-02-17 15:00:00
layout: post
published: true
twitter_metadata: |
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@benjii22">
    <meta name="twitter:creator" content="@benjii22">
    <meta name="twitter:url" content="http://benjii.me/2013/02/quickevent-a-tiny-javascript-event-engine/">
    <meta name="twitter:title" content="QuickEvent - A tiny javascript event engine">
    <meta name="twitter:description" content="QuickEvent is a tiny piece of javascript that allows you to create events in your code the way you think it should work.">
    <meta name="twitter:image" content="http://benjii.me/wp-content/uploads/2013/02/speed.png">
---

Creating your own events in javascript can seem a bit unruly, with magic strings and tenuous links between subscriber and publisher. QuickEvent is a tiny piece of javascript that allows you to create events in your code the way you think it should work.

## Give me the code
Here you go:
<script src="https://gist.github.com/bjcull/4970183.js"> </script>

### Usage: Create Event
Creating a new event is as simple as instantiating a new variable.

    var onTweet = new QuickEvent();
    
Once we've created our event and as with most pubsub event patterns there are two main components, Subscribing and Publishing.

### Usage: Subscribe
To Subscribe to an event, you use the subscribe method as shown below:

    onTweet.subscribe(function (tweet, user) {
        console.log(user + " totally just tweeted this: " + tweet);
    });

Where did the parameters tweet and user come from? Ah, well the beauty of QuickEvent is that anything you pass in will be passed out as seen below in the Publish section.

### Usage: Publish

Publishing an event triggers the data to be sent to all subscribers, hence why I've named the method "trigger" (I felt it better describes what is happening). You can trigger an event by using the following code:

    onTweet.trigger(this, "I love the way this works", "@benjii22");
    
You might be asking, "Why are there three arguments when only two arrive at the subscriber?" Well the first argument allows you to set the "this" scope at the subscriber end. In this case I've set the "this" of the subscriber to be the "this" of this. Confused? I was too until I spent some time with [this amazing javascript tutorial by John Resig](http://ejohn.org/apps/learn/). Seriously, spend some time reading and completing the tutorial (it's interactive). It's well worth it.

Anyway, the idea is that the first argument will set the context, and then you can add as many arguments as you like afterwards and they'll all be passed to the subscribers. Different events can have different numbers of parameters, it's up to you.

<div>
	<blockquote class="twitter-tweet" align="center"><p>Just blogged about a javascript event engine I whipped up. What are your thoughts? <a href="http://t.co/ziZRtvuF" title="http://benjii.me/2013/02/quickevent-a-tiny-javascript-event-engine/">benjii.me/2013/02/quicke…</a></p>&mdash; Ben Cull (@benjii22) <a href="https://twitter.com/benjii22/status/303019945208451072">February 17, 2013</a></blockquote>
</div>