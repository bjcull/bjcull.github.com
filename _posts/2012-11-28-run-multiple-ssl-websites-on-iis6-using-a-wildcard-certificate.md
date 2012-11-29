---
title: Run Multiple SSL Websites on IIS6 Using a Wildcard Certificate
layout: post
published: false
---

I came across this problem whilst setting up a UAT environment at work. Having not dealt with SSL certs before, especially on the older IIS6, it was actually a little challenging to figure out.

## What's the Problem? ##
It turns out that when using SSL, you can only have one website bound to one IP address at a time. Lame. Luckily you can get around this, as long as your websites all use the same certificate, a [wildcard certificate](http://en.wikipedia.org/wiki/Wildcard_certificate).

Trying to configure and start two sites using the same cert, port and certificate will result in this error:
[![Imgur](http://i.imgur.com/D3D3g.png)](http://i.imgur.com/D3D3g)

> IIS was unable to start the site. Another site may already be using the port you configured for this site. Please select a unused port for this site.

## The Solution: Enable Multiple SSL Bindings ##

I'm not sure if this is purely an IIS6 problem, but to solve it we need to go to the command line.

Whip open a command prompt and navigate to the following location:
`C:\inetpub\adminscripts\`. If this location doesn't exist, and/or it doesn't contain a file named `adsutil.vbs` then follow these instructions to [Install Missing IIS Admin Scripts](http://www.exactsoftware.com/docs/docview.aspx?documentid=%7B0066f7b8-89a1-4011-80a0-0bd1755899ea%7D&NoHeader=1&NoSubject=1) before moving on.
