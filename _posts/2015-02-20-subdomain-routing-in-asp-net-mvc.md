---
title: Subdomain Routing in ASP.NET MVC
date: 2015-02-20
layout: post
published: true
---

Detecting and routing based on a subdomain in ASP.NET MVC is fairly easy with this handy snippet of code.

<script src="https://gist.github.com/bjcull/6d1156df428447caf43d.js"></script>

## Usage

Just add it to your route config like so:

    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

        // This will add the parameter "subdomain" to the route parameters
        routes.Add(new SubdomainRoute());

        routes.MapRoute(
            name: "Default",
            url: "{controller}/{action}/{id}",
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
        );
    }

and then can use a `subdomain` parameter in your actions:

    public ActionResult Login(string returnUrl, string subdomain)

## How do I use subdomains locally?

I'm glad you asked. Please watch this quick video to see how to get your development environment up and running with subdomains.

<iframe width="560" height="315" src="//www.youtube.com/embed/dMFOo0__rm0" frameborder="0" allowfullscreen="allowfullscreen">&nbsp;</iframe>

To Summarize:

**Edit your hosts file** by adding the various subdomains you would like to use. Please note you'll only need to do this on your local machine. Servers should use DNS to point all subdomains at your application.

**Edit your applicationhost.config file** by removing the host header portion. Feel free to change the port number to 80. If you get a **"Port is already in use"** error and you have Skype installed, you may need to go to Skype | Tools > Options > Advanced > Connection, and uncheck "Use port 80 and 443 for additional incoming connections".

**Run Visual Studio in Administrator Mode** becuase it will alleviate problems. If you try to start IISExpress on ports 80 or 443 you will get an access denied error unless your in administrator mode.

## What's with the video?

Notice how the video seemed to be aimed at a few people I named, and not the wider internet? That's because this is a "Done" video that I'd like to share with you all. It's something you create when you finish a task and would like to convey what you've done to your fellow developers, and more importantly your product owner. See the following SSW Rule for more information: [Do you go beyond 'Done' and follow a 'Definition of Done'?](http://rules.ssw.com.au/Management/RulesToSuccessfulProjects/Pages/Done-DefinitionOfDone.aspx)

For more great Scrum tips see [SSW's Rules to Better Scrum](http://rules.ssw.com.au/Management/RulesToBetterScrumUsingTFS/Pages/Default.aspx)