---
title: Wizard Style Navigation Tabs for Bootstrap
date: 2014-03-12
layout: post
published: true
---

Get wizard style navigations tabs by adding this small bit of CSS to your project.

**UPDATE 2016-09-27**: Thanks to [Talal Alenizi](https://twitter.com/Talal_AlEnizi) for a great CSS update. The HTML syntax is now super simple. Just use your bootstrap pills navigation.

## Demo

<div>
    <!-- Don't use this, it's been altered to look correct on the blog -->
    <ul class="nav nav-pills nav-wizard">
        <li class="active"><a href="javascript:void(0)" data-toggle="tab" style="padding:7px 15px;">Home</a></li>
        <li><a href="javascript:void(0)" data-toggle="tab" style="padding:7px 15px;">About</a></li>
        <li><a href="javascript:void(0)" data-toggle="tab" style="padding:7px 15px;">Contact</a></li>
    </ul>

    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="Stylesheet" type="text/css" />
    <link href="https://cdn.rawgit.com/bjcull/9498339/raw/e4517d12e8ef428d0d4caf9e455b424dbb6c786e/nav-wizard.bootstrap.css" rel="Stylesheet" type="text/css" />
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</div>

## Usage

Here's what you need to do to your existing tabs:

- Make sure you're using `.nav-pills`
- Add a `.nav-wizard` class to your tabs

&nbsp;

    <ul class="nav nav-pills nav-wizard">
        <li class="active"><a href="#" data-toggle="tab">Home</a></li>
        <li><a href="#" data-toggle="tab">About</a></li>
        <li><a href="#" data-toggle="tab">Contact</a></li>
    </ul>

Then add the css (or less) from below and that's it!

## Full Code (CSS and LESS)

<script src="https://gist.github.com/bjcull/9498339.js"></script>