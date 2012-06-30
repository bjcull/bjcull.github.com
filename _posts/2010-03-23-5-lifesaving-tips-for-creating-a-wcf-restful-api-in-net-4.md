---
title: 5 Lifesaving Tips for Creating a WCF RESTful API in .NET 4
permalink: /:year/:month/:title
date: 2010-03-23
layout: post
categories:
- &o0 Web Services
tags:
- Bugs
- Json
- Serialization
- Tips
- WCF
- *o0
---

<p><a href="/wp-content/uploads/2010/08/apn_lifesaver_210.jpg"><img style="border-bottom: 0px; border-left: 0px; display: inline; margin-left: 0px; border-top: 0px; margin-right: 0px; border-right: 0px" title="apn_lifesaver_210" border="0" alt="apn_lifesaver_210" align="right" src="http://benjii.me/wp-content/uploads/2010/08/apn_lifesaver_210_thumb.jpg" width="214" height="204" /></a>For those of you who haven't jumped on the bandwagon yet, RESTful Services and APIs are shaping up to be the next big data distribution trend, as they allow a flexible, yet standard way of presenting data and resources to the end user. Better yet, they have less overhead and can be taken advantage of by any system that can use the HTTP protocol. </p>  <p>If you are like me and want to have the best tools at your fingertips as soon as they've learned to crawl, you might be using Visual Studio 2010 RC, with .net 4. Whilst .net 4 has given programmers even more power to quickly develop complex systems and web applications, unfortunately there is a lack of social documentation and tutorials while we wait for everyone else to join the party.</p>  <p>Thats why I've compiled a list of 5 Lifesaving Tips for Creating a WCF RESTFul API in .NET 4</p>  <h2>#1 | Use the WCF Starter Kit</h2>  <p>The WCF team have done a great job creating nice new templates that allow you to create a basic RESTful API with almost no configuration. Do yourself a favour and download them now!</p>  <p><a title="WCF REST Starter Kit Preview 2" href="http://aspnet.codeplex.com/releases/view/24644" target="_blank">Download the WCF REST Starter Kit Preview 2</a> - This includes the neccessary libraries and template files needed to get going.</p>  <p><a title="A Developer&#39;s Guide to the WCF REST Starter Kit" href="http://msdn.microsoft.com/en-us/library/ee391967.aspx" target="_blank">A Developer's Guide to the WCF REST Starter Kit</a> - Contains a lot of great info about some of the features in the WCF REST Starter Kit.</p>  <p><a title="A Guide to Designing and Building RESTful Web Services with WCF 3.5" href="http://msdn.microsoft.com/en-us/library/dd203052.aspx" target="_blank">A Guide to Designing and Building RESTful Web Services with WCF 3.5</a> - Contains a lot of information about how to design and build a WCF Web Service including some excellent reading on the theory of WCF RESTful Services.</p>  <h2>#2 | Implement the Automatic Help Pages</h2>  <p>This is a great feature of the starter kit, as it allows you to do next to nothing and still get great looking help pages. Just type /help on the end of the uri you wish to implement. It cant be simpler in .net 4, all you need to do is make sure you have the following in your web.config:</p>  <pre class="brush:xml">  <system.servicemodel>
    <servicehostingenvironment aspnetcompatibilityenabled="true" />
    <standardendpoints>
      <webhttpendpoint>
        <standardendpoint defaultoutgoingresponseformat="Json" helpenabled="true" />
      </webhttpendpoint>
    </standardendpoints>
  </system.servicemodel></pre>

<p>The aptly named helpEnabled property is what allows you to turn on the help pages.</p>

<h2>#3 | Use WebServiceHost2Factory and WebProtocolException for Error Handling</h2>

<p>A large part of building an API is ensuring there is adequate error handling in place to help the user implement your API. Up until the release of WebServiceHost2Factory, returning the appropriate HTTP response code and message was a chore. Luckily for us we can achieve this feat quickly and easily by utilising the WebServiceHost2Factory and WebProtocoException classes.</p>

<p>First change your Global.asax file to point to the new WebServiceHost2Factory like so:</p>

<pre class="brush:c-sharp">private void RegisterRoutes()
{
    RouteTable.Routes.Add(new ServiceRoute(&quot;Authentication&quot;, new WebServiceHost2Factory(), typeof(Authentication)));
}</pre>

<p>I've used my Authentication service class as an example, you would replace this with the name of your service class.</p>

<p>Now when we come across an error or exception, we can throw the WebProtocolException and the WebServiceHost2Factory will automatically pick it up and return the appropriate status code and message. Heres an Example:</p>

<pre class="brush:c-sharp">throw new WebProtocolException(System.Net.HttpStatusCode.BadRequest, &quot;The location parameters provided were incorrect&quot;,
    new Error(){
       Code = 6001,
       Message = &quot;Please provide either a latitude and longitude, OR a location string which represents an address or landmark.&quot;
    },
    null);</pre>

<p>In this example the user has not given me the correct combination of parameters for this resource, therefore I have set the HTTPStatusCode to BadRequest and also set the status message to &quot;The location parameters provided were incorrect&quot;, to give more meaning to the status. I have also returned a custom .NET object named Error which will automatically be serialized and returned in the response, providing even more information to the user.</p>

<h2>#4 | Always Implement Zero Parameter Public Constructors</h2>

<p>One of the greatest features of the WCF Web Service updates is the ability to convert between client side XML and JSON, and server side .NET objects seamlessly and more importantly, without the need for DataContracts! However, I have run into a few quirks that can be quite hard to find, one of which was forgetting to add a public zero parameter constructor to any .NET class I want to serialize.</p>

<pre class="brush:c-sharp">    public MyClass() { }</pre>

<p>This error is most commonly found in the form of: Type 'MyType' cannot be serialized. Consider marking it with the DataContractAttribute attribute, and marking all of its members you want serialized with the DataMemberAttribute attribute. If the type is a collection, consider marking it with the CollectionDataContractAttribute. See the Microsoft .NET Framework documentation for other supported types.
  <br /><b>Ensure you have a zero parameter public constructor if you receive this error!</b></p>

<h2>#5 | Avoid DateTime.MinValue When Using Json</h2>

<p>Probably the hardest quirk to find was the Json serialization bug. Essentially, the default Json Serializer cannot serialize DateTime.MinValue... it just cant. The problem with this bug is that there is no actual error, the response is empty, firebug shows the response as aborted, its just a blank screen. To be safe and to fix any potential Json serialization errors you may be having, just make sure you are using nullable DateTime's in your serialized classes, like so:</p>

<pre class="brush:c-sharp">DateTime? myDatetime = null;</pre>

<p>Hopefully these tips will inspire you to create a powerful new API for your web application using the latest in WCF RESTful Web Service Technology!</p>