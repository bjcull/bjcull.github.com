---
title: Property with NotifyOfPropertyChange Code Snippet for Caliburn.Micro
date: 2012-09-16
layout: post
published: true
---

If you haven't used code snippets before, or you've heard of them but don't regularly use them. **Pay Attention**.

They are actually really useful. Go ahead and type these straight into your code the next time you get a chance (hit tab + tab after the keyword and they'll expand):

 - **ctor** (Creates a constructor)
 - **prop** (Creates a shortcut property)
 - **propfull** (Creates a full property, with private and public variables)
 
## Property with NotifyOfPropertyChange ##

I've recently started using the Caliburn.Micro MVVM Library for my Windows 8 app development and found myself typing this code over and over:

    private string _firstName;
    public string FirstName
    {
        get { return _firstName; }
        set
        {
            if (_firstName != value)
            {
                _firstName = value;
                NotifyOfPropertyChange(() => FirstName);
            }
        }
    }
    
Now I'd heard of code snippets, but I never really used them, and didn't know how difficult it was to create them. **Turns out it's quite easy**.

### See the Full Code ###

PS. Install the snippet by going to the **Tools > Code Snippet Manager** and clicking **Import**.

<script src="https://gist.github.com/3730960.js"> </script>

## How does it work? ##

There's not too much to it. Firstly we start out with a basic XML template that visual studio uses to recognise that this is a code snippet:

    <?xml version="1.0" encoding="utf-8"?>
    <CodeSnippets
        xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
        <CodeSnippet Format="1.0.0">
            <Header>
                <Title></Title>
            </Header>
            <Snippet>
                <Code Language="">
                    <![CDATA[]]>
                </Code>
            </Snippet>
        </CodeSnippet>
    </CodeSnippets>
    
Then we add our metadata to the header section, filling out the `Title`, `Author` and `Description` fields. We also add a `shortcut` field, which is the keyword that users will type to insert the snippet.

Next we insert the actual code straight into the `Code` section, wrapped with the cdata tag to keep it valid XML. Remember to add the Language to the Code tag as well, in this case `CSharp`.

You might have noticed some `$variable$` looking things inside my code. These are bits that we want the user to replace when they insert the snippet, called Replacements. We add our replacements into the Declarations section, just below the code.

There are two types of replacements, Literals and Objects. A `Literal` lets the user type anything (a literal string, variable name, other values etc...) and an `Object` lets us specify the type of value we want replaced. For example in my snippet, I want the user to add a `System.Type` into the code so I use a system.type object.

## What now? ##

For a more in-depth tutorial, check out this [Walkthrough for Creating a Code Snippet](http://msdn.microsoft.com/en-us/library/ms165394.aspx)

Also here is [slightly more information about Replacements](http://msdn.microsoft.com/en-us/library/ms165396.aspx)