---
title: "Simple MVC 2 Pager Control – PagerHtmlHelper"
date: 2010-07-26
layout: post
categories:
- MVC
tags:
- .NET
- HtmlHelper
- Pager
---

I’ve recently discovered a great new tool for MVC 2 that lets you create generic modular controls that can be shared with and used by anyone. So I built a paging control. Now you get a free Pager control AND learn how to build your own html helper. Amazing.

## If you just want the pager control, do this:

1.  Download the three files from the following codeplex project I have created: [http://pagerhtmlhelper.codeplex.com/](http://pagerhtmlhelper.codeplex.com/ "PagerHtmlHelper")
2.  Reference MvcUserControlHtmlHelpers.dll in your web application project.
3.  Place Pager.ascx into the App_Code folder in your web application. If you do not have an App_Code folder, just create one.
4.  Reference the PagerWrapper stylesheet in the head section of your html.
5.  Place the following snippet of code anywhere in any of your views and the pager will render right there:

    <% Html.RenderPager([TotalItemCount],
           [PageSize],
           [PageIndex],
           Request.Url.Query,
           [BaseUrl - It can be relative]); %>

## If you are interested how it works, read this:

So far with MVC 2, if you wanted to render a user control, you would use the RenderPartial method with a link to your control and possibly an accompanying model. The newly created (I’m a little slow, its actually been around since January) MvcUserControlHtmlHelpers library lets you create your own html helpers, complete with intellisense. It also lets you embed a user control absolutely anywhere in any of your views across the entire application with ease.

The beauty of this library is that we can now create simple modular user controls that anyone can quickly download and use. Let’s show you how:

### Lets look at the entire code first:

    <%@ Control Language="C#" Inherits="MvcUserControlHtmlHelpers.UserControlHtmlHelper" ClassName="CoolBlogs" %>

    <script runat="server">
        // Declare Parameters Here
        public List<string> CoolBlogs;
        public int ShowItems;
    </script>

    <%    if (CoolBlogs.Count < ShowItems)
            ShowItems = CoolBlogs.Count;
    %>

    <div class="CoolBlogsWrapper">
        <ul>
        <% for (int i = 0; i < ShowItems; i++) { %>
            <li><%: CoolBlogs[i] %></li>
        <% } %>
        </ul>
    </div>

### Now comes the breakdown

To change our MVC User Control into a html helper, we just change the Inherits attribute to MvcUserControlHtmlHelpers.UserControlHtmlHelper and give the control a name via the ClassName attribute.

You can add parameters to your control by adding the runat server script tags like below. You can use any public property as a parameter.

    // Declare Parameters Here
    public List<string> CoolBlogs;
    public int ShowItems;

Next you can add some server tags to run any C# code you need, before rendering the html.

    <%

        if (CoolBlogs.Count < ShowItems)
            ShowItems = CoolBlogs.Count;
    %>

Finally, the rest is just like a regular user control, letting you add html and server tags as you like.

    <div class="CoolBlogsWrapper">
        <ul>
        <% for (int i = 0; i < ShowItems; i++) { %>
            <li><%: CoolBlogs[i] %></li>
        <% } %>
        </ul>
    </div>

Placing the following code into the App_Code folder of you web application, compiles the code into a single assembly, allowing you to call it from anywhere inside your app.

### How do I call that sucker

Once placed into the App_Code folder, your new html helper can bee called by using the following code:

    <% Html.RenderCoolBlogs(new List<string>() { “Benjii.Me”, “Lukencode”, “DkDevelopment” }, 3); %>

The great thing about the above code, is that it totally works with intellisense, furthering it’s usefulness as a generic control.
