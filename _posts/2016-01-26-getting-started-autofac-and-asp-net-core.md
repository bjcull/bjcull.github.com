---
title: Getting Started with Autofac and MVC6 + ASP.NET Core (aka ASP.NET 5)
date: 2016-01-26
layout: post
published: true
---

This post will show you how to set up Autofac Dependency Injection in a brand new ASP.NET Core project, and really it applies to any
project running on the ASP.NET Core, not just MVC6.

**VERSION WARNING: This was written for ASP.NET Core 1.0.0-rc1-final.**  
This code will be updated as new versions come out. If it doesn't work for your version, please tweet me to get it updated.  

## Required Packages

At the moment there's just one. Go ahead and install this nuget package into each of your projects:

 - [Autofac.Extensions.DependencyInjection](https://www.nuget.org/packages/Autofac.Extensions.DependencyInjection)
 
## Startup.cs

Next, let's build our services container and tell ASP.NET to use it.

    // This method gets called by the runtime. Use this method to add services to the container.
    public IServiceProvider ConfigureServices(IServiceCollection services)
    {
        // Add framework services.
        services.AddEntityFramework()
            .AddSqlServer()
            .AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]));

        services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddMvc();

        // Add application services.
        services.AddTransient<IEmailSender, AuthMessageSender>();
        services.AddTransient<ISmsSender, AuthMessageSender>();

        var builder = new ContainerBuilder();

        builder.RegisterModule<DataModule>();
        builder.RegisterType<SeedDataService>().As<ISeedDataService>();
            
        builder.Populate(services);

        var container = builder.Build();
        return container.Resolve<IServiceProvider>();
    }
    
Let's break down what's happening here:

 - You have to change the return type from `void` to `IServiceProvider`. This lets ASP.NET know to use your container instead of the built in one.
 - Entity Framework, Identity and MVC are added using the built in methods. Note that the context is set up as `InstancePerRequest` for you.
 - I've left the transient email and sms sender services there just to show you that you can mix the built-in container and your own. (Thanks to builder.Populate).
 - You register your services with Autofac as normal, except you also use `builder.Populate()` to add any services that were added to the built-in container.
 - Build the container and return an instance of `IServiceProvider` back to ASP.NET.
 
That's it. Simples eh?

If you have any comments, tweet them to me :)