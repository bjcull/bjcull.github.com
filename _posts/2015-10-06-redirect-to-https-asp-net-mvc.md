---
title: A Better Require HTTPS Attribute for ASP.NET MVC
date: 2015-10-06
layout: post
published: true
---

If you've used the RequireHttps attribute filter before, you might be aware that it uses a 302 temporary redirect instead of a 301 permanent.  If you're trying to secure your entire website by using the RequireHttps attribute, you're missing out on some SEO. Here's an updated RequireHttps attribute that has the added benefits of 301 permanent redirect, and a convenient redirect to https://localhost:44300 for local development.

You might also notice that some search engine crawlers use a HEAD request instead of GET. The existing RequireHttps attribute does not handle this correctly and will make your site appear not to work. This custom handler correctly handles HEAD requests.

## A better redirect attribute filter
<script src="https://gist.github.com/bjcull/f36a6c9227855a4ed2d5.js"></script>

## Usage

    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new CustomRequireHttpsFilter());
        }
    }

Viola, your entire website will make sure you're connected via HTTPs.
