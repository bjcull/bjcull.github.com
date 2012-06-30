---
title: "Push Notifications in Windows Phone 7 – #3 Push that Notification"
date: 2011-04-23
layout: post
categories:
- .NET
- Database
- Web Services
- Windows Phone 7
tags:
- entity framework
- Push Notifications
---

<p>Finally we arrive at the thrilling conclusion to my push notifications miniseries. This time we will actually push a notification to a device we have previously recorded.</p>  <h4>Posts in the series:</h4>  <ol>   <li><a href="http://benjii.me/2010/12/push-notifications-in-windows-phone-7-1-code-on-the-device/"><strong>Code on the device</strong> – This will handle everything you need to put into your wp7 app</a></li>    <li><a href="http://benjii.me/2011/01/push-notifications-in-windows-phone-7-2-code-on-the-server/" target="_blank"><strong>Code on the server</strong> – This will handle receiving and storing your user’s device URIs on the server</a> </li>    <li><strong>Push that Notification</strong> – This will handle actually pushing notifications</li> </ol>  <p>&#160;</p>  <h2>Step 1 – Create a Project to do the Pushing</h2>  <p>When we left off, we had created a WP7 App Project and a WCF Rest Service Project. Now we need to create a Windows Service or Console Application to run on the server, pushing notifications when it is necessary. So that we can see the results of our pushing easily, I’ve opted to create a Console Application.</p>  <p>&#160;</p>  <h2>Step 2 - Copy this Super Useful Notifications Class</h2>  <p>If you take a quick look at this code, you’ll see that we are simply sending some XML to a URI given to us by Microsoft. We picked up the URI in my last post, so read back if you haven’t got one yet. Regardless, here’s the code:</p>  <pre class="brush: csharp; ruler: true;">public class PushNotifications
{
    public string SendToast(string uri, string text1, string text2)
    {
        string template = 
	        &quot;&lt;?xml version='1.0' encoding='utf-8'?&gt;&quot; +
	        &quot;&lt;wp:notification xmlns:wp='WPNotification'&gt;&quot; +
	            &quot;&lt;wp:toast&gt;&quot; +
	                &quot;&lt;wp:text1&gt;{0}&lt;/wp:text1&gt;&quot; +
	                &quot;&lt;wp:text2&gt;{1}&lt;/wp:text2&gt;&quot; +
	            &quot;&lt;/wp:toast&gt;&quot; +
	        &quot;&lt;/wp:notification&gt;&quot;;

        string toastXML = string.Format(template, text1, text2);

        HttpWebRequest sendNotificationRequest = (HttpWebRequest)WebRequest.Create(uri);

        sendNotificationRequest.Method = &quot;POST&quot;;
        sendNotificationRequest.Headers = new WebHeaderCollection();

        sendNotificationRequest.ContentType = &quot;text/xml&quot;;
        sendNotificationRequest.Headers.Add(&quot;X-WindowsPhone-Target&quot;, &quot;toast&quot;);
        sendNotificationRequest.Headers.Add(&quot;X-NotificationClass&quot;, &quot;2&quot;);

        byte[] notificationMessage = new UTF8Encoding().GetBytes(toastXML);
        sendNotificationRequest.ContentLength = notificationMessage.Length;
            
        using (Stream requestStream = sendNotificationRequest.GetRequestStream())
        {
            requestStream.Write(notificationMessage, 0, notificationMessage.Length);
        }

        // Sends the notification and gets the response.
        HttpWebResponse response = (HttpWebResponse)sendNotificationRequest.GetResponse();
        string notificationStatus = response.Headers[&quot;X-NotificationStatus&quot;];
        string notificationChannelStatus = response.Headers[&quot;X-SubscriptionStatus&quot;];
        string deviceConnectionStatus = response.Headers[&quot;X-DeviceConnectionStatus&quot;];

        return notificationStatus;
    }

    public string SendLiveTile(string uri, string backgroundImageUrl, string title, int count)
    {
        string template =
            &quot;&lt;?xml version='1.0' encoding='utf-8'?&gt;&quot; +
            &quot;&lt;wp:notification xmlns:wp='WPNotification'&gt;&quot; +
                &quot;&lt;wp:tile&gt;&quot; +
                    &quot;&lt;wp:backgroundimage&gt;{0}&lt;/wp:backgroundimage&gt;&quot; +
                    &quot;&lt;wp:count&gt;{1}&lt;/wp:count&gt;&quot; +
                    &quot;&lt;wp:title&gt;{2}&lt;/wp:title&gt;&quot; +
                &quot;&lt;/wp:tile&gt;&quot; +
            &quot;&lt;/wp:notification&gt;&quot;;

        string tileXML = string.Format(template, backgroundImageUrl, count.ToString(), title);

        HttpWebRequest sendNotificationRequest = (HttpWebRequest)WebRequest.Create(uri);

        sendNotificationRequest.Method = &quot;POST&quot;;
        sendNotificationRequest.Headers = new WebHeaderCollection();

        sendNotificationRequest.ContentType = &quot;text/xml&quot;;
        sendNotificationRequest.Headers.Add(&quot;X-WindowsPhone-Target&quot;, &quot;token&quot;);
        sendNotificationRequest.Headers.Add(&quot;X-NotificationClass&quot;, &quot;1&quot;);

        byte[] notificationMessage = new UTF8Encoding().GetBytes(tileXML);
        sendNotificationRequest.ContentLength = notificationMessage.Length;

        using (Stream requestStream = sendNotificationRequest.GetRequestStream())
        {
            requestStream.Write(notificationMessage, 0, notificationMessage.Length);
        }

        // Sends the notification and gets the response.
        HttpWebResponse response = (HttpWebResponse)sendNotificationRequest.GetResponse();
        string notificationStatus = response.Headers[&quot;X-NotificationStatus&quot;];
        string notificationChannelStatus = response.Headers[&quot;X-SubscriptionStatus&quot;];
        string deviceConnectionStatus = response.Headers[&quot;X-DeviceConnectionStatus&quot;];

        return notificationStatus;
    }
}</pre>

<p>There are a few things to note with the above code. First of all, the XML should be used exactly as is. I’ve heard of a few people having trouble because they missed a capital letter, or didn’t have all of the correct parameters. </p>

<p>Secondly, pay close attention to the headers we are sending. The X-WindowsPhone-Target header sets the type of notification we are pushing (Toast, Live Tile or Raw) and the X-NotificationClass header sets how quickly the notification will be delivered. I’ve only ever seen people use the most urgent value.</p>

<p>You can find some more info about the above code from <a href="http://msdn.microsoft.com/en-us/library/ff402545%28v=VS.92%29.aspx" target="_blank">How To: Send a Push Notification for Windows Phone</a></p>

<p>Lastly, to see if our message was successfully received by Microsoft’s servers, pay attention to the three headers we receive back from our web call. I pass the X-NotificationStatus back as it gives the best indicator of whether or not the notification worked.</p>

<p>I encourage you to take a look at the <a href="http://msdn.microsoft.com/en-us/library/ff941100%28v=VS.92%29.aspx" target="_blank">Push Notification Service Response Codes for Windows Phone</a> to get an idea of the kinds of responses you could receive.</p>

<p>&#160;</p>

<h2>Step 3 – Push that Notification!</h2>

<p>Just as an example, I’m going to setup our console app so that it pushes a notification to the last device added to our database whenever you press “P”. Check out the code:</p>

<pre class="brush: csharp; ruler: true;">public class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(&quot;Welcome to the sample push notification server&quot;);

        Console.WriteLine(&quot;Running... Press enter to exit&quot;);

        bool running = true;
        while (running)
        {
            var key = Console.ReadKey(true);

            if (key.Key == ConsoleKey.Enter)
            {
                running = false;
            }
            else if (key.Key == ConsoleKey.P)
            {
                using (var context = new WP7AppDBEntities())
                {
                    // First try to find an existing device
                    var device = (from d in context.Devices
                                    orderby d.Added descending
                                    select d).FirstOrDefault();

                    if (device != null)
                    {
                        PushMessage(device.URI, &quot;Success&quot;, &quot;We sent you a message!&quot;);
                    }
                }
            }
        }
    }

    static void PushMessage(string uri, string mainText, string secondaryText)
    {
        Console.WriteLine(DateTime.UtcNow.ToString(&quot;dd/MM/yyyy hh:mm:ss &quot;) + &quot;Ready to Push Message - &quot; + mainText);

        if (!string.IsNullOrEmpty(uri))
        {
            try
            {
                PushNotifications p = new PushNotifications();
                var pushresult = p.SendToast(uri, mainText, secondaryText);

                Console.WriteLine(DateTime.UtcNow.ToString(&quot;dd/MM/yyyy hh:mm:ss &quot;) + &quot;Push Notification Sent: &quot; + pushresult);
            }
            catch (Exception ex)
            {
                Console.WriteLine(DateTime.UtcNow.ToString(&quot;dd/MM/yyyy hh:mm:ss &quot;) + &quot;Error pushing toast notification: &quot; + ex.Message + &quot; - &quot; + ex.StackTrace);
            }
        }
    }
}</pre>

<p>Essentially the above code waits for you to press “P”, pulls the most recently added device from the database we setup earlier and then sends a toast message to the device. I’ve also added some Console.Writes around the place so you can see what’s going on.</p>

<p>You can also use the above code to send a Live Tile update to a device, but that’s a blog post for another day.</p>