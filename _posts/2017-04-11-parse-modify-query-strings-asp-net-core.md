---
title: Parse and Modify Query Strings in ASP.NET Core
date: 2017-04-11
layout: post
published: true
---

It seems simple to parse and modify a query string, but since there's so much API churn at the moment, it's hard to keep up to date with the best way.

In this post we quickly look at the latest built-in ASP.NET Core APIs that can take care of the hard work for us. 

## Show me the code  

We're going to need two NuGet packages installed to get this to work. Please note that these may already be included as dependencies of your project already if you're using ASP.NET Core MVC and Kestrel.

[`PM> Install-Package Microsoft.AspNetCore.WebUtilities`](https://www.nuget.org/packages/Microsoft.AspNetCore.WebUtilities)  
[`PM> Install-Package Microsoft.AspNetCore.Http.Extensions`](https://www.nuget.org/packages/Microsoft.AspNetCore.Http.Extensions)  

    var rawurl = "https://bencull.com/some/path?key1=val1&key2=val2&key2=valdouble&key3=";

    var uri = new Uri(rawurl);
    var baseUri = uri.GetComponents(UriComponents.Scheme | UriComponents.Host | UriComponents.Port | UriComponents.Path, UriFormat.UriEscaped);

    var query = QueryHelpers.ParseQuery(uri.Query);

    var items = query.SelectMany(x => x.Value, (col, value) => new KeyValuePair<string, string>(col.Key, value)).ToList();

    items.RemoveAll(x => x.Key == "key3"); // Remove all values for key
    items.RemoveAll(x => x.Key == "key2" && x.Value == "val2"); // Remove specific value for key

    var qb = new QueryBuilder(items);
    qb.Add("nonce", "testingnonce");
    qb.Add("payerId", "pyr_");

    var fullUri = baseUri + qb.ToQueryString();

## Explanation  

Our primary goal is to parse an existing URL (it could even be the current Request!), manipulate the query string parameters by either adding, editing, or deleting values, then mashing it back into the URL again.

We're using quite a few separate classes to achieve this, but I believe this is currently the easiest to understand. Simple code is great code.

    var rawurl = "https://bencull.com/some/path?key1=val1&key2=val2&key2=valdouble&key3=";

    var uri = new Uri(rawurl);
    var baseUri = uri.GetComponents(UriComponents.Scheme | UriComponents.Host | UriComponents.Port | UriComponents.Path, UriFormat.UriEscaped);

First we feed the full raw URL into a new URI class. This lets us extract just the query string nice and easily. It also lets us get the rest of the URL without the query string (baseUri) easily as well.

    var query = QueryHelpers.ParseQuery(uri.Query);

Next we use the [QueryHelpers](https://docs.microsoft.com/en-us/aspnet/core/api/microsoft.aspnetcore.webutilities.queryhelpers) class to deserialize the query string into a dictionary of strings and [StringValues](https://docs.microsoft.com/en-us/aspnet/core/api/microsoft.extensions.primitives.stringvalues).

The StringValues class is a handles a lot of edge cases for us, including keys with multiple values, and keys without values at all.

    var items = query.SelectMany(x => x.Value, (col, value) => new KeyValuePair<string, string>(col.Key, value)).ToList();

Next, we convert our dictionary into a list of KeyValuePairs. This makes them much easier to manipulate, and is a neccessary step for reconstructing the full URI later on.

    items.RemoveAll(x => x.Key == "key3"); // Remove all values for key
    items.RemoveAll(x => x.Key == "key2" && x.Value == "val2"); // Remove specific value for key

It's at this point that we can remove any keys/values we don't want, using a simple expression predicate.

    var qb = new QueryBuilder(items);
    qb.Add("nonce", "testingnonce");
    qb.Add("payerId", "pyr_");

Next we use the most recently developed class, [QueryBuilder](https://docs.microsoft.com/en-us/aspnet/core/api/microsoft.aspnetcore.http.extensions.querybuilder) to add additional query string parameters to our query string. You don't have to worry about empty values or multiple values per key, it takes care of that for us.

    var fullUri = baseUri + qb.ToQueryString();

Lastly, we use the `.ToQueryString()` method to serialize the query string and append it to the base part of our original URL.
