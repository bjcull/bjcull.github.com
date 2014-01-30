---
title: "Push Notifications in Windows Phone 7 – 1 Code on the Device"
date: 2010-12-13
layout: post
categories:
- Windows Phone 7
tags:
- Push Notifications
- Tutorial
---

This tutorial mini series will take us through the steps of setting up push notifications for your windows phone 7 app.

#### Posts in the series:

1. **Code on the device** - This will handle everything you need to put into your wp7 app
2. [Code on the server - This will handle receiving and storing your user's device URIs on the server](http://benjii.me/2011/01/push-notifications-in-windows-phone-7-2-code-on-the-server/)
3. [Push that Notification - This will handle actually pushing notifications](http://benjii.me/2011/04/push-notifications-in-windows-phone-7-3-push-that-notification/ "Push Notifications in Windows Phone 7 – 3: Push that Notification")

First things first, we need to put code into our app that identifies the device and sends the info to our server. For now, the main page code behind file will do. Also note I’ve used a variable called _settings_ that contains various properties relevant to the user and application; these are mostly constants.


## Step 1: Open the Channel

First we need to open the HttpNotificationChannel. This will give us the URI to send our push notifications to.

    private HttpNotificationChannel httpChannel;
    
    private void RegisterDevice()
    {
        //First, try to pick up existing channel
        httpChannel = HttpNotificationChannel.Find(_settings.ChannelName);
        
        if (httpChannel != null) 
        {
            SubscribeToChannelEvents();
            
            SubscribeToService();
        }
        else
        {
            //Create new channel
            httpChannel = new HttpNotificationChannel(_settings.ChannelName, _settings.ServiceName);
            
            SubscribeToChannelEvents();
            
            httpChannel.Open();
        }
    }

On the first line we try to find an existing channel that we may have created earlier. If we do find one, this means we already have the device’s URI and can send it to our server straight away.

If we don’t find one, we create a new channel, setup our event handlers and then attempt to open the channel. This will request the device’s URI from Microsoft’s Push Notification Service.

## Step 2: Setup the Event Handlers

This method sets up our event handlers so we can be notified when Microsoft has sent us the device’s URI. We will also setup handlers for when a push notification arrives, a raw notification arrives and if an exception occurs with push notifications.

    private void SubscribeToChannelEvents()
    {
        //Register to UriUpdated event - occurs when channel successfully opens   
        httpChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(httpChannel_ChannelUriUpdated);     
        
        //Subscribed to Raw Notification
        httpChannel.HttpNotificationReceived += new EventHandler<HttpNotificationEventArgs>(httpChannel_HttpNotificationReceived);
        
        //Subscribe to Toast Notifications
        httpChannel.ShellToastNotificationReceived += new EventHandler<NotificationEventArgs>(httpChannel_ShellToastNotificationReceived);
        
        //general error handling for push channel
        httpChannel.ErrorOccurred += new EventHandler<NotificationChannelErrorEventArgs>(httpChannel_ExceptionOccurred);
    }

Here are the methods referred to above.

    void httpChannel_ChannelUriUpdated(object sender, NotificationChannelUriEventArgs e)
    {
        // Optionally save the URI locally here - e.ChannelUri.ToString();
        
        SubscribeToService();
    }
    
    void httpChannel_ExceptionOccurred(object sender, NotificationChannelErrorEventArgs e)
    {
        // Handle notification exceptions here
    }
    
    void httpChannel_HttpNotificationReceived(object sender, HttpNotificationEventArgs e)
    {
        // Handle raw notification here
    }
    
    void httpChannel_ShellToastNotificationReceived(object sender, NotificationEventArgs e)
    {
        // This runs when a toast notification is received while the app is running
        
        if (e.Collection != null)
        {
            Dictionary<string, string> collection = (Dictionary<string, string>)e.Collection;
            
            Dispatcher.BeginInvoke(() => {
                MessageBox.Show(collection["wp:Text2"], collection["wp:Text1"], MessageBoxButton.OK);
            });
            
        }
    }

## Step 3: Get the Windows Live Anonymous ID

The windows live anonymous id lets you identify a user by their windows live account, without actually seeing their details.

Copy this bad boy from [http://adventuresinsoftware.com/blog/?p=569](http://adventuresinsoftware.com/blog/?p=569)

    public string ParseANID(string anid)
    {
        if (!String.IsNullOrEmpty(anid))
        {
            string[] parts = anid.Split('&');
            IEnumerable<string[]> pairs = parts.Select(part => part.Split('='));
            string id = pairs
                .Where(pair => pair.Length == 2 && pair[0] == "A")
                .Select(pair => pair[1])
                .FirstOrDefault();
            return id;
        }
        
        return String.Empty;
    }

You can now get the anonymous id by using the following code: (It will look similar to this "2E434B328BC68118DB640915FFFFFFFF")

    string id = ParseANID(UserExtendedProperties.GetValue("ANID") as string);

## Step 4: Setup the Toast Notification Prompt

The first part of this method is important; you must ask your users to allow push notifications before binding to them for the first time. It is also important to include your privacy policy in the message. Once you’ve asked once, you don’t need to ask them again, so just bind straight to the toast notification service.

    private void BindingANotificationsChannelToAToastNotification()
    {
        if (!_settings.UserHasBeenWarned)
        {
            var result = MessageBox.Show("Turn on push notifications?" + 
                Environment.NewLine + Environment.NewLine + "Privacy:" + 
                Environment.NewLine + "http://example.com/privacy-policy/", 
                "Push Notifications", MessageBoxButton.OKCancel);
            if (result == MessageBoxResult.OK)
            {
                _settings.UserHasBeenWarned = true;
            }
            else
            {
                return;
            }
        }
        
        if (!httpChannel.IsShellToastBound)
        {
            httpChannel.BindToShellToast();
        }
    }

## Step 5: Register the Device with your Server

The following code uses the WP7 build of RestSharp to connect to my server. Trust me, RestSharp makes http calls so much easier, learn more about [using Restsharp on Windows Phone 7](http://lukencode.com/2010/08/04/rest-web-services-in-windows-phone-7/ "Rest Web Services In Windows Phone 7") on lukencode’s blog.

Reference the RestSharp and Newtonsoft dlls to continue; you can get them [conveniently from here](/wp-content/uploads/2010/12/Restsharp.zip "Restsharp and Newtonsoft for Windows Phone 7") or get fresh dlls from [http://restsharp.org/](http://restsharp.org/ "http://restsharp.org/")

    private void SubscribeToService()
    {
        if (!NetworkInterface.GetIsNetworkAvailable())
        {
            // Handle no internet here
            return;
        }
        
        string id = ParseANID(UserExtendedProperties.GetValue("ANID") as string);    
        
        var client = new RestClient("http://api.example.com");
        var request = new RestRequest("mycontroller/register");
        request.AddParameter("uri", httpChannel.ChannelUri.ToString());
        request.AddParameter("deviceid", id);
        request.AddParameter("nocache", Guid.NewGuid());
        
        client.ExecuteAsync(request, (response) =>
        {
            if (response.ResponseStatus != ResponseStatus.Error)
            {
                if (_settings.PushNotifications)
                    BindingANotificationsChannelToAToastNotification();
            }
            else
                MessageBox.Show("Registration failed: " + response.ErrorMessage);
        });
    }

First we check if there is a network available, without one this call is useless.

Next we setup Restsharp to call our server’s API with the device’s details. I’ve added the nocache parameter to stop the phone from caching the registration call as this was important to my app, however you can leave that one out if you like.

For those of you who are not used to asynchronous methods, this next line accepts our request as the first parameter and then an Action (aka method) to perform once the server has responded; the response Action has an argument that contains the response from the server.

Once the server has responded, we check for errors, double check that the user has push notifications turned on, and then finally bind to toast notifications.

## Step 6: Kick off the whole process

Start the ball rolling by calling the RegisterDevice method in your OnNavigatedTo method:

    protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
    {
        // Register for push notifications
        RegisterDevice();
        
        base.OnNavigatedTo(e);
    }

We have now successfully set up the device to receive push notifications!

Stay tuned for the next exciting episode where we set up the server API to receive and store the device URI.
