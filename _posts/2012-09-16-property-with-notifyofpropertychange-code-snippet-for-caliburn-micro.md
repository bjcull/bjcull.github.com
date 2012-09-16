---
title: Property with NotifyOfPropertyChange Code Snippet for Caliburn.Micro
date: 2012-09-16
layout: post
published: false
---

If you haven't used code snippets before, or you've heard of them but don't regularly use them. **Pay Attention**.

They are actually really useful. Go ahead and type these straight into your code the next time you get a chance (hit tab + tab after the keyword and they'll expand):

 - **ctor** (Creates a constructor)
 - **prop** (Creates a shortcut property)
 - **propfull** (Creates a full property, with private and public vairables)
 
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

See the full code below:

[Insert GIST here]

## How does it work? ##