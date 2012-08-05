---
title: "Navigation for WinJS Metro Style Apps | Windows 8 Tutorials"
layout: post
date: 2012-08-05
published: true
---

Need to get from one page to another? Boom, navigation. Let's check out how to do it.

## The Javascript ##
Just need a quick refresher? Here's the code:

    WinJS.Navigation.navigate("/pages/next/next.html");


## The Whole Picture, Now With Added Button ##
The HTML (home.html):

    <body>
        <div class="fragment homepage">
            <header aria-label="Header content" role="banner">
                <button class="win-backbutton" aria-label="Back" disabled></button>
                <h1 class="titlearea win-type-ellipsis">
                    <span class="pagetitle">Welcome to TestProject!</span>
                </h1>
            </header>
            <section aria-label="Main content" role="main">
                <p>Content goes here.</p>
                <button id="NextPage">Next Page</button>
            </section>
        </div>
    </body>

The Javascript (home.js):

    (function () {
        "use strict";

        WinJS.UI.Pages.define("/pages/home/home.html", {
            ready: function (element, options) {
                var button = document.getElementById("NextPage");
                button.addEventListener("click", GoToNextPage);
            }
        });

        function GoToNextPage()
        {
            WinJS.Navigation.navigate("/pages/next/next.html");
        }

    })();


## OK, Now Explain... ##
Right! To start off, the above HTML is everything you get by default when you create a new page, except I've also added a button that we can click. NOTE: I've only shown the contents of the body tag, for slight brevity.

Again, with the javascript we are given some default code. We're simply adding an event listener and a function to navigate.

Looking at the ready function, first we get the button and then we attach the "click" event listener (this also works for touch). We also supply the GoToNextPage function which will be called when someone clicks the button.

Looking further down, we now define the GoToNextPage function containing our single line of code to navigate. The string we are passing to navigate function should match the string given to the WinJS.UI.Pages.define function of the page you want to navigate to. In this case we are navigating to a second (not shown) page called next.html.
