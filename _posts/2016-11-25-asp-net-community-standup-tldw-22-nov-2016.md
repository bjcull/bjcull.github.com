---
title: ASP.NET Community Standup TL;DW - 22 Nov 2016
date: 2016-11-25
layout: post
published: true
---

For those of you without enough time to watch the full ASP.NET Community Standup, I've made a Too Long; Didn't Watch version. Please enjoy :)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ez7qV8E6rGs" frameborder="0" allowfullscreen></iframe>

## Show Notes, Community Links and Timestamps

[Aerial Spaces](https://aerialspac.es/)

## Community

[ASP.NET Core 1.1 RTM was released](https://blogs.msdn.microsoft.com/dotnet/2016/11/16/announcing-net-core-1-1/)

[(Azure) App Service on Linux supporting .NET Core](https://azure.microsoft.com/en-us/blog/app-service-on-linux-now-supports-containers-and-asp-net-core/)

[TechEmpower Benchmarks - ASP.NET Core 1.0.1 #10 Plain Text round](https://www.techempower.com/benchmarks/#section=data-r13&hw=ph&test=plaintext)

[Hackathon at the MVP Summit](https://blogs.msdn.microsoft.com/webdev/2016/11/22/mvp-hackathon-2016/)

[EDI Serializer/Deserializer](https://github.com/indice-co/EDI.Net)

Jason Bell - URL Rewriting behind a load balancer - No link

[ASP.NET Monsters](https://channel9.msdn.com/Series/aspnetmonsters/ASPNET-Monsters-79-Code-Labs-with-Jon-Galloway)

[Hisham's Blog - Unexpected behaviour in LanguageViewLocationExpander](http://www.hishambinateya.com/unexpected-behavior-in-languageviewlocationexpander)

[Steve Gordon - RIP project json](https://www.stevejgordon.co.uk/project-json-replaced-by-csproj)

[Orchard 2 now on ASP.NET Core - 1.1](https://github.com/OrchardCMS/Orchard2)

[Making out with .NET - Serve static website and web API at the same time](http://makingoutwith.net/2016/how-to-serve-a-static-site-plus-a-web-api-in-aspnetcore/)

[Scott Allen - ASP.NET Core and the Enterprise](http://odetocode.com/blogs/scott/archive/2016/11/22/asp-net-core-and-the-enterprise-part-3-middleware.aspx)

[Ben Foster - Using .NET Core configuration with legacy projects](http://benfoster.io/blog/net-core-configuration-legacy-projects)

[Corefxlab - High performance data pipelines](https://github.com/dotnet/corefxlab/blob/master/docs/roadmap.md)  

[chsakells blog - Realtime application using asp.net core, signalr and angular](https://chsakell.com/2016/10/10/real-time-applications-using-asp-net-core-signalr-angular/)

[Jonathan Mezach - .NET Core Versioning](https://blogs.infosupport.com/net-core-versioning/)

[Tim Seaward - Not your grandads .NET - Pipes](https://cetus.io/tim/Part-1-Not-your-grandads-dotnet/)

## Get to the guts

[Ben's Magic Number](https://news.ycombinator.com/item?id=13011374) [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=2381)  

 - Uses a magic number to find appropriate bytes. Improved kestrel performance by 250,000 requests a second.
 - Pull request took months to merge, active discussion, good pull requests collaborate and aren't in a hurry.

Versions are crazy, preview 3 for .net core, for vs2017 RC (MS Build tooling). Alpha quality. [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=2959)

Damian updated live.asp.net and live streamed it. Admits to sucking at coding :) [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3052)

.NET Website Downloads are confusing. [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3200)

## Questions

Difference bwtween .NET Core runtime and SDK - Devs need SDK. Servers need runtime (dotnet.exe) [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3446)

A lot of Azure SDKs haven't moved to .NET Core. Don't worry they're coming. [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3660)

Does a .netcoreapp 1.0 run on 1.1? It's supposed to but it doesn't work magically, you have to use a workaround. [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3837)

Will the CSPROJ tooling be finalized ready for VS2017 RTM? At this stage yes :) [Youtube timestamp](https://youtu.be/ImFTzxmCPkc?list=PL0M0zPgJ3HSftTAAHttA3JQU4vOjXFquF&t=3948)
