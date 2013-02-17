---
title: QuickEvent - A tiny javascript event engine
layout: post
published: false
---

Creating your own events in javascript can seem a bit unruly, with magic strings and tenuous links between subscriber and publisher. QuickEvent is a tiny piece of javascript that allows you to create events in your code the way you think it should work.

## Give me the code
Here you go:
<script src="https://gist.github.com/bjcull/4970183.js"></script>

## Usage
As with most pub sub event patterns there are two main components, Subscribing and Publishing.

### Subscribe
