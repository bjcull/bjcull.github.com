---
title: Get the Absolute URI from ASP.NET MVC Content or Action
date: 2015-05-20
layout: post
published: true
---

There are times when you need to get the full url from an action or content. This also crops up when you create short urls. Here are the best ways to get it done in ASP.NET MVC.

## Razor - Action

    @Url.Action("About", "Home", null, Request.Url.Scheme)

Adding the scheme to the URL Helper causes it to output the full url.


## C# - Action

    var urlBuilder =
        new System.UriBuilder(Request.Url.AbsoluteUri)
            {
                Path = Url.Action("Action", "Controller"),
                Query = null,
            };

    Uri uri = urlBuilder.Uri;
    string url = urlBuilder.ToString();

Thanks to the helpful UriBuilder class we can parse the current absolute URI and replace the path with our own. This also gives us the option of retrieving a URI class or string URL.

I've made the query string null, but if you want a query string anything you add here will be appended to the url.

## C# - Content

    var urlBuilder =
        new System.UriBuilder(Request.Url.AbsoluteUri)
            {
                Path = Url.Content("~/path/to/anything"),
                Query = null,
            };

    Uri uri = urlBuilder.Uri;
    string url = urlBuilder.ToString();

Same again, but using the Content method.

---

Like most useful code snippets these were cobbled together from various stack overflow posts. Give them an upvote will ya?  

 - [http://stackoverflow.com/questions/7406258/getting-absolute-url-fron-an-asp-net-mvc-action](http://stackoverflow.com/questions/7406258/getting-absolute-url-fron-an-asp-net-mvc-action)
 - [http://stackoverflow.com/questions/434604/how-do-i-find-the-absolute-url-of-an-action-in-asp-net-mvc](http://stackoverflow.com/questions/434604/how-do-i-find-the-absolute-url-of-an-action-in-asp-net-mvc)
