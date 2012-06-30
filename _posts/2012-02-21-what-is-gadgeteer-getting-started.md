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

<p>
	<a href="/wp-content/uploads/2012/02/WP_000288.jpg">
		<img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: right; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="Ribbon cables are your friend!" border="0" alt="Ribbon cables are your friend!" align="right" src="/wp-content/uploads/2012/02/WP_000288_thumb.jpg" width="244" height="184" />
	</a>

	Whether you’ve just purchased a Gadgeteer like me, or you’re just curious, this post will give you some quick links and helpful tips to get started.
</p>

<h2>What is Microsoft .NET Gadgeteer?</h2> 

<p>
Really cool plug’n’play style hardware for <em>programmers</em>. 
</p> 
<p>
	Starting with a mainboard and a power module, you can connect an awesome array of 		modular components to form some cool little electronic projects. Check out the <a 	title="Gadgeteer Homepage" href="http://www.netmf.com/gadgeteer/" target="_blank">Gadgeteer 	Homepage</a> for examples of cool projects, the latest news and more delicious Gadgeteer 	related information.
</p> 
        
<h2>What do I buy?</h2> 

<p>I bought the <a title="FEZ Spider Starter Kit from GHI Electronics" href="http://www.ghielectronics.com/catalog/product/297" target="_blank">FEZ Spider Starter Kit from GHI Electronics</a> which includes a wide range of goodies including:<a href="/wp-content/uploads/2012/02/297-1_large.jpg">
<img style="background-image: none; border-bottom: 0px; border-left: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: right; border-top: 0px; border-right: 0px; padding-top: 0px" title="FEZ Spider Starter Kit" border="0" alt="FEZ Spider Starter Kit" align="right" src="/wp-content/uploads/2012/02/297-1_large_thumb.jpg" width="244" height="168">
</a></p> 
<ul style="list-style-type: disc"> 
	<li><a href="http://www.ghielectronics.com/catalog/product/269">FEZ Spider Mainboard</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/276">Display T35 Module</a> (3.5" with touchscreen)</li>
	<li><a href="http://www.ghielectronics.com/catalog/product/280">USB Client DP Module</a> (with USB cable)</li>
	<li><a href="http://www.ghielectronics.com/catalog/product/283">Camera Module</a></li>
	<li>2x <a href="http://www.ghielectronics.com/catalog/product/272">Multicolor LED Module </a>(DaisyLink)</li>
	<li>2x <a href="http://www.ghielectronics.com/catalog/product/274">Button Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/284">Ethernet J11D Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/271">SD Card Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/270">USB Host Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/273">Extender Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/299">Joystick Module</a></li>
	<li><a href="http://www.ghielectronics.com/catalog/product/279">10cm IDC cables</a> (included with modules).</li>
	<li>
		<a href="http://www.ghielectronics.com/catalog/product/310">Assorted IDC Cable Pack</a>:  
		<ul> 
			<li>4x 5cm IDC cables  
			<li>3x 20cm IDC cables  
			<li>1x 50cm IDC cable</li>
		</ul>
	</li>
</ul>

<p>There are a few other kits, as well as a large range of really cool modules like wifi, bluetooth, temperature and light sensors, the list goes on…</p> 

<h2>Once I have one, what do I do?</h2> 
<ol> 
	<li>
		Make sure you have <a title="Visual Studio 2010" href="http://www.microsoft.com/visualstudio" target="_blank">Visual Studio 2010</a> or 
		<a title="Visual C# Express (the free one)" href="http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-csharp-express" target="_blank">Visual C# 2010 Express (the free one)</a>
	</li> 
	<li>
		Download and install the <a href="http://www.microsoft.com/download/en/details.aspx?id=8515">.NET Micro Framework 4.1 SDK</a></li> <li>Download and install the SDK for your particular hardware. Check out this <a title="Getting Started Guide" href="http://www.netmf.com/gadgeteer/get-started.aspx" target="_blank">Getting Started Guide</a> if you’re unsure. If you’re using the same starter kit as me then you can download it from here: <a href="http://www.tinyclr.com/support/">http://www.tinyclr.com/support/</a>
	</li>
</ol> 

<h2>OK, let’s build something</h2> <p>The best way to start off is to follow the <a title="Building your first .NET Gadgeteer Device" href="http://www.ghielectronics.com/downloads/Gadgeteer/Mainboard/Spider_GettingStarted/" target="_blank">Building your first .NET Gadgeteer Device</a> tutorial which will introduce you to the basics (very important). It is specific to the kit I bought, but the concepts are the same.</p> 

<p>
	I was worried for a short while as I thought my camera module was broken. I was getting really blurry, erratic images displaying on my touch screen. It turns out that no, it was just out of focus, and the correct focus was a bit fiddly to get (you have to unscrew the lens a little bit), until I found out how to stream bitmaps to the display instead of just taking pictures.
</p>

<p>
	Michael Dodaro has a cool post about <a title="storing streamed bitmaps to SD" href="http://mikedodaro.net/2011/10/13/net-gadgeteer-camera-touchscreen-storage/" target="_blank">storing streamed bitmaps to SD</a>. 
	As a challenge, try extracting just the code you need to get the camera streaming to the display, it will help you focus the camera properly and get you on your way to building cool new projects.
</p> 

<p>Once I’ve created something, I’ll post about my adventures to get there.</p>


