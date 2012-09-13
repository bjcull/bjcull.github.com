---
title: How to Force Light Theme in your XAML Windows 8 App
layout: post
date: 2012-09-13
published: true
---

Are you changing your device theme to light in blend (or visual studio) only to find that when you run the application is has reverted back to dark theme? Worry no more.

The fix is delightfully simple. To set your theme to light when using XAML, add the following line to your `app.xaml` just below the `x:Class` line.

    RequestedTheme="Light"

That's it.