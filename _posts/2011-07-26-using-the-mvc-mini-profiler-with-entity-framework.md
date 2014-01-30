---
title: Using the MVC-Mini-Profiler with Entity Framework
date: 2011-07-26
layout: post
categories:
- MVC
tags:
- database
- entity framework
- mvc mini profiler
- performance
- sql
published: true
---

[![Notice how the success sign points at the title?](/wp-content/uploads/2011/07/starting-a-blog-how-do-you-measure-success_thumb.jpg "Notice how the success sign points at the title?")
](/wp-content/uploads/2011/07/starting-a-blog-how-do-you-measure-success.jpg)
The MVC Mini Profiler is an awesome tool that can help you reduce your page load times by showing you exactly how long each action, database query, view and even partial view took to load. It can be a little tricky to get right, especially using Entity Framework, but if you follow these steps you should be up and running in no time.

## Step 1: Nuget it Baby

[![PM> Install-Package MiniProfiler](/wp-content/uploads/2011/07/image_5.png "Mini Profiler Nuget Package")](http://nuget.org/List/Packages/MiniProfiler)

If you haven’t used Nuget yet, now would be an excellent time to start as it makes adding references to third party assemblies a breeze. Click the link above to go to the package page to find out more.

By the time you’re done with this step, you should end up with a reference to the mini profiler in your project.

## Step 2: Hook it up

To get the profiler profiling all we need to do is add the following to our Global.asax.cs:

    protected void Application_BeginRequest()
    {
        if (Request.IsLocal)
        {
            MiniProfiler.Start();
        }
    }

    protected void Application_EndRequest()
    {
        MiniProfiler.Stop();
    }

Adding the check for Request.IsLocal means that the profiler will only run when the site is loaded locally. Feel free to add your own checks. It's usually handy to check for a cookie or an admin login, to see performance on a production website.

## Step 3: Add the includes (and you’re finished)

Add this quick line of code to your `_layout` view or at the end of your head section. This adds the necessary javascript and css to keep it neat and tidy in the corner.

    @MvcMiniProfiler.MiniProfiler.RenderIncludes()

By this point you can fire up your web pages and watch the pretty profiler in action, however it will be a bit bare. Read on to add extra bits and pieces to your fancy new profiler.

## Step 4 (Optional): I want SQL profiling!

Very good sir, the profiler supports quite a number of database providers. I’m going to focus on using Entity Framework, as that’s where I had the most trouble. Luckily the good community at Stack Overflow have done the leg work here so we can benefit from their genius. Simply use the following code to retrieve your DB context:

    public static T GetProfiledContext<T>() where T : System.Data.Objects.ObjectContext
    {
        var conn = ProfiledDbConnection.Get(GetStoreConnection<T>());
        return ObjectContextUtils.CreateObjectContext<T>(conn);
    }

    public static DbConnection GetStoreConnection<T>() where T : System.Data.Objects.ObjectContext
    {
        return GetStoreConnection("name=" + typeof(T).Name);
    }

    public static DbConnection GetStoreConnection(string entityConnectionString)
    {
        // Build the initial connection string.
        var builder = new EntityConnectionStringBuilder(entityConnectionString);

        // If the initial connection string refers to an entry in the configuration, load that as the builder.
        object configName;
        if (builder.TryGetValue("name", out configName))
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
    }

Just call the GetProfiledContext Method with your entities class like so:

    var context = GetProfiledContext<MyModelEntities>();

Finally, we need to add this snippet to our web.config to allow for the DbProviderFactories class to do it’s job properly:

    <system.data>
        <dbproviderfactories>
            <remove invariant="MvcMiniProfiler.Data.ProfiledDbProvider" />
            <add description="MvcMiniProfiler.Data.ProfiledDbProvider" invariant="MvcMiniProfiler.Data.ProfiledDbProvider" type="MvcMiniProfiler.Data.ProfiledDbProviderFactory, MvcMiniProfiler, Version=1.6.0.0, Culture=neutral, PublicKeyToken=b44f9351044011a3" name="MvcMiniProfiler.Data.ProfiledDbProvider" />
        </dbproviderfactories>
    </system.data>

Note that this config is for assembly version 1.6.0.0, in future you may need to change this number.

That's it! You should now see some sql load times to your page load times, and if you click the link it will show you the queries generated, duplicate queries and other sql goodies.

## Step 5 (Optional): I want Automatic Controller, View and Partial Profiling!

Well have you come to the right place. Just the other day Sam Saffron posted about automatic controller and view profiling and it couldn’t be simpler. Create these two classes:

ProfilingActionFilter.cs

    public class ProfilingActionFilter : ActionFilterAttribute
    {
        const string stackKey = "ProfilingActionFilterStack";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var mp = MiniProfiler.Current;
            if (mp != null)
            {
                var stack = HttpContext.Current.Items[stackKey] as Stack<IDisposable>;
                if (stack == null)
                {
                    stack = new Stack<IDisposable>();
                    HttpContext.Current.Items[stackKey] = stack;
                }

                var prof = MiniProfiler.Current.Step("Controller: " + filterContext.Controller.ToString() + "." + filterContext.ActionDescriptor.ActionName);
                stack.Push(prof);

            }
            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            var stack = HttpContext.Current.Items[stackKey] as Stack<IDisposable>;
            if (stack != null &amp;&amp; stack.Count > 0)
            {
                stack.Pop().Dispose();
            }
        }
    }

ProfilingViewEngine.cs

    public class ProfilingViewEngine : IViewEngine
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
                using (MiniProfiler.Current.Step("Render " + (isPartial ? "partial" : "") + ": " + name))
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
    }

Finally, add this snippet of code to your Global.asax.cs - Application_Start() method to hook it up:

    // Add Profiling Action Filter (mvc mini profiler)
    GlobalFilters.Filters.Add(new ProfilingActionFilter());
    
    // Add Profiling View Engine (mvc mini profiler)
    var copy = ViewEngines.Engines.ToList();
    ViewEngines.Engines.Clear();
    foreach (var item in copy)
    {
        ViewEngines.Engines.Add(new ProfilingViewEngine(item));
    }
    
    RegisterGlobalFilters(GlobalFilters.Filters);

## References and More Information

Enjoy your brand new MVC Mini Profiler. Many thanks go to the following collection of awesome links that I've sourced the different code snippets from. Be sure to check them out for extra details and clarity.

[The MVC Mini Profiler Home Page](http://code.google.com/p/mvc-mini-profiler/)

[Scott Hanselman's post about using the MVC Mini Profiler](http://www.hanselman.com/blog/NuGetPackageOfTheWeek9ASPNETMiniProfilerFromStackExchangeRocksYourWorld.aspx)

[Stack Overflow solution to the EF connection problem](http://stackoverflow.com/questions/6296444/using-mvc-mini-profiler-with-ef-4-0-and-ninject)

[Stack Overflow inspiration for web config changes](http://stackoverflow.com/questions/6550046/using-mvc-mini-profiler-database-profiling-with-entity-framework-code-first)

[Sam Saffron's post on Automatic Controller and View Profiling](http://samsaffron.com/archive/2011/07/25/Automatically+instrumenting+an+MVC3+app)