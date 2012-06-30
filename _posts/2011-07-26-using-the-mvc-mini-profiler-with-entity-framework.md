---
title: Using the MVC-Mini-Profiler with Entity Framework
date:
  DateTime: 2011-07-26T04:07:56.0000000
  UtcDateTime: 2011-07-26T04:07:56.0000000Z
  LocalDateTime: 2011-07-26T14:07:56.0000000+10:00
  Date: 2011-07-26T00:00:00.0000000
  Day: 26
  DayOfWeek: Tuesday
  DayOfYear: 207
  Hour: 4
  Minute: 7
  Month: 7
  Second: 56
  Ticks: 634472500760000000
  UtcTicks: 634472500760000000
  TimeOfDay:
    Ticks: 148760000000
    Hours: 4
    Minutes: 7
    Seconds: 56
    TotalDays: 0.172175925925926
    TotalHours: 4.13222222222222
    TotalMilliseconds: 14876000
    TotalMinutes: 247.933333333333
    TotalSeconds: 14876
  Year: 2011
layout: post
categories:
- MVC
tags:
- database
- entity framework
- mvc mini profiler
- performance
- sql
---

<p><a href="http://benjii.me/wp-content/uploads/2011/07/starting-a-blog-how-do-you-measure-success.jpg"><img style="background-image: none; border-bottom: 0px; border-left: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: right; border-top: 0px; border-right: 0px; padding-top: 0px" title="Notice how the success sign points at the title?" border="0" alt="Notice how the success sign points at the title?" align="right" src="http://benjii.me/wp-content/uploads/2011/07/starting-a-blog-how-do-you-measure-success_thumb.jpg" width="244" height="183" /></a>The MVC Mini Profiler is an awesome tool that can help you reduce your page load times by showing you exactly how long each action, database query, view and even partial view took to load. It can be a little tricky to get right, especially using Entity Framework, but if you follow these steps you should be up and running in no time.</p>  <h2>Step 1: Nuget it Baby</h2>  <p>       <a href="http://nuget.org/List/Packages/MiniProfiler"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="Mini Profiler Nuget Package" border="0" alt="PM&gt; Install-Package MiniProfiler" src="http://benjii.me/wp-content/uploads/2011/07/image_5.png" width="445" height="92" /></a></p>  <p>If you haven’t used Nuget yet, now would be an excellent time to start as it makes adding references to third party assemblies a breeze. Click the link above to go to the package page to find out more.</p>  <p>By the time you’re done with this step, you should end up with a reference to the mini profiler in your project.</p>  <h2>Step 2: Hook it up</h2>  <p>To get the profiler profiling all we need to do is add the following to our Global.asax.cs:</p>  <pre class="brush: csharp; ruler: true;">protected void Application_BeginRequest()
{
    if (Request.IsLocal)
    {
        MiniProfiler.Start();
    }
}

protected void Application_EndRequest()
{
    MiniProfiler.Stop();
}</pre>
<p>Adding the check for Request.IsLocal means that the profiler will only run when the site is loaded locally. Feel free to add your own check's. It's usually handy to check for a cookie or an admin login, to see performance on a production website.</p>
<h2>Step 3: Add the includes (and you’re finished)</h2>

<p>Add this quick line of code to your _layout view or at the end of your head section. This adds the necessary javascript and css to keep it neat and tidy in the corner.</p>

<pre class="brush: csharp; ruler: true;">@MvcMiniProfiler.MiniProfiler.RenderIncludes()</pre>

<p>By this point you can fire up your web pages and watch the pretty profiler in action, however it will be a bit bare. Read on to add extra bits and pieces to your fancy new profiler.</p>

<h2>Step 4 (Optional): I want SQL profiling!</h2>

<p>Very good sir, the profiler supports quite a number of database providers. I’m going to focus on using Entity Framework, as that’s where I had the most trouble. Luckily the good community at Stack Overflow have done the leg work here so we can benefit from their genius. Simply use the following code to retrieve your DB context:</p>

<pre class="brush: csharp; ruler: true;">public static T GetProfiledContext&lt;T&gt;() where T : System.Data.Objects.ObjectContext
{
    var conn = ProfiledDbConnection.Get(GetStoreConnection&lt;T&gt;());
    return ObjectContextUtils.CreateObjectContext&lt;T&gt;(conn);
}

public static DbConnection GetStoreConnection&lt;T&gt;() where T : System.Data.Objects.ObjectContext
{
    return GetStoreConnection(&quot;name=&quot; + typeof(T).Name);
}

public static DbConnection GetStoreConnection(string entityConnectionString)
{
    // Build the initial connection string.
    var builder = new EntityConnectionStringBuilder(entityConnectionString);

    // If the initial connection string refers to an entry in the configuration, load that as the builder.
    object configName;
    if (builder.TryGetValue(&quot;name&quot;, out configName))
    {
        var configEntry = WebConfigurationManager.ConnectionStrings[configName.ToString()];
        builder = new EntityConnectionStringBuilder(configEntry.ConnectionString);
    }

    // Find the proper factory for the underlying connection.
    var factory = DbProviderFactories.GetFactory(builder.Provider);

    // Build the new connection.
    DbConnection tempConnection = null;
    try
    {
        tempConnection = factory.CreateConnection();
        tempConnection.ConnectionString = builder.ProviderConnectionString;

        var connection = tempConnection;
        tempConnection = null;
        return connection;
    }
    finally
    {
        // If creating of the connection failed, dispose the connection.
        if (tempConnection != null)
        {
            tempConnection.Dispose();
        }
    }
}</pre>

<p>Just call the GetProfiledContext Method with your entities class like so:</p>

<pre class="brush: csharp; ruler: true;">var context = GetProfiledContext&lt;MyModelEntities&gt;();</pre>

<p>Finally, we need to add this snippet to our web.config to allow for the DbProviderFactories class to do it’s job properly:</p>

<pre class="brush:xml; ruler: true;">&lt;system.data&gt;
    &lt;dbproviderfactories&gt;
        &lt;remove invariant=&quot;MvcMiniProfiler.Data.ProfiledDbProvider&quot; /&gt;
        &lt;add description=&quot;MvcMiniProfiler.Data.ProfiledDbProvider&quot; invariant=&quot;MvcMiniProfiler.Data.ProfiledDbProvider&quot; type=&quot;MvcMiniProfiler.Data.ProfiledDbProviderFactory, MvcMiniProfiler, Version=1.6.0.0, Culture=neutral, PublicKeyToken=b44f9351044011a3&quot; name=&quot;MvcMiniProfiler.Data.ProfiledDbProvider&quot; /&gt;
    &lt;/dbproviderfactories&gt;
&lt;/system.data&gt;</pre>

<p>Note that this config is for assembly version 1.6.0.0, in future you may need to change this number.</p>

<p>That's it! You should now see some sql load times to your page load times, and if you click the link it will show you the queries generated, duplicate queries and other sql goodies.</p>

<h2>Step 5 (Optional): I want Automatic Controller, View and Partial Profiling!</h2>

<p>Well have you come to the right place. Just the other day Sam Saffron posted about automatic controller and view profiling and it couldn’t be simpler. Create these two classes:</p>

<p>ProfilingActionFilter.cs</p>

<pre class="brush: csharp; ruler: true;">public class ProfilingActionFilter : ActionFilterAttribute
{
    const string stackKey = &quot;ProfilingActionFilterStack&quot;;

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var mp = MiniProfiler.Current;
        if (mp != null)
        {
            var stack = HttpContext.Current.Items[stackKey] as Stack&lt;IDisposable&gt;;
            if (stack == null)
            {
                stack = new Stack&lt;IDisposable&gt;();
                HttpContext.Current.Items[stackKey] = stack;
            }

            var prof = MiniProfiler.Current.Step(&quot;Controller: &quot; + filterContext.Controller.ToString() + &quot;.&quot; + filterContext.ActionDescriptor.ActionName);
            stack.Push(prof);

        }
        base.OnActionExecuting(filterContext);
    }

    public override void OnActionExecuted(ActionExecutedContext filterContext)
    {
        base.OnActionExecuted(filterContext);
        var stack = HttpContext.Current.Items[stackKey] as Stack&lt;IDisposable&gt;;
        if (stack != null &amp;&amp; stack.Count &gt; 0)
        {
            stack.Pop().Dispose();
        }
    }
}</pre>

<p>ProfilingViewEngine.cs</p>

<pre class="brush: csharp; ruler: true;">public class ProfilingViewEngine : IViewEngine
{
    class WrappedView : IView
    {
        IView wrapped;
        string name;
        bool isPartial;

        public WrappedView(IView wrapped, string name, bool isPartial)
        {
            this.wrapped = wrapped;
            this.name = name;
            this.isPartial = isPartial;
        }

        public void Render(ViewContext viewContext, System.IO.TextWriter writer)
        {
            using (MiniProfiler.Current.Step(&quot;Render &quot; + (isPartial ? &quot;partial&quot; : &quot;&quot;) + &quot;: &quot; + name))
            {
                wrapped.Render(viewContext, writer);
            }
        }
    }

    IViewEngine wrapped;

    public ProfilingViewEngine(IViewEngine wrapped)
    {
        this.wrapped = wrapped;
    }

    public ViewEngineResult FindPartialView(ControllerContext controllerContext, string partialViewName, bool useCache)
    {
        var found = wrapped.FindPartialView(controllerContext, partialViewName, useCache);
        if (found != null &amp;&amp; found.View != null)
        {
            found = new ViewEngineResult(new WrappedView(found.View, partialViewName, isPartial: true), this);
        }
        return found;
    }

    public ViewEngineResult FindView(ControllerContext controllerContext, string viewName, string masterName, bool useCache)
    {
        var found = wrapped.FindView(controllerContext, viewName, masterName, useCache);
        if (found != null &amp;&amp; found.View != null)
        {
            found = new ViewEngineResult(new WrappedView(found.View, viewName, isPartial: false), this);
        }
        return found;
    }

    public void ReleaseView(ControllerContext controllerContext, IView view)
    {
        wrapped.ReleaseView(controllerContext, view);
    }
}</pre>

<p>Finally, add this snippet of code to your Global.asax.cs - Application_Start() method to hook it up:</p>

<pre class="brush: csharp; ruler: true;">// Add Profiling Action Filter (mvc mini profiler)
GlobalFilters.Filters.Add(new ProfilingActionFilter());

// Add Profiling View Engine (mvc mini profiler)
var copy = ViewEngines.Engines.ToList();
ViewEngines.Engines.Clear();
foreach (var item in copy)
{
    ViewEngines.Engines.Add(new ProfilingViewEngine(item));
}

RegisterGlobalFilters(GlobalFilters.Filters);</pre>

<h2>References and More Information</h2>

<p>Enjoy your brand new MVC Mini Profiler. Many thanks go to the following collection of awesome links that I've sourced the different code snippets from. Be sure to check them out for extra details and clarity.</p>

<p><a href="http://code.google.com/p/mvc-mini-profiler/">The MVC Mini Profiler Home Page</a></p>

<p><a href="http://www.hanselman.com/blog/NuGetPackageOfTheWeek9ASPNETMiniProfilerFromStackExchangeRocksYourWorld.aspx">Scott Hanselman's post about using the MVC Mini Profiler</a></p>

<p><a href="http://stackoverflow.com/questions/6296444/using-mvc-mini-profiler-with-ef-4-0-and-ninject">Stack Overflow solution to the EF connection problem</a></p>

<p><a href="http://stackoverflow.com/questions/6550046/using-mvc-mini-profiler-database-profiling-with-entity-framework-code-first">Stack Overflow inspiration for web config changes</a></p>

<p><a href="http://samsaffron.com/archive/2011/07/25/Automatically+instrumenting+an+MVC3+app">Sam Saffron's post on Automatic Controller and View Profiling</a></p>