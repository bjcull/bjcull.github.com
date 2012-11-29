---
title: Run Multiple SSL Websites on IIS6 Using a Wildcard Certificate
layout: post
published: false
---

I came across this problem whilst setting up a UAT environment at work. Having not dealt with SSL certs before, especially on the older IIS6, it was actually a little challenging to figure out.

## What's the Problem? ##
It turns out that when using SSL, you can only have one website bound to one IP address at a time. Lame. Luckily you can get around this, as long as your websites all use the same certificate, a [wildcard certificate](http://en.wikipedia.org/wiki/Wildcard_certificate).

So for example, using the certificate `*.mycompany.com` I can bind:

 * `mycompany.com`
 * `blog.mycompany.com`
 * `portal.mycompany.com`
 
