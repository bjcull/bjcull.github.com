---
title: Getting Started Guide
date:
  DateTime: 2011-01-17T12:13:32.0000000
  UtcDateTime: 2011-01-17T12:13:32.0000000Z
  LocalDateTime: 2011-01-17T23:13:32.0000000+11:00
  Date: 2011-01-17T00:00:00.0000000
  Day: 17
  DayOfWeek: Monday
  DayOfYear: 17
  Hour: 12
  Minute: 13
  Month: 1
  Second: 32
  Ticks: 634308632120000000
  UtcTicks: 634308632120000000
  TimeOfDay:
    Ticks: 440120000000
    Hours: 12
    Minutes: 13
    Seconds: 32
    TotalDays: 0.509398148148148
    TotalHours: 12.2255555555556
    TotalMilliseconds: 44012000
    TotalMinutes: 733.533333333333
    TotalSeconds: 44012
  Year: 2011
layout: post
categories: []
tags: []
---

<p>Here are the quick few steps you must take to connect <a href="http://benjii.me/torrential/">Torrential for WP7</a> to your computer.</p>  <div style="overflow:hidden;"><h2>Step 1 – Download the latest version of uTorrent</h2>  <p><a href="http://benjii.me/wp-content/uploads/2011/01/Capture.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="Capture" border="0" alt="Capture" align="left" src="http://benjii.me/wp-content/uploads/2011/01/Capture_thumb.png" width="244" height="136" /></a>Start by ensuring you have the latest version, which you can download here:    <br /><a href="http://www.utorrent.com/downloads">http://www.utorrent.com/downloads</a></p>    </div>  <p>&#160;</p><div style="clear:both; overflow:hidden;"><h2>Step 2 – Enable the WebUI Setting</h2>  <p><a href="http://benjii.me/wp-content/uploads/2011/01/menu.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="menu" border="0" alt="menu" align="left" src="http://benjii.me/wp-content/uploads/2011/01/menu_thumb.png" width="244" height="143" /></a>Open uTorrent and go to Options &gt; Preferences</p>    </div> <p>&#160;</p><div style="clear:both; overflow:hidden;"> <p><a href="http://benjii.me/wp-content/uploads/2011/01/webUI.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="webUI" border="0" alt="webUI" align="left" src="http://benjii.me/wp-content/uploads/2011/01/webUI_thumb.png" width="244" height="182" /></a>Click on the WebUI item and change the following settings:</p>  <ul>   <li>Tick the “Enable Web UI” checkbox</li>    <li>Change the username</li>    <li>Change the password</li>    <li>Tick the “Alternative listening port” checkbox</li>    <li>Change the Alternative listening port to a different five digit number greater than 10000 (eg. 14521)</li> </ul>              </div> <p>&#160;</p>  <div style="clear:both"><h2>Step 3 – Forward Your Alternative Port</h2>  <p><a href="http://benjii.me/wp-content/uploads/2011/01/port.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="port" border="0" alt="port" align="left" src="http://benjii.me/wp-content/uploads/2011/01/port_thumb.png" width="244" height="87" /></a>This step is the trickiest, as there are so many routers with so many different ways of forwarding ports. </p>  <p>The quickest and easiest way to forward your port is to find and follow the instructions for your router at <a href="http://portforward.com/">http://portforward.com/</a></p>  <p>Remember the goal is to forward your alternative port (eg. 14521) to your computer’s IP address (usually starts with 192.168)</p> </div> <p>&#160;</p> <div style="clear:both"> <h2>Step 4 – Sign up for a Dynamic DNS Service (It’s Free!)</h2>  <p><a href="http://benjii.me/wp-content/uploads/2011/01/dyndns.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="dyndns" border="0" alt="dyndns" align="left" src="http://benjii.me/wp-content/uploads/2011/01/dyndns_thumb.png" width="244" height="75" /></a>Your home network’s IP address is usually always changing, so to talk to your computer using a constant and easy to remember server address, you will need to sign up for a Dynamic DNS service. Advanced users can choose any service, but I would recommend regular users use <a href="http://www.dyndns.com">http://www.dyndns.com</a> – It’s free.</p>  <p>Be sure to follow their instructions carefully and you should end up with a nice Server URL (eg. ben.dyndns.org)</p> </div> <p>&#160;</p> <div style="clear:both; overflow:hidden;"> <h2>Step 5 – Enter Your New Details Into Torrential</h2>  <p><a href="http://benjii.me/wp-content/uploads/2011/01/settings.png"><img style="background-image: none; border-bottom: 0px; border-left: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top: 0px; border-right: 0px; padding-top: 0px" title="settings" border="0" alt="settings" align="left" src="http://benjii.me/wp-content/uploads/2011/01/settings_thumb.png" width="148" height="244" /></a>Now that you’ve got your Server Url, Alternative Port, Username and Password, you can setup your Torrential application as pictured.</p>  <p>Note: The Server URL setting in Torrential includes the dynamic dns address you created above, followed by a colon,&#160; followed by the alternative port number.</p>  </div> <p>&#160;</p> <div style="clear:both"> <h2>Troubleshooting</h2>  <p>I will post solution to popular problems here as they arise, stay tuned.</p>  <h4>I get the error “Server found but invalid url, check your port number”</h4>  <p>Make sure you have added your port number to the end of your Server URL with a colon at the start (ben.dyndns.org<strong>:14521</strong>)</p></div><p>&#160;</p>