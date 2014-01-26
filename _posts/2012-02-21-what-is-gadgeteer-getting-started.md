---
title: "What is Gadgeteer? – Getting Started"
date: 2012-02-21
layout: post
categories:
- .NET
tags:
- .Net Micro
- electronics
- gadgeteer
- hardware
published: true
---

[![Ribbon cables are your friend!](/wp-content/uploads/2012/02/WP_000288_thumb.jpg "Ribbon cables are your friend!")](/wp-content/uploads/2012/02/WP_000288.jpg)

Whether you’ve just purchased a Gadgeteer like me, or you’re just curious, this post will give you some quick links and helpful tips to get started.

## What is Microsoft .NET Gadgeteer?

Really cool plug’n’play style hardware for _programmers_. 

Starting with a mainboard and a power module, you can connect an awesome array of 		modular components to form some cool little electronic projects. Check out the [Gadgeteer 	Homepage](http://www.netmf.com/gadgeteer/ "Gadgeteer Homepage") for examples of cool projects, the latest news and more delicious Gadgeteer 	related information.

## What do I buy?

I bought the [FEZ Spider Starter Kit from GHI Electronics](http://www.ghielectronics.com/catalog/product/297 "FEZ Spider Starter Kit from GHI Electronics") which includes a wide range of goodies including:[
![FEZ Spider Starter Kit](/wp-content/uploads/2012/02/297-1_large_thumb.jpg "FEZ Spider Starter Kit")
](/wp-content/uploads/2012/02/297-1_large.jpg)

*   [FEZ Spider Mainboard](http://www.ghielectronics.com/catalog/product/269)
*   [Display T35 Module](http://www.ghielectronics.com/catalog/product/276) (3.5" with touchscreen)
*   [USB Client DP Module](http://www.ghielectronics.com/catalog/product/280) (with USB cable)
*   [Camera Module](http://www.ghielectronics.com/catalog/product/283)
*   2x [Multicolor LED Module ](http://www.ghielectronics.com/catalog/product/272)(DaisyLink)
*   2x [Button Module](http://www.ghielectronics.com/catalog/product/274)
*   [Ethernet J11D Module](http://www.ghielectronics.com/catalog/product/284)
*   [SD Card Module](http://www.ghielectronics.com/catalog/product/271)
*   [USB Host Module](http://www.ghielectronics.com/catalog/product/270)
*   [Extender Module](http://www.ghielectronics.com/catalog/product/273)
*   [Joystick Module](http://www.ghielectronics.com/catalog/product/299)
*   [10cm IDC cables](http://www.ghielectronics.com/catalog/product/279) (included with modules).
*   [Assorted IDC Cable Pack](http://www.ghielectronics.com/catalog/product/310):
        *   4x 5cm IDC cables
    *   3x 20cm IDC cables
    *   1x 50cm IDC cable

There are a few other kits, as well as a large range of really cool modules like wifi, bluetooth, temperature and light sensors, the list goes on…

## Once I have one, what do I do?

1.  Make sure you have [Visual Studio 2010](http://www.microsoft.com/visualstudio "Visual Studio 2010") or		[Visual C# 2010 Express (the free one)](http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-csharp-express "Visual C# Express (the free one)")
2.  Download and install the [.NET Micro Framework 4.1 SDK](http://www.microsoft.com/download/en/details.aspx?id=8515)
3.  Download and install the SDK for your particular hardware. Check out this [Getting Started Guide](http://www.netmf.com/gadgeteer/get-started.aspx "Getting Started Guide") if you’re unsure. If you’re using the same starter kit as me then you can download it from here: [http://www.tinyclr.com/support/](http://www.tinyclr.com/support/) 

## OK, let’s build something

The best way to start off is to follow the [Building your first .NET Gadgeteer Device](http://www.ghielectronics.com/downloads/Gadgeteer/Mainboard/Spider_GettingStarted/ "Building your first .NET Gadgeteer Device") tutorial which will introduce you to the basics (very important). It is specific to the kit I bought, but the concepts are the same.

I was worried for a short while as I thought my camera module was broken. I was getting really blurry, erratic images displaying on my touch screen. It turns out that no, it was just out of focus, and the correct focus was a bit fiddly to get (you have to unscrew the lens a little bit), until I found out how to stream bitmaps to the display instead of just taking pictures.

Michael Dodaro has a cool post about [storing streamed bitmaps to SD](http://mikedodaro.net/2011/10/13/net-gadgeteer-camera-touchscreen-storage/ "storing streamed bitmaps to SD"). 
As a challenge, try extracting just the code you need to get the camera streaming to the display, it will help you focus the camera properly and get you on your way to building cool new projects.

Once I’ve created something, I’ll post about my adventures to get there.
