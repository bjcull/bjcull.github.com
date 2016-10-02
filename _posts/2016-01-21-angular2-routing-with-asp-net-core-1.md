---
title: Angular 2 Routing with ASP.NET Core 1 (aka ASP.NET 5)
date: 2016-01-21
layout: post
published: true
---

Redirect any URL to the correct Angular route when using ASP.NET Core 1 and HTML5 routing. If you're using Angular 2 with ASP.NET static file serving, 
you'll have no doubt run into the fact that once you've navigated to a different Angular route, you can't refresh the page. You'll get a 404 error because 
the new URL no longer points to a valid file.

Instead we want to route all requests for Angular routes to the root page, usually index.html. Angular will then go figure out which page to load based on the URL.

## Angular 2 Middleware for ASP.NET Core

Here is what you need to put into your `startup.cs` to get your Angular 2 app served correctly.

    public class Startup
    {
        public void Configure(IApplicationBuilder app, IApplicationEnvironment environment)
        {
            // Route all unknown requests to app root
            app.Use(async (context, next) =>
            {
                await next();

                // If there's no available file and the request doesn't contain an extension, we're probably trying to access a page.
                // Rewrite request to use app root
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/app/index.html"; // Put your Angular root page here 
                    context.Response.StatusCode = 200; // Make sure we update the status code, otherwise it returns 404
                    await next();
                }
            });

            // Serve wwwroot as root
            app.UseFileServer();

            // Serve /node_modules as a separate root (for packages that use other npm modules client side)
            app.UseFileServer(new FileServerOptions()
            {
                // Set root of file server
                FileProvider = new PhysicalFileProvider(Path.Combine(environment.ApplicationBasePath, "node_modules")),
                // Only react to requests that match this path
                RequestPath = "/node_modules", 
                // Don't expose file system
                EnableDirectoryBrowsing = false
            });
        }
    }

Ok that's cool, but let's breakdown the code to see what's going on.

## Custom ASP.NET Core Middleware

The first `app.use` is a piece of custom middleware, which is really just a fancy way of saying a method that we're adding to the Request/Response pipeline.

 - `context` is the HttpContext of the request/response.
 - `next` is the next piece of middleware in the pipeline.
 
Since we added our middleware at the top, it means we're the first to see the request, and the last to see the response.

The first line `await next();` immediately passes the request off to the next piece of middleware in the pipeline. This is because we don't know if we need to take any action yet.

Instead, we wait for the call to return, which means that the rest of the pipeline has processed the request AND the response. Once we have the response, we check to see if it was a 404.
We also check to see if there's an extension. This is to make sure the request was for a page, and not just a missing picture or something.

If we think they're trying to reach a page that doesn't exist, we assume they're trying to hit an Angular route, so we alter the request path to the root of the application and 
**send the request back down the pipeline**. You should be careful here, especially with logging, as all of the middleware below us will think it's a new request.

Luckily, this is exactly what we want for Angular. The browser URL remains the same, but the request looks like it was for the application root. This allows Angular to load successfully 
and then automatically route to the correct client side view.

## app.UseFileServer()

The remaining two pieces of middleware expose the /wwwroot folder to the internet, and also the /node_modules folder which needs to be exposed to Angular, but NPM will always install it 
in the project root instead of wwwroot. This trick makes it appear as if both folders are at the root of the application.

I'll go into more detail about the UseFileServer middleware in future posts.

At the time of writing, ASP.NET Core 1 was still a Release Candidate, so if anything has broken or changed please send me a tweet.
