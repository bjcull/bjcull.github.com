---
title: "Push Notifications in Windows Phone 7 – #1 Code on the Device"
date:
  DateTime: 2010-12-13T13:13:24.0000000
  UtcDateTime: 2010-12-13T13:13:24.0000000Z
  LocalDateTime: 2010-12-14T00:13:24.0000000+11:00
  Date: 2010-12-13T00:00:00.0000000
  Day: 13
  DayOfWeek: Monday
  DayOfYear: 347
  Hour: 13
  Minute: 13
  Month: 12
  Second: 24
  Ticks: 634278428040000000
  UtcTicks: 634278428040000000
  TimeOfDay:
    Ticks: 476040000000
    Hours: 13
    Minutes: 13
    Seconds: 24
    TotalDays: 0.550972222222222
    TotalHours: 13.2233333333333
    TotalMilliseconds: 47604000
    TotalMinutes: 793.4
    TotalSeconds: 47604
  Year: 2010
layout: post
categories:
- Windows Phone 7
tags:
- Push Notifications
- Tutorial
---

<p>This tutorial mini series will take us through the steps of setting up push notifications for your windows phone 7 app.</p>  <h4>Posts in the series:</h4>  <ol>   <li><strong>Code on the device</strong> - This will handle everything you need to put into your wp7 app </li>    <li><a href="http://benjii.me/2011/01/push-notifications-in-windows-phone-7-2-code-on-the-server/"><strong>Code on the server</strong> - This will handle receiving and storing your user's device URIs on the server</a> </li>    <li><a title="Push Notifications in Windows Phone 7 – #3 Push that Notification" href="http://benjii.me/2011/04/push-notifications-in-windows-phone-7-3-push-that-notification/" target="_blank"><strong>Push that Notification</strong> - This will handle actually pushing notifications</a></li> </ol>  <p>First things first, we need to put code into our app that identifies the device and sends the info to our server. For now, the main page code behind file will do. Also note I’ve used a variable called _settings that contains various properties relevant to the user and application; these are mostly constants.</p>  <p>&#160;</p>  <h2>Step 1: Open the Channel</h2>  <p>First we need to open the HttpNotificationChannel. This will give us the URI to send our push notifications to.</p>  <pre class="brush: csharp; ruler: true;">private HttpNotificationChannel httpChannel;

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
}</pre>

<p>On the first line we try to find an existing channel that we may have created earlier. If we do find one, this means we already have the device’s URI and can send it to our server straight away.</p>

<p>If we don’t find one, we create a new channel, setup our event handlers and then attempt to open the channel. This will request the device’s URI from Microsoft’s Push Notification Service.</p>

<p>&#160;</p>

<h2>Step 2: Setup the Event Handlers</h2>

<p>This method sets up our event handlers so we can be notified when Microsoft has sent us the device’s URI. We will also setup handlers for when a push notification arrives, a raw notification arrives and if an exception occurs with push notifications.</p>

<pre class="brush: csharp; ruler: true;">private void SubscribeToChannelEvents()
{
    //Register to UriUpdated event - occurs when channel successfully opens   
    httpChannel.ChannelUriUpdated += new EventHandler&lt;NotificationChannelUriEventArgs&gt;(httpChannel_ChannelUriUpdated);     
            
    //Subscribed to Raw Notification
    httpChannel.HttpNotificationReceived += new EventHandler&lt;HttpNotificationEventArgs&gt;(httpChannel_HttpNotificationReceived);

    //Subscribe to Toast Notifications
    httpChannel.ShellToastNotificationReceived += new EventHandler&lt;NotificationEventArgs&gt;(httpChannel_ShellToastNotificationReceived);

    //general error handling for push channel
    httpChannel.ErrorOccurred += new EventHandler&lt;NotificationChannelErrorEventArgs&gt;(httpChannel_ExceptionOccurred);
}</pre>

<p>Here are the methods referred to above.</p>

<pre class="brush: csharp; ruler: true;">void httpChannel_ChannelUriUpdated(object sender, NotificationChannelUriEventArgs e)
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
        Dictionary&lt;string, string&gt; collection = (Dictionary&lt;string, string&gt;)e.Collection;

        Dispatcher.BeginInvoke(() =&gt; {
            MessageBox.Show(collection[&quot;wp:Text2&quot;], collection[&quot;wp:Text1&quot;], MessageBoxButton.OK);
        });
                
    }
}</pre>

<p>&#160;</p>

<h2>Step 3: Get the Windows Live Anonymous ID</h2>

<p>The windows live anonymous id lets you identify a user by their windows live account, without actually seeing their details.</p>

<p>Copy this bad boy from <a title="http://adventuresinsoftware.com/blog/?p=569" href="http://adventuresinsoftware.com/blog/?p=569">http://adventuresinsoftware.com/blog/?p=569</a></p>

<pre class="brush: csharp; ruler: true;">public string ParseANID(string anid)
{
    if (!String.IsNullOrEmpty(anid))
    {
        string[] parts = anid.Split('&amp;');
        IEnumerable&lt;string[]&gt; pairs = parts.Select(part =&gt; part.Split('='));
        string id = pairs
            .Where(pair =&gt; pair.Length == 2 &amp;&amp; pair[0] == &quot;A&quot;)
            .Select(pair =&gt; pair[1])
            .FirstOrDefault();
        return id;
    }

    return String.Empty;
}</pre>

<p>You can now get the anonymous id by using the following code: (It will look similar to this &quot;2E434B328BC68118DB640915FFFFFFFF&quot;)</p>

<pre class="brush: csharp; ruler: true;">string id = ParseANID(UserExtendedProperties.GetValue(&quot;ANID&quot;) as string);</pre>

<p>&#160;</p>

<h2>Step 4: Setup the Toast Notification Prompt</h2>

<p>The first part of this method is important; you must ask your users to allow push notifications before binding to them for the first time. It is also important to include your privacy policy in the message. Once you’ve asked once, you don’t need to ask them again, so just bind straight to the toast notification service.</p>

<pre class="brush: csharp; ruler: true;">private void BindingANotificationsChannelToAToastNotification()
{
    if (!_settings.UserHasBeenWarned)
    {
        var result = MessageBox.Show(&quot;Turn on push notifications?&quot; + 
            Environment.NewLine + Environment.NewLine + &quot;Privacy:&quot; + 
            Environment.NewLine + &quot;http://example.com/privacy-policy/&quot;, 
            &quot;Push Notifications&quot;, MessageBoxButton.OKCancel);
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
}</pre>

<p>&#160;</p>

<h2>Step 5: Register the Device with your Server</h2>

<p>The following code uses the WP7 build of RestSharp to connect to my server. Trust me, RestSharp makes http calls so much easier, learn more about <a title="Rest Web Services In Windows Phone 7" href="http://lukencode.com/2010/08/04/rest-web-services-in-windows-phone-7/" target="_blank">using Restsharp on Windows Phone 7</a> on lukencode’s blog.</p>

<p>Reference the RestSharp and Newtonsoft dlls to continue; you can get them <a title="Restsharp and Newtonsoft for Windows Phone 7" href="http://benjii.me/wp-content/uploads/2010/12/Restsharp.zip" target="_blank">conveniently from here</a> or get fresh dlls from <a title="http://restsharp.org/" href="http://restsharp.org/">http://restsharp.org/</a></p>

<pre class="brush: csharp; ruler: true;">private void SubscribeToService()
{
    if (!NetworkInterface.GetIsNetworkAvailable())
    {
        // Handle no internet here
        return;
    }

    string id = ParseANID(UserExtendedProperties.GetValue(&quot;ANID&quot;) as string);    
    
    var client = new RestClient(&quot;http://api.example.com&quot;);
    var request = new RestRequest(&quot;mycontroller/register&quot;);
    request.AddParameter(&quot;uri&quot;, httpChannel.ChannelUri.ToString());
    request.AddParameter(&quot;deviceid&quot;, id);
    request.AddParameter(&quot;nocache&quot;, Guid.NewGuid());

    client.ExecuteAsync(request, (response) =&gt;
    {
        if (response.ResponseStatus != ResponseStatus.Error)
        {
            if (_settings.PushNotifications)
                BindingANotificationsChannelToAToastNotification();
        }
        else
            MessageBox.Show(&quot;Registration failed: &quot; + response.ErrorMessage);
    });
}</pre>

<p>First we check if there is a network available, without one this call is useless.</p>

<p>Next we setup Restsharp to call our server’s API with the device’s details. I’ve added the nocache parameter to stop the phone from caching the registration call as this was important to my app, however you can leave that one out if you like.</p>

<p>For those of you who are not used to asynchronous methods, this next line accepts our request as the first parameter and then an Action (aka method) to perform once the server has responded; the response Action has an argument that contains the response from the server.</p>

<p>Once the server has responded, we check for errors, double check that the user has push notifications turned on, and then finally bind to toast notifications.</p>

<p>&#160;</p>

<h2>Step 6: Kick off the whole process</h2>

<p>Start the ball rolling by calling the RegisterDevice method in your OnNavigatedTo method:</p>

<pre class="brush: csharp; ruler: true;">protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
{
    // Register for push notifications
    RegisterDevice();
    
    base.OnNavigatedTo(e);
}</pre>

<p>We have now successfully set up the device to receive push notifications!</p>

<p>Stay tuned for the next exciting episode where we set up the server API to receive and store the device URI.</p>