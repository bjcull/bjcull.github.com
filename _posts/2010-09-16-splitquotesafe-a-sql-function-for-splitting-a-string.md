---
title: "SplitQuoteSafe – A SQL function for splitting a string"
date:
  DateTime: 2010-09-16T11:44:51.0000000
  UtcDateTime: 2010-09-16T11:44:51.0000000Z
  LocalDateTime: 2010-09-16T21:44:51.0000000+10:00
  Date: 2010-09-16T00:00:00.0000000
  Day: 16
  DayOfWeek: Thursday
  DayOfYear: 259
  Hour: 11
  Minute: 44
  Month: 9
  Second: 51
  Ticks: 634202342910000000
  UtcTicks: 634202342910000000
  TimeOfDay:
    Ticks: 422910000000
    Hours: 11
    Minutes: 44
    Seconds: 51
    TotalDays: 0.489479166666667
    TotalHours: 11.7475
    TotalMilliseconds: 42291000
    TotalMinutes: 704.85
    TotalSeconds: 42291
  Year: 2010
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