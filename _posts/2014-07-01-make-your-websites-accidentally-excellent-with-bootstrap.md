---
title: Make your Web Apps Accidentally Excellent with Bootstrap
date: 2014-07-01
layout: post
published: false
---

Bootstrap is a sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development. Join me as I show you how easy it is to make use of the framework, and step beyond the "just another bootstrap site" look and feel. 

I presented this content at a recent set of Usergroups in Brisbane, Canberra and Sydney. You can check out the entire Sydney presentation below. I recommend taking the time to watch as there are plenty of good questions and it gives more context to the written content below.

[TODO: embed below code]

    <iframe width="560" height="315" src="//www.youtube.com/embed/xKvzr6NDeS8" frameborder="0" allowfullscreen="allowfullscreen">&nbsp;</iframe>

Not everyone loves the sound of my voice, so therefore I've included a breakdown of the presentation below. Enjoy.


## What is Bootstrap?

A CSS and Javascript framework to enable quick and consistent web application development. The idea is that we write less custom CSS and instead make use of a set of standard classes to achieve a clean design.


## A Brief History

- **1995**: The internet was invented and everyone was using tables.
- **1997**: CSS 2 was released and everyone started making use of divs.
- **2001 - 2006**: The lifespan of IE6 (Browser specific pains)
- **2005**: jQuery was released. Everyone began to create fancier designs lots of animation.
- **2007**: jQueryUI was released. Closer to consistent design. Visual components introduced.
- **2011**: Bootstrap 1 released. A repository of design resources from the Twitter team.


## About Me

I'm a Senior Software Architect at SSW in Brisbane. You can get in contact with me to get any help if you need it. I also love beer :)


## Previous Video: Twitter Bootstrap & ASP.NET MVC -- Intro / Quickstart with Ben Cull

For a much more practical getting started guide, you can check out this video I recorded fairly recently. It will take you from zero to a beginner in under 20 mins.

[TODO: embed the below video]

    <iframe width="560" height="315" src="//www.youtube.com/embed/bIGiUSMBwoo" frameborder="0" allowfullscreen="allowfullscreen">&nbsp;</iframe>


## Bootstrap out of the box

When you open up a File > New Project these days, Bootstrap is included by default.

![Bootstrap in your project](/wp-content/uploads/2014/07/Bootstrap-Project.png)  
*Figure: Bootstrap files included in a new project*

You can also add it yourself by using the following NuGet package:

    -> Install-Package bootstrap

And add the following lines to your `BundleConfig.cs`

    bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js"));

    bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
                "~/Content/bootstrap.css"));


## Grid System

If you take nothing else away from Bootstrap, make sure you at least remember the Grid System. It's made up of the following three classes.

- `.container` - The outermost container for your content. Defines your content width.
- `.row` - Logically segments your content vertically.
- `col-md-12` - Defines a column. You can use any combination of 12 segments.

Check out an example below:

![The grid system in action](/wp-content/uploads/2014/07/GridSystem.gif)  
*Figure: The grid system in action*

