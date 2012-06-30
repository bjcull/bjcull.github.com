---
title: "SplitQuoteSafe – A SQL function for splitting a string"
date: 2010-09-16
layout: post
categories:
- Database
tags:
- linq
- split
- string
---

<p>If you need to split a string using a delimiter in SQL, but want certain sections wrapped in quotes to ignore the delimiter, fear not, as I have a quick and easy answer.</p>  <h2>Here’s how you use it:</h2>  <p><strong>In SQL:</strong></p>  <pre class="brush: sql; ruler: true;">SELECT * FROM dbo.SplitQuoteSafe('&quot;Test&quot;,&quot;Stuff, that, has commas&quot;,&quot;ok&quot;,24.45,,yes', ',')</pre>

<p><strong>In Linq:</strong></p>

<pre class="brush: csharp; ruler: true;">var words = from w in context.SplitQuoteSafe(&quot;\&quot;test\&quot;,\&quot;I'm, in, quotes\&quot;&quot;, &quot;,&quot;)
            select w;</pre>

<h2></h2>

<h2>And Here’s the Function:</h2>

<p>[gist id=576911 file=SplitQuoteSafe.sql]</p>

<p>Simple.</p>