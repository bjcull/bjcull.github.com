---
title: "Simple MVC 2 Pager Control – PagerHtmlHelper"
date: 2010-07-26
layout: post
categories:
- &o0 MVC
tags:
- .NET
- HtmlHelper
- *o0
- Pager
---

I’ve recently discovered a great new tool for MVC 2 that lets you create generic modular controls that can be shared with and used by anyone. So I built a paging control. Now you get a free Pager control AND learn how to build your own html helper. Amazing.
<h2>If you just want the pager control, do this:</h2>
<ol>
	<li>Download the three files from the following codeplex project I have created: <a title="PagerHtmlHelper" href="http://pagerhtmlhelper.codeplex.com/" target="_blank">http://pagerhtmlhelper.codeplex.com/</a></li>
	<li>Reference MvcUserControlHtmlHelpers.dll in your web application project.</li>
	<li>Place Pager.ascx into the App_Code folder in your web application. If you do not have an App_Code folder, just create one.</li>
	<li>Reference the PagerWrapper stylesheet in the head section of your html.</li>
	<li>Place the following snippet of code anywhere in any of your views and the pager will render right there:</li>
</ol>
<pre class="brush: csharp; ruler: true;">&lt;% Html.RenderPager([TotalItemCount],
       [PageSize],
       [PageIndex],
       Request.Url.Query,
       [BaseUrl - It can be relative]); %&gt;</pre>
<h2>If you are interested how it works, read this:</h2>
So far with MVC 2, if you wanted to render a user control, you would use the RenderPartial method with a link to your control and possibly an accompanying model. The newly created (I’m a little slow, its actually been around since January) MvcUserControlHtmlHelpers library lets you create your own html helpers, complete with intellisense. It also lets you embed a user control absolutely anywhere in any of your views across the entire application with ease.

The beauty of this library is that we can now create simple modular user controls that anyone can quickly download and use. Let’s show you how:
<h3>Lets look at the entire code first:</h3>
<pre class="brush: csharp; ruler: true;">
&lt;%@ Control Language="C#" Inherits="MvcUserControlHtmlHelpers.UserControlHtmlHelper" ClassName="CoolBlogs" %&gt;

&lt;script runat="server"&gt;
    // Declare Parameters Here
    public List&lt;string&gt; CoolBlogs;
    public int ShowItems;
&lt;/script&gt;


&lt;%    if (CoolBlogs.Count &lt; ShowItems)
        ShowItems = CoolBlogs.Count;
%&gt;


&lt;div class="CoolBlogsWrapper"&gt;
    &lt;ul&gt;
    &lt;% for (int i = 0; i &lt; ShowItems; i++) { %&gt;
        &lt;li&gt;&lt;%: CoolBlogs[i] %&gt;&lt;/li&gt;
    &lt;% } %&gt;
    &lt;/ul&gt;
&lt;/div&gt;
</pre>
<h3>Now comes the breakdown</h3>
To change our MVC User Control into a html helper, we just change the Inherits attribute to MvcUserControlHtmlHelpers.UserControlHtmlHelper and give the control a name via the ClassName attribute.
<pre class="brush: csharp; ruler: true;">&lt;%@ Control Language="C#" Inherits="MvcUserControlHtmlHelpers.UserControlHtmlHelper" ClassName="CoolBlogs" %&gt;</pre>
You can add parameters to your control by adding the runat server script tags like below. You can use any public property as a parameter.
<pre class="brush: csharp; ruler: true;">&lt;script runat="server"&gt;
    // Declare Parameters Here
    public List&lt;string&gt; CoolBlogs;
    public int ShowItems;
&lt;/script&gt;</pre>
Next you can add some server tags to run any C# code you need, before rendering the html.
<pre class="brush: csharp; ruler: true;">
&lt;%

    if (CoolBlogs.Count &lt; ShowItems)
        ShowItems = CoolBlogs.Count;
%&gt;
</pre>
Finally, the rest is just like a regular user control, letting you add html and server tags as you like.
<pre class="brush: csharp; ruler: true;">
&lt;div class="CoolBlogsWrapper"&gt;
    &lt;ul&gt;
    &lt;% for (int i = 0; i &lt; ShowItems; i++) { %&gt;
        &lt;li&gt;&lt;%: CoolBlogs[i] %&gt;&lt;/li&gt;
    &lt;% } %&gt;
    &lt;/ul&gt;
&lt;/div&gt;

</pre>
Placing the following code into the App_Code folder of you web application, compiles the code into a single assembly, allowing you to call it from anywhere inside your app.
<h3>How do I call that sucker</h3>
Once placed into the App_Code folder, your new html helper can bee called by using the following code:
<pre class="brush: csharp; ruler: true;">
&lt;% Html.RenderCoolBlogs(new List&lt;string&gt;() { “Benjii.Me”, “Lukencode”, “DkDevelopment” }, 3); %&gt;

</pre>
The great thing about the above code, is that it totally works with intellisense, furthering it’s usefulness as a generic control.