---
title: "Push Notifications in Windows Phone 7 – #2 Code on the Server"
date:
  DateTime: 2011-01-18T14:18:48.0000000
  UtcDateTime: 2011-01-18T14:18:48.0000000Z
  LocalDateTime: 2011-01-19T01:18:48.0000000+11:00
  Date: 2011-01-18T00:00:00.0000000
  Day: 18
  DayOfWeek: Tuesday
  DayOfYear: 18
  Hour: 14
  Minute: 18
  Month: 1
  Second: 48
  Ticks: 634309571280000000
  UtcTicks: 634309571280000000
  TimeOfDay:
    Ticks: 515280000000
    Hours: 14
    Minutes: 18
    Seconds: 48
    TotalDays: 0.596388888888889
    TotalHours: 14.3133333333333
    TotalMilliseconds: 51528000
    TotalMinutes: 858.8
    TotalSeconds: 51528
  Year: 2011
layout: post
categories:
- .NET
- Database
- Web Services
- Windows Phone 7
tags:
- entity framework
- Push Notifications
- WCF
---

<p>This is the second part in the mini series that is taking us through the steps of setting up push notifications for your windows phone 7 app.</p>  <h4>Posts in the series:</h4>  <ol>   <li><a title="Push Notifications in Windows Phone 7 – #1 Code on the Device" href="http://benjii.me/2010/12/push-notifications-in-windows-phone-7-1-code-on-the-device/" target="_blank"><strong>Code on the device</strong> – This will handle everything you need to put into your wp7 app</a> </li>    <li><strong>Code on the server</strong> – This will handle receiving and storing your user’s device URIs on the server </li>    <li><a title="Push Notifications in Windows Phone 7 – #3 Push that Notification" href="http://benjii.me/2011/04/push-notifications-in-windows-phone-7-3-push-that-notification/" target="_blank"><strong>Push that Notification</strong> – This will handle actually pushing notifications</a> </li> </ol>  <p>&#160;</p>  <p>To handle the requests from our devices, we will be setting up a WCF REST Service Project. This will allow us to keep track of all the devices that have downloaded our app, as well as keep track of which users want push notifications or live tiles.</p>  <h2>Step 1: Create a New WCF REST Service Project</h2>  <div style="clear: both; overflow: hidden">   <p><a href="http://benjii.me/wp-content/uploads/2011/01/newproject.png"><img style="background-image: none; border-right-width: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="newproject" border="0" alt="newproject" align="left" src="http://benjii.me/wp-content/uploads/2011/01/newproject_thumb.png" width="244" height="170" /></a></p>    <ul>     <li>Open the New Project dialog </li>      <li>Select the Online Templates menu on the left </li>      <li>Select the WCF sub-menu </li>      <li>Select the WCF REST Service Template 40(CS) project template </li>      <li>Choose a project name and click OK </li>   </ul> </div>  <p>To clean up our project a bit, delete SampleItem.cs and rename the Service1.cs file to Notifications.cs. If you are asked to rename all references, do that as well. </p>  <p>Also, you must edit the Global.asax.cs and change the string “Service1” to “Notifications” in the RegisterRoutes method.</p>  <p>Lets get rid of all the rubbish that is in the Notifications class by default. Make your class look like this:</p>  <pre class="brush: csharp; ruler: true;">[ServiceContract]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
[ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
public class Notifications
{

}</pre>

<p>&#160;</p>

<h2>Step 2: Handle the API Call from the Device</h2>

<p>Now that we have a clean project add the following method to your Notifications class:</p>

<pre class="brush: csharp; ruler: true;">[WebInvoke(UriTemplate = &quot;register?deviceid={deviceid}&amp;uri={uri}&quot;,
    ResponseFormat = WebMessageFormat.Json,
    Method = &quot;GET&quot;)]
public string Register(string deviceid, string uri)
{
    // TODO: Save DeviceID and URI here
}</pre>

<p>&#160;</p>

<p>For those of you who are not used to WCF REST services, the above method is essentially just a web method. It is decorated with a WebInvoke Attribute which contains the following parameters:</p>

<ul>
  <li>UriTemplate – This is the URL we want the method to respond to. Using the above as an example, you would call <a href="http://example.com/notifications/register?deviceid=123&amp;uri=456">http://example.com/notifications/register?deviceid=123&amp;uri=456</a> </li>

  <li>ResponseFormat – This format you want to return your data in. JSON is recommended as it is lightweight. </li>

  <li>Method – Either GET or POST, your choice. </li>
</ul>

<p>We’ve done enough now, that if you were to publish your service, the device would think everything was working. Now it’s time to actually save the data.</p>

<p>&#160;</p>

<h2>Step 3: Setup the Database</h2>

<p>Now we are going to create the database to store the device information in. Most of you, like me, might be lazy when it comes to DB work, so here is a diagram and script (SQL Server) to create the table for storing devices.</p>

<p>Go ahead and create a new database called WP7AppDB and add the table below.</p>

<p><a href="http://benjii.me/wp-content/uploads/2011/01/tablediagram.png"><img style="background-image: none; border-right-width: 0px; margin: ; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="tablediagram" border="0" alt="tablediagram" src="http://benjii.me/wp-content/uploads/2011/01/tablediagram_thumb.png" width="244" height="146" /></a></p>

<pre class="brush: sql; ruler: true;">/****** Object:  Table [dbo].[Devices]    Script Date: 01/18/2011 23:21:39 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Devices](
    [DeviceID] [nvarchar](200) NOT NULL,
    [URI] [nvarchar](400) NOT NULL,
    [PushNotifications] [bit] NOT NULL,
    [Added] [datetime] NOT NULL,
    [Modified] [datetime] NOT NULL,
    [LiveTile] [bit] NOT NULL,
    [LiveTileFrequency] [int] NOT NULL,
    [LiveTileLastUpdate] [datetime] NULL,
 CONSTRAINT [PK_Devices_1] PRIMARY KEY CLUSTERED 
(
    [DeviceID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[Devices] ADD  CONSTRAINT [DF_Devices_PushNotifications]  DEFAULT ((0)) FOR [PushNotifications]
GO

ALTER TABLE [dbo].[Devices] ADD  CONSTRAINT [DF_Devices_Added]  DEFAULT (getdate()) FOR [Added]
GO

ALTER TABLE [dbo].[Devices] ADD  CONSTRAINT [DF_Devices_Modified]  DEFAULT (getdate()) FOR [Modified]
GO

ALTER TABLE [dbo].[Devices] ADD  CONSTRAINT [DF_Devices_LiveTile]  DEFAULT ((0)) FOR [LiveTile]
GO

ALTER TABLE [dbo].[Devices] ADD  CONSTRAINT [DF_Devices_LiveTileFrequency]  DEFAULT ((15)) FOR [LiveTileFrequency]
GO</pre>

<p>&#160;</p>

<h2>Step 4: Connect to the Database</h2>

<div style="clear: both; overflow: hidden">
  <p><a href="http://benjii.me/wp-content/uploads/2011/01/newentity.png"><img style="background-image: none; border-right-width: 0px; margin: 0px 30px 0px 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="newentity" border="0" alt="newentity" align="left" src="http://benjii.me/wp-content/uploads/2011/01/newentity_thumb.png" width="244" height="170" /></a>There are a million ways to connect to a database, so I’m going to run through my favourite way: Entity Framework.</p>

  <p>Start by right clicking your project in Visual Studio and selecting Add &gt; New Item…</p>

  <p>Next select the ADO.NET Entity Data Model and change the name to WP7AppDB.edmx. I like to use the Database name as the model name. Click OK.</p>
</div>

<p>The Entity Data Model Wizard should appear so follow these steps:</p>

<ol>
  <li>Click Generate from Database, Click Next </li>

  <li>Click New Connection, enter your server details, select the WP7AppDB database and click ok </li>

  <li>Click the “Yes, include the sensitive data in the connection string” option </li>

  <li>Ensure the “Save entity connection settings in Web.Config as:” checkbox is ticked and that “WP7AppDBEntities” is in the textbox below. Click Next </li>

  <li>Tick the Tables checkbox and Click Finish. </li>
</ol>

<p>You should now have WP7AppDB.edmx at the bottom of your project.</p>

<p>&#160;</p>

<h2>Step 5: Actually Save the Data</h2>

<p>Now that everything is setup, we can finally save the device information. Copy this code into the Register method we created before, replacing the TODO comment we left:</p>

<pre class="brush: csharp; ruler: true;">Device device = null;

using (var context = new WP7AppDBEntities())
{
    if (!String.IsNullOrWhiteSpace(deviceid))
    {
        // First try to find an existing device
        device = (from d in context.Devices
                  where d.DeviceID == deviceid
                  select d).FirstOrDefault();

        if (device != null)
        {
            // Do we need to update the URI?
            if (device.URI != uri)
                device.URI = uri;
        }
        else
        {
            device = new Device()
            {
                DeviceID = deviceid,
                URI = uri,
                Added = DateTime.Now,
                Modified = DateTime.Now
            };

            context.Devices.AddObject(device);
        }

        context.SaveChanges();
    }
}

return deviceid;</pre>

<p>If you are not familiar with Entity Framework or LINQ, let me explain from the top.</p>

<p>The code in the using statement produces our connection to the database and places it into the context variable. After checking that we were actually given a value, we then use LINQ to see if we can find an existing device in the database. </p>

<p>If we do find a device, we check the existing URI against the one just given to us by the device and if they’re different, we update the database.</p>

<p>If we don’t find a device, we create a new instance of the Device class, which was generated by entity framework, fill in the details and add the new device to the database.</p>

<p>The SaveChanges method actually commits the changes we just made to the database, nothing would happen without it.</p>

<p>We then return the device id passed to us just as a reference. You might like to pass something more meaningful back, but I consider this just a fire and forget method.</p>

<p>&#160;</p>

<h2>Step 6: Give it a Try</h2>

<p>You’re done. Go ahead and hit Ctrl+F5 and hit the register method with some dummy data. I did this: http://localhost:9542/notifications/register?deviceid=123&amp;uri=456 (replace the port number with whatever your visual studio created)</p>

<p>If you completed the steps in the previous post to this one, you can even try running your WP7 application and seeing if it connects with some actual data.</p>

<p>&#160;</p>

<p>Stay tuned for the next exciting episode, where we look at actually pushing notifications to the phone</p>