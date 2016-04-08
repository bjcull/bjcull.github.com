---
title: Single Sign-Out / Logout for Identity Server 4
date: 2016-04-08
layout: post
published: true
---

Currently if you try to logout of your Identity Server 4 protected web application, you are immediately logged back in thanks to Identity Server 4's own authentication cookie. Single Sign-out hasn't been implemented in idsrv4 yet, so here's a handy workaround.

## Logout of your MVC Application

To logout of your MVC application you use the following action:

    public async Task<IActionResult> LogOff()
    {
        await HttpContext.Authentication.SignOutAsync("cookies");
        return Redirect("auth.example.com/ui/logout");
    }

Notice how we redirect to the auth server afterwards? The code for that action is further down.
This also assumes that in your `startup.cs` you set up cookie authentication like so (or similar):

    app.UseCookieAuthentication(options =>
    {
        options.AuthenticationScheme = "cookies";
        options.AutomaticAuthenticate = true;
    });
    
## Logout of Identity Server 4

To stop Identity Server automatically logging you back in again, we need to remove the cookies it has stored to identify you. Add the following Action to a controller in your Identity Server 4 project.

    [HttpGet(Constants.RoutePaths.Logout)]
    public IActionResult Logout()
    {
        var myCookies = Request.Cookies.Keys;
        foreach (string cookie in myCookies)
        {
            Response.Cookies.Delete(cookie, new Microsoft.AspNet.Http.CookieOptions()
            {
                Domain = "auth.example.com"
            });
        }

        return Redirect("mvcapp.example.com");
    }
 
 This code will remove all cookies set by the auth server and will then redirect you back to your MVC app, ready to login again fresh.
 
 Hit me up on Twitter if you have any questions :)