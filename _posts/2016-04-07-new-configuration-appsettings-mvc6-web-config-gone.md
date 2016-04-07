---
title: New Configuration and AppSettings for MVC6 - Web.config is Gone
date: 2016-04-07
layout: post
published: true
---

There's a new place to put the app settings for your MVC6 ASP.NET Core (aka ASP.NET 5) application. Web.config is gone but the new solution is great, you get a dependency injected POCO with strongly typed settings instead!

## New Settings File - appsettings.json  
Instead of `web.config`, all your settings are now located in `appsettings.json`. Here's what the default one looks like, though I've also added an AppSettings section:

    {
      "AppSettings": {
        "BaseUrls": {
          "API": "https://localhost:44307/",
          "Auth": "https://localhost:44329/",
          "Web": "https://localhost:44339/"
        },
        "AnalyticsEnabled": true
      },
      "Data": {
        "DefaultConnection": {
          "ConnectionString": "Server=(localdb)\\mssqllocaldb;Database=aspnet5-AppSettings1-ad2c59cc-294a-4e72-bc31-078c88eb3a99;Trusted_Connection=True;MultipleActiveResultSets=true"
        }
      },
      "Logging": {
        "IncludeScopes": false,
        "LogLevel": {
          "Default": "Verbose",
          "System": "Information",
          "Microsoft": "Information"
        }
      }
    }

Notice that we're using JSON instead of XML now. This is pretty great with one big exception, **No Intellisense.**
 
## Create an AppSettings class  
If you're used to using `ConfigurationManager.AppSettings["MySetting"]` in your controllers then you're out of luck, instead you need to setup a class to hold your settings. As you can see above I like to add an "AppSettings" section to the config that maps directly to an AppSettings POCO. You can even nest complex classes as deep as you like:

    public class AppSettings
    {
        public BaseUrls BaseUrls { get; set; }
        public bool AnalyticsEnabled { get; set; }
    }
    
    public class BaseUrls
    {
        public string Api { get; set; }
        public string Auth { get; set; }
        public string Web { get; set; }
    }   
 
## Configure Startup.cs  
Now that we have a class to hold our settings, lets map the data from our appsettings.json. You can do it in a couple of ways.

Automatically bind all app settings:

    public IServiceProvider ConfigureServices(IServiceCollection services)
    {            
        services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
    }

or if you need to alter or transform anything you can assign each property manually:

    public IServiceProvider ConfigureServices(IServiceCollection services)
    {            
        services.Configure<AppSettings>(appSettings =>
        {
            appSettings.BaseUrls = new BaseUrls()
            {
                // Untyped Syntax - Configuration[""]
                Api = Configuration["AppSettings:BaseUrls:Api"],
                Auth = Configuration["AppSettings:BaseUrls:Auth"],
                Web = Configuration["AppSettings:BaseUrls:Web"],
            };
                    
            // Typed syntax - Configuration.Get<type>("")
            appSettings.AnalyticsEnabled = Configuration.Get<bool>("AppSettings:AnalyticsEnabled");
        });
    }

## Using the settings  

Finally we can access our settings from within our controllers. We'll be using dependency injection, so if you're unfamiliar with that, get ready to learn!

    public class HomeController : Controller
    {
        private readonly AppSettings _appSettings;

        public HomeController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public IActionResult Index()
        {
            var webUrl = _appSettings.BaseUrls.Web;

            return View();
        }
    }
    
There are a few important things to note here:  

The class we are injecting is of type `IOptions<AppSettings>`. If you try to inject AppSettings directly it won't work. 

Instead of using the IOptions class throughout the code, instead I set the private variable to just AppSettings and assign it in the constructor using the `.Value` property of the IOptions class.

By the way, the IOptions<AppSettings> class is essentially a singleton. The instance we create during startup is the same throughout the lifetime of the application.

While this is a lot more setup than the old way of doing things, I think it forces developers to code in a cleaner and more modular way.

If you have any questions feel free to hit me up on twitter :)