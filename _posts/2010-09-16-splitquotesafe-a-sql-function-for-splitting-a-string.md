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

If you need to split a string using a delimiter in SQL, but want certain sections wrapped in quotes to ignore the delimiter, fear not, as I have a quick and easy answer.

## Here’s how you use it:

**In SQL:**
  SELECT * FROM dbo.SplitQuoteSafe('"Test","Stuff, that, has commas","ok",24.45,,yes', ',')

**In Linq:**

    var words = from w in context.SplitQuoteSafe("\"test\",\"I'm, in, quotes\"", ",")
    select w;

## And Here’s the Function:

[gist id=576911 file=SplitQuoteSafe.sql]

Simple.