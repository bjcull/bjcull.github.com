---
title: Download an ASP.NET MVC View as a Word Document
date: 2014-01-30
layout: post
published: false
---

Creating reports for ASP.NET MVC web apps has to be one of the worst tasks imaginable, especially when you're asked to let them print the page, or worse again, download it as a word document.

Luckily I no longer shudder at the concept thanks to this handy FilterAttribute that lets you return any of your views as a word document.

Three things are needed to get this to work nicely:

- The Word Document `FilterAttribute`
- A new `_Layout.cshtml` for Word Documents
- The `ViewBag.WordDocumentMode` property
 

## Word Document Filter Attribute
This is where the magic happens. This filter attribute hijacks the request, changes the layout of the view to your new Word specific layout and then changes the response type to a file stream. CHeck out the code below:

<script src="https://gist.github.com/bjcull/8702230.js"></script>

There are two key things to notice here, one is that we set the MasterPage (aka Layout) to `_LayoutWord.cshtml`. The other is that we set a ViewBag property `ViewBag.WordDocumentMode = true;`. This lets us tweak our View when it's being downloaded as a word document if we want.

## Word Document Layout File
The next step is to create a basic layout file so we only put into the word document what we need. The important thing here is that it is simple, there are no scripts, and that **all styles are fully rendered in the head section**. Make sure you save this layout to `~/Views/Shared/_LayoutWord.cshtml`, or change the filter attribute above to your own location. Check out my example:

    @{
        Layout = null;
    }

    <!DOCTYPE html>

    <html>
    <head>
        <meta name="viewport" content="width=device-width" />
        <title>Word Document</title>
    
        <style>
            /* Styles go here */
        </style>
    </head>
    <body>
        <div>
            @RenderBody()
        </div>
    </body>
    </html>

Notice that this layout removes all extra content and only renders the view (RenderBody).

## Usage: An Example View (using ViewBag.WordDocumentMode)
Now that we have the neccessary bits in place, lets take a quick look at an example view. This is the default "About" view you get with a File > New Project, but I've made one small change:

    @{
        ViewBag.Title = "About";
    }

    @if (ViewBag.WordDocumentMode == null || !ViewBag.WordDocumentMode)
    {
        <h2>@ViewBag.Title.</h2>
        <h3>@ViewBag.Message</h3>
    }

    <p>Use this area to provide additional information.</p>

I've added some logic to hide the headers when downloading the word document.

## Usage: The Controller Action (using [WordDocument])
Ok same deal here, I've got the default About action, but I've also added an extra action to download the about view as a Word Document. Check it out:

    public ActionResult About()
    {
        return View();
    }

    [WordDocument]
    public ActionResult AboutDocument()
    {
        ViewBag.WordDocumentFilename = "AboutMeDocument";
        return View("About");
    }

Now when you visit the AboutDocument action, you get an "AboutMeDocument.doc" downloaded to your computer containing the contents of the "About" view.
