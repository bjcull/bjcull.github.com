---
title: Using LESS CSS With MVC4 Web Optimization
date: 2012-10-01
layout: post
published: true
---

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

            var css = new Bundle("~/bundles/css")
                .Include("~/Content/site.less");
            css.Transforms.Add(cssTransformer);
            css.Orderer = nullOrderer;

            bundles.Add(css);
            
            var jquery = new Bundle("~/bundles/jquery")
                .Include("~/Scripts/jquery-1.*");
            jquery.Transforms.Add(jsTransformer);
            jquery.Orderer = nullOrderer;

            bundles.Add(jquery);
            
            // If you'd like to test the optimization locally,
            // you can use this line to force it.
            //BundleTable.EnableOptimizations = true;            
        }
    }
    
A couple of things to note here:

 * The `cssTransformer` and `jsTransformer` variables tie in the BundleTransformer to the pipeline.
 * The `nullOrderer` variable forces the optimizer to reference the files in the order they are defined.
 * The string we pass to the `Bundle` constructor is a virtual path. Don't use a real path otherwise you'll run into some funky routing issues.
 * The `BundleTable.EnableOptimizations = true;` allows you to force the optimizations to render as they would in release mode.
 
## Step 3: Reference the Bundles in your Layout View

Open up your `_Layout.cshtml` and add the following code to your head tag:

    @Styles.Render("~/bundles/css")
    
This will render any of the stylesheets we included earlier. Note that we're referencing the virtual path we gave to the StyleBundle class.

You can also add the javascript bundle to the bottom of the page in the same way:

    @Scripts.Render("~/bundles/jquery")

That's It!

Thanks to [Andrey Taritsyn](https://plus.google.com/u/0/104102250252560157369/about) for giving me some pointers about the code I've posted. You should absolutely check out the rest of the [Bundle Transformer Range](http://bundletransformer.codeplex.com/) for other useful modules including SASS, CoffeeScript, YUI, JSMin, WebGrease and much more...