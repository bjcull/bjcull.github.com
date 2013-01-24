---
title: WinJS - Call a Static Method or Property from an Instance
date: 2012-12-16
layout: post
published: true
---

Wondering how you can call a static method or reach a static property of your WinJS class when all you have is an instance of it?

It's actually simpler than I realised:

    // Static Method
    myInstance.constructor.staticMethod();
    // or Static Property
    var test = myInstance.constructor.staticProperty;
    
Keep in mind this for when you're using the WinJS.Class.define structure as shown below:

    var MyClass = WinJS.Class.define(
        function () {
            // Constructor Here
        }, {
            // Instance Members
        }, {
            // Static Members
        });
    
    var myInstance = new MyClass();
    
Simple.