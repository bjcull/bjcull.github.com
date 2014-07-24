---
title: IE is caching my AngularJS requests to ASP.NET MVC
date: 2014-07-24
layout: post
published: true
---

Watch out! When you send requests via angular's $http, IE could be caching and re-serving the result. 

## Gimme the fix

Whack this into your app.js to stop the caching of GET requests in IE.

    .config([
        '$httpProvider', function ($httpProvider) {
            // Initialize get if not there
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            // Enables Request.IsAjaxRequest() in ASP.NET MVC
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            // Disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        }
    ])

Hey! as a bonus you also get the fix to make `Request.IsAjaxRequest()` work. Have a read of [Why ASP.NET MVC Request.IsAjaxRequest method returns false for $http calls from angular](http://www.techiesweb.net/asp-net-mvc-request-isajaxrequest-method-returns-false-for-angular-http-service/) if you like.


## What's going on?

To my understanding, by setting the `If-Modified-Since` header to a zero date, we're forcing IE to skip it's local cache check with any expiration date it thinks it has, and instead issue a *conditional request* (extra reading: [Understanding Conditional Requests](http://blogs.msdn.com/b/ieinternals/archive/2010/07/08/technical-information-about-conditional-http-requests-and-the-refresh-button.aspx)). This conditional request asks the server if the file has been modified since 0 (zero date aka empty) and the server always responds with a `HTTP/200 OK`.


## Some more reading

I plucked the code for this fix from the following stack overflow answer. Go give them an upvote:
[http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http](http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http)

A little more reading about how the If-Modified-Since header works:
[http://www.feedthebot.com/ifmodified.html](http://www.feedthebot.com/ifmodified.html)

An interesting stack overflow question about caching, which is relevant here:
[http://stackoverflow.com/questions/5017454/make-ie-to-cache-resources-but-always-revalidate](http://stackoverflow.com/questions/5017454/make-ie-to-cache-resources-but-always-revalidate)

Finally, the obligatory link to the reference doc. Make sure you read about "Setting HTTP Headers":
[https://docs.angularjs.org/api/ng/service/$http](https://docs.angularjs.org/api/ng/service/$http)

