---
title: Is Active Route Tag Helper for ASP.NET MVC Core
date: 2017-01-29
layout: post
published: true
---

If you want the active route to appear highlighted in your navigation menu when you navigate to a page in ASP.NET MVC Core, this handy tag helper will do it for you.

The bulk of this code has been taken from an [excellent blog post by Patrick Niezen](http://www.patrickniezen.com/2016/10/2/marking-html-elements-active-based-on-the-current-route-using-asp-net-mvc-tag-helpers) whereby he improves a sample TagHelper that creates a navigation link for you. It's an excellent read, and many of you would probably prefer to use his code instead. The main adaptation I've made is to ensure **this tag helper only adds the "active" class, it does not create a url or anchor tag**.

I much prefer to have control over my html and I also want the flexibility to highlight the navigation link seperately from the url it points to.

Let's take a look at the code.

## ActiveRouteTagHelper code

<script src="https://gist.github.com/bjcull/4bdcc9d24e25cbac269e77dd93830ee3.js"></script>

I'm not going to explain how this works, rather I just want to point out that a lot of the properties were taken straight from the built-in `AnchorTagHelper`, which is why it might look scary. 

Take the time to read the code carefully, each part of it will start to make sense, especially once you've done some more research.

Once you're comfortable, copy this code into a class inside your project.

## Setup

Once you've added this class to your project, ensure the following code is inside your `Views\_ViewImports.cshtml`.

    @addTagHelper *, Pinch.SDK.WebSample

Replace the Pinch.SDK.WebSample with your own assembly name.

## Usage

    <ul class="nav nav-sidebar">
        <li is-active-route asp-controller="Home" asp-action="Index"><a asp-controller="Home" asp-action="Index">Overview</a></li>
        <li is-active-route asp-controller="Payers"><a asp-controller="Payers" asp-action="Index">Payers</a></li>
        <li is-active-route asp-controller="Transfers"><a asp-controller="Transfers" asp-action="Index">Transfers</a></li>
        <li is-active-route asp-controller="Merchants"><a asp-controller="Merchants" asp-action="Index">Merchants</a></li>
        <li is-active-route asp-controller="Home" asp-action="Connect"><a asp-controller="Home" asp-action="Connect">Connect</a></li>
    </ul>

There are a couple of things to note here.

 - The asp-* attributes on the `li` tag can be different from the `a` tag. This is great for when you just want to highlight all routes on a single controller.
 - You can be as specific as you like, including adding route values using syntax like `asp-route-id="24"` or `asp-route-myRouteValue="cottageCheese"`.

You can explore the example code I've given above by visiting my [Pinch SDK Sample Code](https://github.com/bjcull/Pinch.SDK).

If you'd like to know more about how tag helpers work check out these great resources:

 - [Tag Helper Samples on Github](https://github.com/dpaquette/TagHelperSamples)
 - [Authoring Tag Helpers](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/authoring)
 - [Introducing ASP.NET Core MVC Tag Helpers](https://www.intertech.com/Blog/introducing-asp-net-core-mvc-tag-helpers/)
