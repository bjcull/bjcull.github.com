---
title: Enable Entity Framework Core Migrations in Visual Studio 2017
date: 2017-05-30
layout: post
published: true
---

Entity Framework Core Migrations have changed once more thanks to Visual Studio 2017 and the .csproj format. In the third iteration of this series I once again show you how to enable migrations, this time including class libraries and multiple contexts. Bonus! There are examples for **ASP.NET Identity** and even **Identity Server 4**.

## Starting from File > New Project

If you're lucky enough to be starting a brand new project and it's relatively small, Entity Framework Core migrations are already enabled for use when you select the "Individual Accounts" option from the file new project screen.

![File New Project](/wp-content/uploads/2017/05/file_new_project.png)

## Starting from Scratch, Migrating from project.json or Using a Class Library

For the rest of us, especially those who appreciate good system architecture, we're going to be setting up a separate class library to hold our migrations and Database Context. Luckily, since quite recently, the steps to enabling migrations have been simplified (Don't worry there's still planty to do). These steps are roughly the same, regardless if you're upgrading to csproj project format or just creating a new class library.

**1. Create a new .NET Standard Class Library**

To hold our migrations and database context, we'll create a .NET Standard Class Library. I typically use "[SolutionName].Data".

![Class Library](/wp-content/uploads/2017/05/class_library.png)

**2. Add some Nuget Packages**

My example today will include ASP.NET Identity using Microsoft SQL Server, as I think this will cover the majority of use cases. If you don't need Identity, don't worry, you can just leave it out.

Start by adding the following Nuget Packages to your Data class library, using the Nuget Package Management screen or by editing the Data project's .csproj file.

    <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="1.1.2" />
        <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="1.1.2" />
        <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="1.1.2" />
    </ItemGroup>

Note: Use the latest versions available to you at the current time.

These three packages add support for ASP.NET Identity using Entity Framework, EF Migrations tooling and EF SQL Server support respectively.

**3. (Optional) Would you prefer to use the dotnet cli to create migrations? (like me)**

Add the following code to your data project file (Right click project > "Edit [ProjectName]").

    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.EntityFrameworkCore.Tools.DotNet" Version="1.0.0" />
    </ItemGroup>

**4. Create your User Entity**

Create a new folder called `entities` and add a new class to it called `User.cs`. I normally create a separate project to hold my entities called "[SolutionName].Domain", but you can place this new class in your data project if you like. Here's the code:

    public class User : IdentityUser
    {
    }

**5. Create your Database Context**

Add a new class to your data project called `[SolutionName]Context.cs`. I'm calling mine `EFMigrations2017Context.cs`. PS, if you're not using ASP.NET Identity then you'd inherit from `DbContext` instead of `IdentityDbContext<>`. Here's the code:

    public class EFMigrations2017Context : IdentityDbContext<User>
    {
        public EFMigrations2017Context(DbContextOptions<EFMigrations2017Context> options)
            : base(options)
        {
        }
    }

**6. Create Temporary Database Context Factory**

This is what let's us self contain the class library, rather than relying on the configuration of the startup project. Whilst it's a little bit of a pain to add this, it's currently the most reliable way of ensuring migrations works for everyone.

Add the following `TemporaryDbContextFactory.cs` class to your data project:

    public class TemporaryDbContextFactory : IDbContextFactory<EFMigrations2017Context>
    {
        public EFMigrations2017Context Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<EFMigrations2017Context>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efmigrations2017;Trusted_Connection=True;MultipleActiveResultSets=true",
                optionsBuilder => optionsBuilder.MigrationsAssembly(typeof(EFMigrations2017Context).GetTypeInfo().Assembly.GetName().Name));
            return new EFMigrations2017Context(builder.Options);
        }
    }

**7. Enable Migrations using Package Manager Console or Dotnet CLI**

**Package Manager Console**  
If you'd prefer to stay inside Visual Studio, you can enable migrations from the package manager console. Just run the following command (remembering to set the default project to your data project):

    PM> Add-Migration InitialMigration

![Package Manager Console](/wp-content/uploads/2017/05/package_manager_console.png)

**Dotnet CLI**  
If you prefer to keep a separate console window open to manage migrations, then open your terminal of choice in the directory of your data project and run the following command:

    PS C:\Data\Projects\EFMigrations2017\EFMigrations.Data> dotnet ef migrations add InitialMigration

That's it! Migrations are now enabled.

![Powershell](/wp-content/uploads/2017/05/powershell.png)

![Solution](/wp-content/uploads/2017/05/solution.png)
A migrations folder is added containing the new migrations.

## Migrations Commands

Now that you have migrations enabled, here are the important commands you'll need day to day.

**Package Manager Console**  
You can find all commands listed here: [https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/powershell](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/powershell)  
This command adds a new migration based on the state of your DbContext. 

    PM> Add-Migration MigrationName

This command removes the latest migration.  
**Important:** Always use this command to remove a migration. Deleting a migration.cs file will result in a corrupted migrations model.

    PM> Remove-Migration

This command updates the database to the latest version. You can also optionally specify a target migration to migrate up or down to that migration.

    PM> Update-Database [[-Migration] MigrationName]


**Dotnet CLI**  
You can find all commands listed here: [https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet)  
This command adds a new migration based on the state of your DbContext. 

    PS C:\> dotnet ef migrations add MigrationName

This command removes the latest migration.  
**Important:** Always use this command to remove a migration. Deleting a migration.cs file will result in a corrupted migrations model.

    PS C:\> dotnet ef migrations remove

This command updates the database to the latest version. You can also optionally specify a target migration to migrate up or down to that migration.

    PS C:\> dotnet ef database update [MigrationName]

## How do I run these migrations automatically?

If you'd like your application to automatically apply these migrations, much like the old DatabaseInitializers of EF 6, then here's a quick snippet you can add to the `startup.cs` of your main application.

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {        
        // Migrate and seed the database during startup. Must be synchronous.
        try
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                serviceScope.ServiceProvider.GetService<EFMigrations2017Context>().Database.Migrate();
                //serviceScope.ServiceProvider.GetService<ISeedService>().SeedDatabase().Wait();
            }
        }
        catch (Exception ex)
        {
            // I'm using Serilog here, but use the logging solution of your choice.
            Log.Error(ex, "Failed to migrate or seed database");
        }

        ... // Rest of the application startup omitted
    }

If you noticed, I also like to seed the database at this point as well as it will only run once per application startup. Be careful though, you cannot use async await here, as it buggers up the pipeline. Stick to using synchronous methods, or the .Wait() method on Tasks.

## How do I use Multiple Contexts? / How do I set up Identity Server 4 to use Entity Framework?

Here's a lovely bit of bonus content. The best way I can think of to demonstrate how to use multiple contexts, happens to be one of my most asked questions. How do I connect Identity Server 4 to Entity Framework and use migrations? Well! Let's go through what you need to do to get up and running.

The following instructions will build upon the Context we've already created, using it as our main database. We're also going to be using ASP.NET Identity as our User authentication system, so we're keeping the `IdentityUser` and the `IdentityDbContext<>` intact.

The **Web Project** refers to our web application that we'll be installing Identity Server 4 into.  
The **Data Project** refers to the Data class library we created above.

**1. To your Data Project, add the following Nuget Package:**

```
    <PackageReference Include="IdentityServer4.EntityFramework" Version="1.0.1" />
```

**2. Add the following to your `TemporaryDbContextFactory.cs`**

```
    public class TemporaryDbContextFactoryScopes : IDbContextFactory<PersistedGrantDbContext>
    {
        public PersistedGrantDbContext Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<PersistedGrantDbContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efmigrations2017;Trusted_Connection=True;MultipleActiveResultSets=true",
                optionsBuilder => optionsBuilder.MigrationsAssembly(typeof(EFMigrations2017Context).GetTypeInfo().Assembly.GetName().Name));
            return new PersistedGrantDbContext(builder.Options, new OperationalStoreOptions());
        }
    }

    public class TemporaryDbContextFactoryOperational : IDbContextFactory<ConfigurationDbContext>
    {
        public ConfigurationDbContext Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<ConfigurationDbContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efmigrations2017;Trusted_Connection=True;MultipleActiveResultSets=true",
                optionsBuilder => optionsBuilder.MigrationsAssembly(typeof(EFMigrations2017Context).GetTypeInfo().Assembly.GetName().Name));

            return new ConfigurationDbContext(builder.Options, new ConfigurationStoreOptions());
        }
    }
```

I'm pointing the two Identity Server 4 Database Contexts at the same database as my main context so all data is in the same database. You can choose to split this up if you'd like.

**3. Run Add Migrations for both contexts**

Much like we did for our main context, this time we need to specify which context we want to use. I'm using the dotnet cli, but you can use the package manager if you like. See the reference for the correct command to use. Run the following commands from the data project folder:

    PS C:\> dotnet ef migrations add InitialMigration -c PersistedGrantDbContext

    PS C:\> dotnet ef migrations add InitialMigration -c ConfigurationDbContext

You should now see two folders inside your migrations folder, containing the new migrations.

**4. Set up Identity Server inside the Web Project startup.cs**

I'm not going to go through the entire set up process of Identity Server 4, that is outside the scope of this post. Great samples already exist here: [IdentityServer4.Samples/Quickstarts](https://github.com/IdentityServer/IdentityServer4.Samples/tree/release/Quickstarts). Especially the AspNetIdentity and EntityFrameworkStorage projects.

Instead, once you're setup with the in-memory example, here's what you need to change to hook up Identity Server 4 to Entity Framework.

In your **Web Project** `startup.cs`, update the services configuration like so:

    services.AddIdentityServer()
        .AddDeveloperSigningCredential()
        .AddConfigurationStore(o => o.UseSqlServer(Configuration["Data:EFMigrations2017Context:ConnectionString"],
            options => options.MigrationsAssembly(typeof(EFMigrations2017Context).GetTypeInfo().Assembly.GetName().Name)))
        .AddOperationalStore(o => o.UseSqlServer(Configuration["Data:EFMigrations2017Context:ConnectionString"],
            options => options.MigrationsAssembly(typeof(EFMigrations2017Context).GetTypeInfo().Assembly.GetName().Name)))
        .AddAspNetIdentity<User>();

Here you can see I'm still using the DeveloperSigningCredential for this example. Be sure to use a certificate instead as soon as you want to deploy this.

Next you can see we're hooking up the Configuration and Operational database contexts.

Finally we tell Identity Server 4 where we're keeping our User information so it can hook into it automatically.

**5. You're good to go!**

You now know mostly everything there is to know about using migrations. Until it changes again of course :P

If you have questions, hit me up on twitter: [@BenWhoLikesBeer](https://twitter.com/BenWhoLikesBeer).

