---
title: "Push Notifications in Windows Phone 7 – 3: Push that Notification"
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

Finally we arrive at the thrilling conclusion to my push notifications miniseries. This time we will actually push a notification to a device we have previously recorded.

#### Posts in the series:

1.  [**Code on the device** – This will handle everything you need to put into your wp7 app](http://benjii.me/2010/12/push-notifications-in-windows-phone-7-1-code-on-the-device/)
2.  [**Code on the server** – This will handle receiving and storing your user’s device URIs on the server](http://benjii.me/2011/01/push-notifications-in-windows-phone-7-2-code-on-the-server/)
3.  **Push that Notification** – This will handle actually pushing notifications  

## Step 1 – Create a Project to do the Pushing

When we left off, we had created a WP7 App Project and a WCF Rest Service Project. Now we need to create a Windows Service or Console Application to run on the server, pushing notifications when it is necessary. So that we can see the results of our pushing easily, I’ve opted to create a Console Application.

## Step 2 - Copy this Super Useful Notifications Class

If you take a quick look at this code, you’ll see that we are simply sending some XML to a URI given to us by Microsoft. We picked up the URI in my last post, so read back if you haven’t got one yet. Regardless, here’s the code:
    public class PushNotifications
    {
        public string SendToast(string uri, string text1, string text2)
        {
            string template = 
                "<?xml version='1.0' encoding='utf-8'?>" +
                "<wp:notification xmlns:wp='WPNotification'>" +
                    "<wp:toast>" +
                        "<wp:text1>{0}</wp:text1>" +
                        "<wp:text2>{1}</wp:text2>" +
                    "</wp:toast>" +
                "</wp:notification>";

            string toastXML = string.Format(template, text1, text2);

            HttpWebRequest sendNotificationRequest = (HttpWebRequest)WebRequest.Create(uri);

            sendNotificationRequest.Method = "POST";
            sendNotificationRequest.Headers = new WebHeaderCollection();

            sendNotificationRequest.ContentType = "text/xml";
            sendNotificationRequest.Headers.Add("X-WindowsPhone-Target", "toast");
            sendNotificationRequest.Headers.Add("X-NotificationClass", "2");

            byte[] notificationMessage = new UTF8Encoding().GetBytes(toastXML);
            sendNotificationRequest.ContentLength = notificationMessage.Length;

            using (Stream requestStream = sendNotificationRequest.GetRequestStream())
            {
                requestStream.Write(notificationMessage, 0, notificationMessage.Length);
            }

            // Sends the notification and gets the response.
            HttpWebResponse response = (HttpWebResponse)sendNotificationRequest.GetResponse();
            string notificationStatus = response.Headers["X-NotificationStatus"];
            string notificationChannelStatus = response.Headers["X-SubscriptionStatus"];
            string deviceConnectionStatus = response.Headers["X-DeviceConnectionStatus"];

            return notificationStatus;
        }

        public string SendLiveTile(string uri, string backgroundImageUrl, string title, int count)
        {
            string template =
                "<?xml version='1.0' encoding='utf-8'?>" +
                "<wp:notification xmlns:wp='WPNotification'>" +
                    "<wp:tile>" +
                        "<wp:backgroundimage>{0}</wp:backgroundimage>" +
                        "<wp:count>{1}</wp:count>" +
                        "<wp:title>{2}</wp:title>" +
                    "</wp:tile>" +
                "</wp:notification>";

            string tileXML = string.Format(template, backgroundImageUrl, count.ToString(), title);

            HttpWebRequest sendNotificationRequest = (HttpWebRequest)WebRequest.Create(uri);

            sendNotificationRequest.Method = "POST";
            sendNotificationRequest.Headers = new WebHeaderCollection();

            sendNotificationRequest.ContentType = "text/xml";
            sendNotificationRequest.Headers.Add("X-WindowsPhone-Target", "token");
            sendNotificationRequest.Headers.Add("X-NotificationClass", "1");

            byte[] notificationMessage = new UTF8Encoding().GetBytes(tileXML);
            sendNotificationRequest.ContentLength = notificationMessage.Length;

            using (Stream requestStream = sendNotificationRequest.GetRequestStream())
            {
                requestStream.Write(notificationMessage, 0, notificationMessage.Length);
            }

            // Sends the notification and gets the response.
            HttpWebResponse response = (HttpWebResponse)sendNotificationRequest.GetResponse();
            string notificationStatus = response.Headers["X-NotificationStatus"];
            string notificationChannelStatus = response.Headers["X-SubscriptionStatus"];
            string deviceConnectionStatus = response.Headers["X-DeviceConnectionStatus"];

            return notificationStatus;
        }
    }

There are a few things to note with the above code. First of all, the XML should be used exactly as is. I’ve heard of a few people having trouble because they missed a capital letter, or didn’t have all of the correct parameters. 

Secondly, pay close attention to the headers we are sending. The X-WindowsPhone-Target header sets the type of notification we are pushing (Toast, Live Tile or Raw) and the X-NotificationClass header sets how quickly the notification will be delivered. I’ve only ever seen people use the most urgent value.

You can find some more info about the above code from [How To: Send a Push Notification for Windows Phone](http://msdn.microsoft.com/en-us/library/ff402545%28v=VS.92%29.aspx)

Lastly, to see if our message was successfully received by Microsoft’s servers, pay attention to the three headers we receive back from our web call. I pass the X-NotificationStatus back as it gives the best indicator of whether or not the notification worked.

I encourage you to take a look at the [Push Notification Service Response Codes for Windows Phone](http://msdn.microsoft.com/en-us/library/ff941100%28v=VS.92%29.aspx) to get an idea of the kinds of responses you could receive.

&#160;

## Step 3 – Push that Notification!

Just as an example, I’m going to setup our console app so that it pushes a notification to the last device added to our database whenever you press “P”. Check out the code:

    public class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to the sample push notification server");

            Console.WriteLine("Running... Press enter to exit");

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
                            PushMessage(device.URI, "Success", "We sent you a message!");
                        }
                    }
                }
            }
        }

        static void PushMessage(string uri, string mainText, string secondaryText)
        {
            Console.WriteLine(DateTime.UtcNow.ToString("dd/MM/yyyy hh:mm:ss ") + "Ready to Push Message - " + mainText);

            if (!string.IsNullOrEmpty(uri))
            {
                try
                {
                    PushNotifications p = new PushNotifications();
                    var pushresult = p.SendToast(uri, mainText, secondaryText);

                    Console.WriteLine(DateTime.UtcNow.ToString("dd/MM/yyyy hh:mm:ss ") + "Push Notification Sent: " + pushresult);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(DateTime.UtcNow.ToString("dd/MM/yyyy hh:mm:ss ") + "Error pushing toast notification: " + ex.Message + " - " + ex.StackTrace);
                }
            }
        }
    }

Essentially the above code waits for you to press “P”, pulls the most recently added device from the database we setup earlier and then sends a toast message to the device. I’ve also added some Console.Writes around the place so you can see what’s going on.

You can also use the above code to send a Live Tile update to a device, but that’s a blog post for another day.
