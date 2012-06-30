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
---

<p>One of the cooler features of WCF web services is the ability to return your data in a range of different formats such as XML, JSON and ATOM, but what really sets it apart is just how easy it is to achieve.</p>  <h2>A Complete Example</h2>  <p>Here’s a cut down, but working example from one of my project’s <a title="Promote.fm" href="http://promote.fm">promote.fm</a>. We’ll break it down below.</p>  <pre class="prettyprint">        [WebInvoke(
            Method = &quot;GET&quot;,
            UriTemplate = &quot;search?format={format}&quot;)]
        [ServiceKnownType(typeof(Atom10FeedFormatter))]
        [ServiceKnownType(typeof(List&lt;Gig&gt;))]
        public object Search(string format)
        {
            // Initialize return object
            List&lt;Gig&gt; apiGigList = new List&lt;Gig&gt;();

            // Populate your return object here

            // Decide which format to return
            switch (format)
            {
                case &quot;atom&quot;:
                    List&lt;SyndicationItem&gt; items = new List&lt;SyndicationItem&gt;();
                    foreach (Gig gig in apiGigList)
                    {
                        SyndicationItem item = new SyndicationItem(gig.title,
                            new XmlSyndicationContent(&quot;application/xml&quot;,
                                new SyndicationElementExtension(gig)),
                            new Uri(String.IsNullOrWhiteSpace(gig.externalLink)
                                ? &quot;http://promote.fm&quot; : gig.externalLink),
                            gig.id.ToString(),
                            new DateTimeOffset(gig.modifiedDate == null
                                ? (DateTime)gig.createdDate : (DateTime)gig.modifiedDate));
                        item.Summary = new TextSyndicationContent(gig.description);
                        items.Add(item);
                    }

                    SyndicationFeed feed = new SyndicationFeed(&quot;Promote.fm Gigs&quot;,
                        &quot;The latest gigs promoted via promote.fm&quot;,
                        new Uri(&quot;http://promote.fm&quot;),
                        items);
                    feed.Authors.Add(new SyndicationPerson(&quot;info@promote.fm&quot;,
                        &quot;Promote.fm&quot;,
                        &quot;http://promote.fm&quot;));
                    feed.Categories.Add(new SyndicationCategory(&quot;Gigs&quot;));
                    feed.LastUpdatedTime = DateTime.Now;

                    WebOperationContext.Current.OutgoingResponse.ContentType = ContentTypes.Atom;
                    return feed.GetAtom10Formatter();

                case &quot;json&quot;:
                    WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Json;
                    return apiGigList;

                default:
                    WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Xml;
                    return apiGigList;
            }
        }</pre>

<h2>Building and returning the ATOM feed</h2>

<p>Atom is more complex and requires the most code so we’ll pick that apart first.</p>

<p>You may have noticed that my method signature is returning an “object” instead of anything meaningful. This needs to occur to return two different types from the one method. Which types will it return then? We define these in attributes just above the constructor like so:</p>

<pre class="prettyprint">[ServiceKnownType(typeof(Atom10FeedFormatter))]
[ServiceKnownType(typeof(List&lt;Gig&gt;))]</pre>

<p>This shows that we are returning either an ATOM feed, or a List of type Gig. For now lets look at the how we built the ATOM feed.</p>

<p>First we need to create the list of items that make up the feed, aka a List of type SyndicationItem. This is fairly straightforward, but there are a couple of things to note.</p>

<p>In this example I’ve added XML data as the content for each item using the XmlSyndicationContent class, you can also use TextSyndicationContent and UrlSyndicationContent, however you can also just use a string.</p>

<p>Its also important to note that the summary of the SyndicationItem must be of type TextSyndicationContent but you can just pass a string to the constructor of the TextSyndicationContent class anyway.</p>

<p>Next we create the SyndicationFeed object. Its as simple as entering some details into the constructor, along with the list of SyndicationItem’s we created earlier. You can also add some other information to the feed such as Authors, Categories and the time it was last updated.</p>

<p>Now we can finally return the feed using the following two lines of code:</p>

<pre class="prettyprint">WebOperationContext.Current.OutgoingResponse.ContentType = ContentTypes.Atom;
return feed.GetAtom10Formatter();</pre>

<p>The first line simply lets the browser know that an ATOM feed is coming their way, and the second line delivers.</p>

<h2>Returning XML and JSON</h2>

<p>This couldn’t be easier simply set the OutgoingResponse Format depending on which type you would like to return before you actually return the object.</p>

<p>For JSON:</p>

<pre class="prettyprint">WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Json;</pre>

<p>For XML:</p>

<pre class="prettyprint">WebOperationContext.Current.OutgoingResponse.Format = WebMessageFormat.Xml;</pre>

<h2>More Help with WCF</h2>

<p>If you are building an API using WCF, I suggest you take a quick look at my previous blog post, <a title="5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4" href="http://http://benjii.me/2010/03/5-lifesaving-tips-for-creating-a-wcf-restful-api-in-net-4/">5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4</a></p>

<p>This should save you some time and headaches down the road.</p>