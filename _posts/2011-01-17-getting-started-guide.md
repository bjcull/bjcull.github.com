---
title: Getting Started Guide
date: 2011-01-17
layout: page
categories: []
tags: []
---

Here are the quick few steps you must take to connect [Torrential for WP7](http://benjii.me/torrential/) to your computer.

## Step 1 – Download the latest version of uTorrent

[![Capture](/wp-content/uploads/2011/01/Capture_thumb.png "Capture")](/wp-content/uploads/2011/01/Capture.png)Start by ensuring you have the latest version, which you can download here:    
[http://www.utorrent.com/downloads](http://www.utorrent.com/downloads)

## Step 2 – Enable the WebUI Setting

[![menu](/wp-content/uploads/2011/01/menu_thumb.png "menu")](/wp-content/uploads/2011/01/menu.png)Open uTorrent and go to Options &gt; Preferences

[![webUI](/wp-content/uploads/2011/01/webUI_thumb.png "webUI")](/wp-content/uploads/2011/01/webUI.png)Click on the WebUI item and change the following settings:

*   Tick the “Enable Web UI” checkbox
*   Change the username
*   Change the password
*   Tick the “Alternative listening port” checkbox
*   Change the Alternative listening port to a different five digit number greater than 10000 (eg. 14521)

## Step 3 – Forward Your Alternative Port

[![port](/wp-content/uploads/2011/01/port_thumb.png "port")](/wp-content/uploads/2011/01/port.png)This step is the trickiest, as there are so many routers with so many different ways of forwarding ports. 

The quickest and easiest way to forward your port is to find and follow the instructions for your router at [http://portforward.com/](http://portforward.com/)

Remember the goal is to forward your alternative port (eg. 14521) to your computer’s IP address (usually starts with 192.168)

## Step 4 – Sign up for a Dynamic DNS Service (It’s Free!)

[![dyndns](/wp-content/uploads/2011/01/dyndns_thumb.png "dyndns")](/wp-content/uploads/2011/01/dyndns.png)Your home network’s IP address is usually always changing, so to talk to your computer using a constant and easy to remember server address, you will need to sign up for a Dynamic DNS service. Advanced users can choose any service, but I would recommend regular users use [http://www.dyndns.com](http://www.dyndns.com) – It’s free.

Be sure to follow their instructions carefully and you should end up with a nice Server URL (eg. ben.dyndns.org)

## Step 5 – Enter Your New Details Into Torrential

[![settings](/wp-content/uploads/2011/01/settings_thumb.png "settings")](/wp-content/uploads/2011/01/settings.png)Now that you’ve got your Server Url, Alternative Port, Username and Password, you can setup your Torrential application as pictured.

Note: The Server URL setting in Torrential includes the dynamic dns address you created above, followed by a colon,&#160; followed by the alternative port number.

## Troubleshooting

I will post solution to popular problems here as they arise, stay tuned.

#### I get the error “Server found but invalid url, check your port number”

Make sure you have added your port number to the end of your Server URL with a colon at the start (ben.dyndns.org**:14521**)
