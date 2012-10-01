---
title: Using LESS CSS With MVC4 Web Optimization
date: 2012-10-01
layout: post
published: false
---

# Using LESS CSS With MVC4 Web Optimization

MVC4 has a built in bundler and optimizer for javascript and css, but when you want to use LESS CSS, there's a few things you need to do to get set up.

## Step 1: Add BundleTransformer.Less from Nuget

[BundleTransformer.Less](http://bundletransformer.codeplex.com/wikipage?title=Bundle%20Transformer%201.6.2) is an excellent modular extension to Web.Optimization, allowing us to get our css and js bundling set up quickly. 

We're going to use the [BundleTransformer.Less Nuget Package](http://nuget.org/packages/BundleTransformer.Less) which will add the bundler core and dotless as well. This package is where most of the magic is performed. In the background it's just setting up dotless to transform the css before bundling. 

## Step 2: Set up your CSS and JS bundles

A bundle is just a group of css or js references. 