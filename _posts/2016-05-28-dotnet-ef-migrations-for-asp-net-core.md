---
title: Dotnet EF Migrations for ASP.NET Core
date: 2016-05-28
layout: post
published: true
---

Entity Framework migrations for ASP.NET Core are a little different. Here are the basic commands and a workaround to get Entity Framework migrations working for a Class Libary project.

**UPDATE 2017-05-30:** There are slight improvements to the situation. I've written a much bigger post here: [Enable Entity Framework Core Migrations in Visual Studio 2017](http://benjii.me/2017/05/enable-entity-framework-core-migrations-visual-studio-2017/).

**UPDATE 2016-06-29:** ASP.NET Core 1.0.0 RTM also has this bug so you'll need this workaround for the forseeable future. You can find my RTM specific workaround here: [Entity Framework Core Migrations for Class Library Projects](http://benjii.me/2016/06/entity-framework-core-migrations-for-class-library-projects/) 

The Class Library problem currently affects ASP.NET Core RC2, but I'll update the post until migrations are working as expected.

## The Basic Commands  
As a quick recap, here are the basic commands you'll need to write migrations for ASP.NET Core. If you're coming from DNX, not much has changed.

Add a new migration (If it's the first one, it will add the neccessary folder structure and classes)

    dotnet ef migrations add {MigrationName}

Remove the most recent migration.

    dotnet ef migrations remove
    
Update the database the latest version (apply all migrations)

    dotnet ef database update 

## Class Libraries Aren't Supported, yet...  
The first time you attempt one of those commands, you might run into this error:

    Unrecognized option '-p'

We're you trying to run your migrations on a class library? So was I. Turns out this isn't supported yet, so we'll need to work around it.

## Change your Class Library into a .NET Core App  
Seems simple once you think about it, but there are a few gotchas. Here's the simplest way to supply the EF migrations tool with everthing it needs to run.

### 1. Update your Project.json  
The first step is to add the neccessary bits to your project.json. You may already have some of these and that's ok, as long as you end up with everything listed below. I've used the Nuget package for Microsoft Sql Server, but you can use a different one if you like.

    "buildOptions": {
        "emitEntryPoint": true
    },
    "frameworks": {
        "netcoreapp1.0": {
            "imports": [ "portable-net451+win8" ]
        }
    },
    "dependencies": {
        "Microsoft.NETCore.App": {
            "version": "1.0.0-rc2-3002702",
            "type": "platform"
        },
        "Microsoft.EntityFrameworkCore.Tools": "1.0.0-preview1-final",
        "Microsoft.EntityFrameworkCore.SqlServer": "1.0.0-rc2-final",
        "Microsoft.AspNetCore.Identity.EntityFrameworkCore": "1.0.0-rc2-final",
    },
    "tools": {
        "Microsoft.EntityFrameworkCore.Tools": {
            "version": "1.0.0-preview1-final",
            "imports": [
                "portable-net45+win8+dnxcore50",
                "portable-net45+win8"
            ]
        }
    }

### 2. Create an empty entry point  
Since we're pretending this class library is an application, we need to add a static void Main(). Add the following class to your class library project.

    public class Program
    {
        public static void Main(string[] args)
        {
        }
    }

### 3. Create a DbContextFactory  
We've successfully tricked Entity Framework into running by this point, but the final and most devious hurdle is making sure it knows how to spin up your DbContext. 

You may even have run into this error:

    No parameterless constructor was found on 'TContext'. Either add a parameterless constructor to 'TContext' or add an implementation of 'IDbContextFactory<TContext>' in the same assembly as 'TContext'.

Normally this is a task for the Startup class, but since I'd rather not instantiate a whole web application and dependency injection system just to get this working, instead we'll create a small hardcoded factory.

Add the following class to your class library:

    public class TemporaryDbContextFactory : IDbContextFactory<PinchContext>
    {
        public PinchContext Create()
        {
            var builder = new DbContextOptionsBuilder<PinchContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=pinchdb;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new PinchContext(builder.Options);
        }
    }

A couple of things to note:

 - My DbContext class is called `PinchContext`, make sure you put your own in.
 - Don't bother using the configuration system to get your connection string. This is only temporary and only for development, so just hardcode it. It's a pain to add anyway.
 - The `builder` is the same one from the `AddDbContext` in your startup.cs. If you have any other configuration make sure you add it here as well.
 
That's it, running dotnet migrations from your class library folder should now work as expected :)
 
## Bonus Help - Keep Table Names from RC1  
If you're coming from RC1, you might also notice that RC2 uses the DbSet property name instead of the class name (Hooray! This is great news, as it used to be this way for EF6 and I much prefer it). This might cause some issues for people who have already created their tables from RC1 though, so to continue using your old singularized table names from RC1, add this snippet to your DbContext.

    protected override void OnModelCreating(ModelBuilder builder)
    {
        foreach (var entity in builder.Model.GetEntityTypes())
        {
            entity.Relational().TableName = entity.DisplayName();
        }

        base.OnModelCreating(builder);
    }

Let me know if you have any issues by hitting me up on Twitter!