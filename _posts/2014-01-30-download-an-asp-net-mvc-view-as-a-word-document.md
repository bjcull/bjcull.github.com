---
title: Download an ASP.NET MVC View as a Word Document
date: 2014-01-30
layout: post
published: true
twitter_metadata: |
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@benjii22" />
    <meta name="twitter:creator" content="@benjii22" />
    <meta name="twitter:url" content="http://benjii.me/2014/01/download-an-asp-net-mvc-view-as-a-word-document/" />
    <meta name="twitter:title" content="Download an ASP.NET MVC View as a Word Document" />
    <meta name="twitter:description" content="Download any of your ASP.NET MVC Views as a Word Document thanks to this Filter Attribute." />
    <meta name="twitter:image" content="http://benjii.me/wp-content/uploads/2014/01/word-icon-256x256.png" />
---

I often work with MVC teams and notice that everyone shudders when printable reports are mentioned, especially when you need to export to programs like Microsoft Word. 
Reporting Services or even Crystal Reports usually come to mind, but in this case I opted to stick to web technologies and render views as Word documents.

Luckily it's now dead easy to achieve, thanks to this handy FilterAttribute that lets you return any of your views as a word document. You can see an example in the video of how I solved this problem for Brisbane Catholic Education.

<iframe width="560" height="315" src="//www.youtube.com/embed/Mbb7lSdb66Q?vq=hd720" frameborder="0" allowfullscreen="allowfullscreen">&nbsp;</iframe>

You're just four steps away from getting things working nicely yourself:

1. Get the Word Document Filter Attribute
2. Create a Word Document Layout File
3. Usage: An Example View (using ViewBag.WordDocumentMode)
4. Usage: The Controller Action (using [WordDocument])
 

## 1 - Get the Word Document Filter Attribute
This is where the magic happens. This filter attribute hijacks the request, changes the layout of the view to your new Word specific layout and then changes the response type to a file stream. Check out the code below:

<script src="https://gist.github.com/bjcull/8702230.js"></script>

There are two key things to notice here, one is that we set the MasterPage (aka Layout) to `_LayoutWord.cshtml`. The other is that we set a ViewBag property `ViewBag.WordDocumentMode = true;`. This lets us tweak our View when it's being downloaded as a word document if we want.

## 2 - Create a Word Document Layout File
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

## 3 - Usage: An Example View (using ViewBag.WordDocumentMode)
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

## 4 - Usage: The Controller Action (using [WordDocument])
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

## Further Reading
Take a look at Adam Cogan's blog post: [The SPARROW project for Brisbane Catholic Education: When Scrum fosters collaboration](http://www.adamcogan.com/2014/01/10/sparrow-project-brisbane-catholic-education-scrum-fosters-collaboration/) to find out more about our project and how we like to work.
