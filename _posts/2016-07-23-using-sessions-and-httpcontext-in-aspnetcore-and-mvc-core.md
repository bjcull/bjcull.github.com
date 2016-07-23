---
title: Using Sessions and HttpContext in ASP.NET Core and MVC Core
date: 2016-07-23
layout: post
published: true
---

If you're new to ASP.NET Core or MVC Core, you'll find that sessions don't work the way they used to. Here's how to get up and running the new way.

## Add Session NuGet Package  
Add the `Microsoft.AspNetCore.Session` NuGet package to your project.

**VERSION WARNING:** As you'll find with most Microsoft.* packages, you should make sure the versions all match. At RTM time as of writing, this means "1.0.0".

## Update startup.cs  
Now that we have the Session nuget package installed, we can add sessions to the ASP.NET Core pipeline.

Open up `startup.cs` and add the `AddSession()` and `AddDistributedMemoryCache()` lines to the `ConfigureServices(IServiceCollection services)`

    // Add MVC services to the services container.
    services.AddMvc();
    services.AddDistributedMemoryCache(); // Adds a default in-memory implementation of IDistributedCache
    services.AddSession();

Next, we'll tell ASP.NET Core to use a Memory Cache to store the session data. Add the `UseSession()` call below to the `Configure(IApplicationBulider app, ...)`

    // IMPORTANT: This session call MUST go before UseMvc()
    app.UseSession();

    // Add MVC to the request pipeline.
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
    });


## Where's the Session variable gone?  
Relax it's still there, just not where you think it is. You can now find the session object by using `HttpContext.Session`. HttpContext is just the current HttpContext exposed to you by the Controller class.

If you're not in a controller, you can still access the HttpContext by injecting `IHttpContextAccessor`.

Let's go ahead and add sessions to our Home Controller:
    
    using Microsoft.AspNetCore.Http; // Needed for the SetString and GetString extension methods

    public class HomeController : Controller
    {
        public IActionResult Index()
        { 
            HttpContext.Session.SetString("Test", "Ben Rules!");
            return View();
        }

        public IActionResult About()
        {
            ViewBag.Message = HttpContext.Session.GetString("Test");

            return View();
        }
    }

You'll see the `Index()` and `About()` methods making use of the Session object. It's pretty easy here, just use one of the `Set()` methods to store your data and one of the `Get()` methods to retrieve it.

Just for fun, let's inject the context into a random class:

    public class SomeOtherClass
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession _session => _httpContextAccessor.HttpContext.Session;

        public SomeOtherClass(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void TestSet()
        {
            _session.SetString("Test", "Ben Rules!");
        }

        public void TestGet()
        {
            var message = _session.GetString("Test");
        }
    }

Let's break this down.

Firstly I'm setting up a private variable to hold the HttpContextAccessor. This is the way you get the HttpContext now.

Next I'm adding a convenience variable as a shortcut directly to the session. Notice the `=>`? That means we're using an expression body, aka a shortcut to writing a one liner method that returns something.

Moving to the contructor you can see that I'm injecting the IHttpContextAccessor and assigning it to my private variable. If you're not sure about this whole dependency injection thing, don't worry, it's not hard to get the hang of (especially constructor injection like I'm using here) and it will improve your code by forcing you to write it in a modular way.

But wait a minute, how do I store a complex object?

## How do I store a complex object?  
I've got you covered here too. Here's a quick JSON storage extension to let you store complex objects nice and simple.

    public static class SessionExtensions
    {
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            var value = session.GetString(key);

            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
    }

Now you can store your complex objects like so:

    var myComplexObject = new MyClass();
    HttpContext.Session.SetObjectAsJson("Test", myComplexObject);

and retrieve them just as easily:

    var myComplexObject = HttpContext.Session.GetObjectFromJson<MyClass>("Test");


## Use a Redis or SQL Server Cache instead  
Instead of using `services.AddDistributedMemoryCache()` which implements the default in-memory cache, you can use either of the following.

**SQL Server**  
Firstly, install this nuget package:

 * `"Microsoft.Extensions.Caching.SqlServer": "1.0.0"`

Secondly, add the appropriate code snippet below:

	// Microsoft SQL Server implementation of IDistributedCache.
	// Note that this would require setting up the session state database.
	services.AddSqlServerCache(o =>
	{
		o.ConnectionString = "Server=.;Database=ASPNET5SessionState;Trusted_Connection=True;";
		o.SchemaName = "dbo";
		o.TableName = "Sessions";
	});

**Redis Cache**  
Unfortunately, the redis package does not support `netcoreapp1.0` at the moment. You can still use this if you're using `net451` or higher.

 * `"Microsoft.Extensions.Caching.Redis": "1.0.0"`

&nbsp;

    // Redis implementation of IDistributedCache.
    // This will override any previously registered IDistributedCache service.
	services.AddSingleton<IDistributedCache, RedisCache>();

## Stay up to date
Even though we've reached RTM, you should still keep an eye on the [ASP.NET Session Repository](https://github.com/aspnet/Session) for any changes.
Here's a [direct link to the Sample code](https://github.com/aspnet/Session/blob/dev/samples/SessionSample/Startup.cs).