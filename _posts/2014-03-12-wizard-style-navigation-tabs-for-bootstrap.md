---
title: Wizard Style Navigation Tabs for Bootstrap
date: 2014-03-12
layout: post
published: true
---

Get wizard style navigations tabs by adding this small bit of CSS to your project.

![Wizard Tabs](/wp-content/uploads/2014/03/wizard.png "Magic!")

## Requirements

Include this bit of CSS in your project somewhere (available in less or plain css):

- **LESS:** [nav-wizard.bootstrap.less](https://gist.github.com/bjcull/9498339#file-nav-wizard-bootstrap-less)
- **CSS:** [nav-wizard.bootstrap.css](https://gist.github.com/bjcull/9498339#file-nav-wizard-bootstrap-css)

## HTML

Here's what you need to do to your existing tabs:

- Make sure you're using `.nav-pills`
- Add a `.nav-wizard` class to your tabs
- Add `<div class="nav-arrow"></div>` and `<div class="nav-wedge"></div>` between the a links appropriately as below.

&nbsp;

    <ul class="nav nav-pills nav-wizard">
        <li class="active"><a href="#" data-toggle="tab">Home</a><div class="nav-arrow"></div></li>
        <li><div class="nav-wedge"></div><a href="#" data-toggle="tab">About</a><div class="nav-arrow"></div></li>
        <li><div class="nav-wedge"></div><a href="#" data-toggle="tab">Contact</a></li>
    </ul>


## Demo

See it in action by visiting this awesome CodePen:
[Wizard Style Navigation Tabs](http://codepen.io/bencull/pen/CHqwn)