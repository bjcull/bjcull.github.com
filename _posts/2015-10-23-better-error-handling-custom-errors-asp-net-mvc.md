---
title: Better Error Handling and Custom Errors for ASP.NET MVC
date: 2015-10-23
layout: post
published: true
---

Improve your Error Handling and Custom Errors screen in one fell swoop by using the SSW.ErrorHandler nuget package for ASP.NET MVC websites.

Get it here: [SSW.ErrorHandler on Nuget](https://www.nuget.org/packages/SSW.ErrorHandler/)

In this video I also show you how to trace your exceptions using a reference in Application Insights.

<iframe width="560" height="315" src="//www.youtube.com/embed/OhVYTOKCsWI" frameborder="0" allowfullscreen="allowfullscreen">&nbsp;</iframe>

## Benefits  
 - Nice custom errors screen with useful feedback
 - Custom error screens for different error codes (404, 500 are built in)
 - Automatic AJAX detection and JSON response with error details
 - Easily send your exceptions to your favourite exception handler such as Elmah or Application Insights

## Exception Tracing with Application Insights  
In this video I also add a way of tracking the exception, given a reference from a customer. This is especially useful when you have a large customer base and are trying to solve a problem for a specific customer.

I achieve this by creating a new GUID and simply adding it to the properties of my exception when tracking it with Application Insights. I edited the `~/Filters/CustomErrorFilter.cs` and it looks like this:

    // Track Exception with Reference
    var exceptionReferenceGuid = Guid.NewGuid().ToString();
    telemetryClient.TrackException(filterContext.Exception, new Dictionary<string, string> { {"exceptionReference", exceptionReferenceGuid} });

Please note that `telemetryClient` is an instance of `Microsoft.ApplicationInsights.TelemetryClient`. See [Getting Started with Application Insights](https://azure.microsoft.com/en-us/documentation/articles/app-insights-start-monitoring-app-health-usage/) for more information about setting yourself up.

If you need a hand implementing the error handler, hit me up on Twitter -> [@BenWhoLikesBeer](https://twitter.com/BenWhoLikesBeer)