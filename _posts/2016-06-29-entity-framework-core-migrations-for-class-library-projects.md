---
title: Entity Framework Core Migrations for Class Library Projects
date: 2016-06-29
layout: post
published: true
---

Entity Framework Core 1.0.0 RTM still does not support migrations for class library projects. If you're like me and like to keep your entity framework data layer in a separate project, this is a problem. Luckily the workaround isn't too difficult.

Be sure to subscribe to this github issue to keep up to date with the progress of this problem. [CLI Commands: support targeting .NET Core class library projects #5320](https://github.com/aspnet/EntityFramework/issues/5320#issuecomment-229415778)  

**UPDATE May 2017:** There are slight improvements to the workaround. I've written a much bigger post here: [Enable Entity Framework Core Migrations in Visual Studio 2017](http://benjii.me/2017/05/enable-entity-framework-core-migrations-visual-studio-2017/).

## The Workaround  
We need to pretend our class library is actually a .NET Core app. The trickery begins by updating our class library's project.json with the following updates:

```
    "buildOptions": {
        "emitEntryPoint": true
    },
    "frameworks": {
        "netcoreapp1.0": { }
    },
    "dependencies": {
        "Microsoft.NETCore.App": {
            "version": "1.0.0",
            "type": "platform"
        },
        "Microsoft.EntityFrameworkCore.Design": "1.0.0-preview2-final",
        "Microsoft.EntityFrameworkCore.SqlServer": "1.0.0",
        "Microsoft.AspNetCore.Identity.EntityFrameworkCore": "1.0.0",
    },
    "tools": {
        "Microsoft.EntityFrameworkCore.Tools": {
            "version": "1.0.0-preview2-final"
        }
    }
```

The most important parts are the build options at the root level, the `Microsoft.EntityFrameworkCore.Design` package and the `Microsoft.EntityFrameworkCore.Tools` tool.

This part of the workaround is straight from the horse's mouth and can be found in the docs here: [https://docs.efproject.net/en/latest/miscellaneous/cli/dotnet.html#targeting-class-library-projects-is-not-supported](https://docs.efproject.net/en/latest/miscellaneous/cli/dotnet.html#targeting-class-library-projects-is-not-supported) 

You'll also need to add a `static void main()` to complete the .NET Core app charade. Add an empty `program.cs` to your class library project.

```
public class Program
{
    public static void Main(string[] args)
    {
    }
}
```

Lastly, we need to let our fake app know how to create your DbContext. The tools would normally gather this information from your `startup.cs`, but since that would be a huge pain to implement, let's cheat and create an `IDbContextFactory` instead.

Add the following class to your class library:

```
public class TemporaryDbContextFactory : IDbContextFactory<PinchContext>
{
    public PinchContext Create(DbContextFactoryOptions options)
    {
        var builder = new DbContextOptionsBuilder<PinchContext>();
        builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=pinchdb;Trusted_Connection=True;MultipleActiveResultSets=true");
        return new PinchContext(builder.Options);
    }
}
```

This is just a quick way to let the app know what data provider we're using and what the connection string is. Just hardcode it, don't bother with the configuration system, this is only temporary and only used at development time.

A few people had some problems with the workaround in RC2, so if you encounter any difficulties please let me know so I can help everyone else in the same boat as you. Cheers :) 
