---
title: How to return multiple formats with WCF including XML, JSON and ATOM
date: 2010-05-06
layout: post
categories:
- Web Services
tags:
- Atom
- Json
- WCF
- Xml
published: true
---

One of the cooler features of WCF web services is the ability to return your data in a range of different formats such as XML, JSON and ATOM, but what really sets it apart is just how easy it is to achieve.

## A Complete Example

Here’s a cut down, but working example from one of my project’s [promote.fm](http://promote.fm "Promote.fm"). We’ll break it down below.

    [WebInvoke(Method = "GET", UriTemplate = "search?format={format}")]
    [ServiceKnownType(typeof(Atom10FeedFormatter))]
    [ServiceKnownType(typeof(List<Gig>))]
    public object Search(string format)
    {
        // Initialize return object
        List<Gig> apiGigList = new List<Gig>();

        // Populate your return object here

        // Decide which format to return
        switch (format)
        {
            case "atom":
                List<SyndicationItem> items = new List<SyndicationItem>();
                foreach (Gig gig in apiGigList)
                {
                    SyndicationItem item = new SyndicationItem(gig.title,
                        new XmlSyndicationContent("application/xml",
                            new SyndicationElementExtension(gig)),
                        new Uri(String.IsNullOrWhiteSpace(gig.externalLink)
                            ? "http://promote.fm" : gig.externalLink),
                        gig.id.ToString(),
                        new DateTimeOffset(gig.modifiedDate == null
                            ? (DateTime)gig.createdDate : (DateTime)gig.modifiedDate));
                    item.Summary = new TextSyndicationContent(gig.description);
                    items.Add(item);
                }

                SyndicationFeed feed = new SyndicationFeed("Promote.fm Gigs",
                    "The latest gigs promoted via promote.fm",
                    new Uri("http://promote.fm"),
                    items);
                feed.Authors.Add(new SyndicationPerson("info@promote.fm",
                    "Promote.fm",
                    "http://promote.fm"));
                feed.Categories.Add(new SyndicationCategory("Gigs"));
                feed.LastUpdatedTime = DateTime.Now;

                WebOperationContext.Current.OutgoingResponse.ContentType = ContentTypes.Atom;
                return feed.GetAtom10Formatter();

            case "json":
                WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Json;
                return apiGigList;

            default:
                WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Xml;
                return apiGigList;
        }
    }

## Building and returning the ATOM feed

Atom is more complex and requires the most code so we’ll pick that apart first.

You may have noticed that my method signature is returning an “object” instead of anything meaningful. This needs to occur to return two different types from the one method. Which types will it return then? We define these in attributes just above the constructor like so:

    [ServiceKnownType(typeof(Atom10FeedFormatter))]
    [ServiceKnownType(typeof(List<Gig>))]

This shows that we are returning either an ATOM feed, or a List of type Gig. For now lets look at the how we built the ATOM feed.

First we need to create the list of items that make up the feed, aka a List of type SyndicationItem. This is fairly straightforward, but there are a couple of things to note.

In this example I’ve added XML data as the content for each item using the XmlSyndicationContent class, you can also use TextSyndicationContent and UrlSyndicationContent, however you can also just use a string.

Its also important to note that the summary of the SyndicationItem must be of type TextSyndicationContent but you can just pass a string to the constructor of the TextSyndicationContent class anyway.

Next we create the SyndicationFeed object. Its as simple as entering some details into the constructor, along with the list of SyndicationItem’s we created earlier. You can also add some other information to the feed such as Authors, Categories and the time it was last updated.

Now we can finally return the feed using the following two lines of code:

    WebOperationContext.Current.OutgoingResponse.ContentType = ContentTypes.Atom;
    return feed.GetAtom10Formatter();

The first line simply lets the browser know that an ATOM feed is coming their way, and the second line delivers.

## Returning XML and JSON

This couldn’t be easier simply set the OutgoingResponse Format depending on which type you would like to return before you actually return the object.

For JSON:

    WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Json;

For XML:

    WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Xml;

## More Help with WCF

If you are building an API using WCF, I suggest you take a quick look at my previous blog post, [5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4](http://http://benjii.me/2010/03/5-lifesaving-tips-for-creating-a-wcf-restful-api-in-net-4/ "5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4")

This should save you some time and headaches down the road.