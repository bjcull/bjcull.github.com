---
title: MVC 5 Membership and User Authentication: What's New and Getting Started
date: 2014-02-18
layout: post
published: false
---

If you've started a new project in MVC 5, you'll have noticed that the authentication system has changed again. This post will run through what's new, and the best way to move forward with setting up Cookie Based Authentication.

## Startup.Auth.cs in App Start
First, lets take a look at what runs on startup. You'll find a new file `~/App_Start/Startup.Auth.cs`. This file contains basic configuration for your authentication system, and allows you to specifiy which type you want to use. In our case we're looking for Cookie Based Authentication.

Here's a peek at what the file looks like by default.

    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")                
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            //app.UseFacebookAuthentication(
            //   appId: "",
            //   appSecret: "");

            //app.UseGoogleAuthentication();            
        }
    }

Alright, looks like cookie based authentication is there by default, excellent.


## User Model - ApplicationUser
Next we'll take a look at how the user data is stored, starting with the models. You'll see a file `~/Models/IdentityModels.cs` that contains our user class.

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
    }

OK, this is a nice improvement. As the comment suggests, we can now add our extra user data, like Email and Phone Number, to the Application User class with little effort. You can also see that it inherits from IdentityUser, which contains all the basic properties and collections, like ID, Username, Password and Roles.

## Storing data using Entity Framework
Now that we know what we want to store, lets find out how it connects to the database.

Still inside our `~/Models/IdentityModels.cs` file, you'll also see the following class:

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }
    }

The first thing you'll notice is that we're taking a Code First approach here, except instead of inheriting from DbContext, we're inheriting from IdentityDbContext. The 

