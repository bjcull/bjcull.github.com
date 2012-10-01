---
title: Using LESS CSS With MVC4 Web Optimization
date: 2012-10-01
layout: post
published: false
---

# Using LESS CSS With MVC4 Web Optimization

MVC4 has a built in bundler and optimizer for javascript and css, but when you want to use LESS CSS, there's a few things you need to do to get set up.

## Step 1: Add BundleTransformer.Less from Nuget

[BundleTransformer.Less](http://bundletransformer.codeplex.com/wikipage?title=Bundle%20Transformer%201.6.2) is an excellent modular extension to Web.Optimization by [taritsyn](http://taritsyn.wordpress.com/), allowing us to get our css and js bundling set up quickly. 

We're going to use the [BundleTransformer.Less Nuget Package](http://nuget.org/packages/BundleTransformer.Less) which will add the bundler core and dotless as well. This package is where most of the magic is performed. In the background it's just setting up dotless to transform the css before bundling. 

## Step 2: Set up your CSS and JS bundles

A bundle is just a group of css or js references. When starting a new MVC4 project, you'll have a file called `BundleConfig.cs` in your `App_Start` folder. This is where all our css and js references will go.

Take a look at how I've set this up:

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            var cssTransformer = new CssTransformer();
            var jsTransformer = new JsTransformer();
            var nullOrderer = new NullOrderer();

            var css = new StyleBundle("~/bundles/css")
                .Include("~/Content/site.less");
            css.Transforms.Add(cssTransformer);
            css.Orderer = nullOrderer;

            bundles.Add(css);
            
            var jquery = new ScriptBundle("~/bundles/jquery")
                .Include("~/Scripts/jquery-1.*");
            jquery.Transforms.Add(jsTransformer);
            jquery.Orderer = nullOrderer;

            bundles.Add(jquery);
        }
    }