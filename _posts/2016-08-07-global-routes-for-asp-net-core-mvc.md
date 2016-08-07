---
title: Global Routes for ASP.NET Core MVC
date: 2016-08-07
layout: post
published: true
---

Want to detect part of the url for every single action in your asp.net core mvc app? It's useful for determining API versions, detecting user accounts and it's quite easy to do.

Today we're going to prepend `api/{mode}` to all routes in our api. `{mode}` will contain "test" or "live" and represents which environment we want to use. This saves us from writing it on all our controllers and we'll setup a property in our BaseController so all of our controllers have a handy shortcut.

## You need an IApplicationModelConvention  
ASP.NET Core MVC has been written to be very customisable. The handy `IApplicationModelConvention` interface lets you make changes to the mvc application and gives you access to read the Controllers, Filters and a few other things.

The approach we'll take is to read all of our controller's routes and either combine our prefix with any existing routes, or create new routes where one doesn't exist.

Here's the completed code:

    public class ModeRouteConvention : IApplicationModelConvention
    {
        public void Apply(ApplicationModel application)
        {
            var centralPrefix = new AttributeRouteModel(new RouteAttribute("api/{mode}"));
            foreach (var controller in application.Controllers)
            {
                var routeSelector = controller.Selectors.FirstOrDefault(x => x.AttributeRouteModel != null);

                if (routeSelector != null)
                {
                    routeSelector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(centralPrefix,
                        routeSelector.AttributeRouteModel);
                }
                else
                {
                    controller.Selectors.Add(new SelectorModel() { AttributeRouteModel = centralPrefix });
                }
            }
        }
    }

You add it to your application using:

    // Add framework services.
    services.AddMvc(options => {
        options.Conventions.Insert(0, new ModeRouteConvention());
    });

## What's going on?  
Ok first we'll look at the ModeRouteConvention class. The `AttributeRouteModel` class is pretty much just a wrapper on the `[Route()]` attribute, providing slightly more information and allowing for easy combination of routes.

Next, we check if the controller already has a Route attribute. If it does, we use the convenient `CombineAttributeRouteModel` method to combine our prefix with the existing route, remembering to put our route first. If one doesn't exist we just use our one instead.

## Add Mode Property to Base Controller  
Next we want to automatically parse the mode and expose a property for all of our controllers to use. We'll start by writing the base controller.

    public class BaseController : Controller
    {
        protected bool IsLive
        {
            get
            {
                var mode = this.RouteData.Values["mode"] as string;
                return mode?.ToLower() == "live";
            }
        }
    }

Now we can easily check if we're in live mode or not from our controllers.

    [Route("[controller]")]
    public class PaymentsController : BaseController
    {
        [HttpPost("process/{id}")]
        public async Task<IActionResult> ProcessPayment(string id)
        {
            if (IsLive)
            {
                // Send to the real bank
                return Json(_paymentsProcessor.Process(id));
            }
            else
            {
                // Just pretend it worked
                return Json(true);
            }
        }
    }

Looking at our controller's Route Attribute you can a value of `[controller]`. MVC replaces this with the name of the controller. The example action endpoint is a POST method with a route of "process" that also contains the ID. We check if the request is for the live environment or the test one and then we react accordingly.

The final urls look like this:

 - **Test:** http://example.com/api/**test**/payments/process/pmt_1234
 - **Live:** http://example.com/api/**live**/payments/process/pmt_1234

## More Information and Other Examples  
A big thanks to Filip from StrathWeb for doing the hard work and inspiring this post. To fully understand what's going on, be sure to read both his original and updated posts about global prefixes.

 - [Global route prefixes with attribute routing in ASP.NET 5 and MVC 6](http://www.strathweb.com/2015/10/global-route-prefixes-with-attribute-routing-in-asp-net-5-and-mvc-6/)
 - [Global route prefix in ASP.NET Core MVC (revisited)](http://www.strathweb.com/2016/06/global-route-prefix-with-asp-net-core-mvc-revisited/)

Cheers!
