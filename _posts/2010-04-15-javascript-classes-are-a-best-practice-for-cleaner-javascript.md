---
title: Javascript Classes are a Best Practice for Cleaner Javascript
date: 2010-04-15
layout: post
categories:
- Javascript
tags:
- Best Practice
---

Javascript classes allow you to create reusable javascript code and cleaner and leaner web sites and web applications. In this post we’ll create a javascript class and describe when and where you should use them.

## Javascript Class Structure

Javascript classes are structured just like regular object oriented classes, they have a class signature, constructor, public properties, private variables and public and private methods. The following code is an example of how all these are laid out.


    function myNotificationClass(myDefaultMessage) {    //Class Declaration

        // Private Variables
        var defaultMessage = &quot;Hi there&quot;;

        //Public Variables
        this.NotificationCount = 0;

        //Constructor Start
        if (myDefaultMessage != “”) {
            defaultMessage = myDefaultMessage;
        }
        
        //Private Function
        function AddSignature(original) {
            return original + “ – By Ben Cull”;
        }
        
        //Public Function
        this.DisplayNotification = function(message) {
            alert(AddSignature(message));
        }
    }

Now there are a few things to notice here so lets break this down and discuss each part separately.

#### Class Declaration

    function myNotificationClass(myDefaultMessage) {
    }

A class in javascript is created the same way as a regular function, it’s what we put inside the class that really makes it useful. To access the contents of the class, we need to instantiate it like so:

    var note = new myNotificationClass(“im a default message”);

#### Constructor

Since the whole class is executed when the class is instantiated, adding some code inside the class but not inside any functions means that it will be run straight away. This mimics the purpose of a constructor and allows you to perform any setup for the class without the need for calling a function.

If you would like to pass in any parameters to the constructor, add them to the class declaration, like the above myDefaultMessage.

#### Private Variables and Methods

Private variables and methods are created the same way you would normally create them.

    var defaultMessage = "Hi there";

    function AddSignature(original) {
        return original + “ – By Ben Cull”;
    }

These variables and methods can only be accessed from within the class itself, so they are useful for helper methods and keeping track of things you don’t want your page to see.

#### Public Variables and Methods

Public variables and methods are accessible anywhere that your instance is. eg. the “note” instance we created earlier.

Its important to note that public variables and methods are created by putting “this” in front of the declarations, like so:

    this.NotificationCount = 0;
    this.DisplayNotification = function(message) {
        alert(AddSignature(message));
    }

Also note that the function keyword now comes after the function name.

To call a public function or access a public variable, you must use the instance you created above.

    var myCount = note.NotificationCount;
    note.DisplayNotification(“Yes this is awesome”);

## Why Should I Use Them?

The quick answer is code organisation and reusability.

Start by moving your global javascript functions into their own class. This will allow you to reference the file only once, but create as many instances of it in your pages as you like. If we took the myNotificationClass for example, this would allow you to create two separate default message displays with ease, like so:

    var MessageDisplayerOne = myNotificationClass("I like hotdogs");

    var MessageDisplayerTwo = myNotificationClass("Icecream is my favourite");

This opens up a world of opportunity for creating complex types within javascript.

## Real World Example

Below are two real world examples I’ve used in some of my projects to help make life easier. Check them out if you’d like a better understanding of how javascript classes are implemented.

- [Map.debug](/wp-content/uploads/2010/04/Map.debug_.js)
- [Ajax.debug](/wp-content/uploads/2010/04/Ajax.debug_.js)

I hope this makes it easier to manage your javascript code. Drop me an email on the [Contact Me](http://benjii.me/contact-me/ "Contact Me") page if you have any questions.
