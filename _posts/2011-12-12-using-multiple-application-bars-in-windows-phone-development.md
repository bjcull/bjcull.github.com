---
title: Using Multiple Application Bars in Windows Phone Development
date:
  DateTime: 2011-12-12T13:32:33.0000000
  UtcDateTime: 2011-12-12T13:32:33.0000000Z
  LocalDateTime: 2011-12-13T00:32:33.0000000+11:00
  Date: 2011-12-12T00:00:00.0000000
  Day: 12
  DayOfWeek: Monday
  DayOfYear: 346
  Hour: 13
  Minute: 32
  Month: 12
  Second: 33
  Ticks: 634592935530000000
  UtcTicks: 634592935530000000
  TimeOfDay:
    Ticks: 487530000000
    Hours: 13
    Minutes: 32
    Seconds: 33
    TotalDays: 0.564270833333333
    TotalHours: 13.5425
    TotalMilliseconds: 48753000
    TotalMinutes: 812.55
    TotalSeconds: 48753
  Year: 2011
layout: post
categories:
- Windows Phone 7
tags: []
---

<p>You know when you select multiple emails and the application bar swaps out for a different one? No? We’ll get ready to learn. This trick looks much better than enabling and disabling menu items on your application bar and is dead simple to achieve.</p>  <h2>Step 1: Create your Application Bars</h2>  <p>Make sure you have the shell namespace reference at the top of your PhoneApplicationPage:</p>  <pre class="brush:xml; ruler: true;">xmlns:shell=&quot;clr-namespace:Microsoft.Phone.Shell;assembly=Microsoft.Phone&quot;</pre>

<p>Create your application bars and add them to your page resources using the following XAML. I’ve created three, naming them “DefaultAppBar”, “SiungleSelectionAppBar” and “MultiSelectionAppBar”.</p>

<pre class="brush:xml; ruler: true;">&lt;phone:PhoneApplicationPage.Resources&gt;
    &lt;shell:ApplicationBar x:Key=&quot;DefaultAppBar&quot; IsVisible=&quot;True&quot;&gt;
        &lt;shell:ApplicationBarIconButton x:Name=&quot;mnuAdd&quot; IconUri=&quot;/icons/appbar.add.rest.png&quot; IsEnabled=&quot;True&quot; Text=&quot;Add&quot; Click=&quot;mnuAdd_Click&quot;/&gt;
    &lt;/shell:ApplicationBar&gt;
    &lt;shell:ApplicationBar x:Key=&quot;SingleSelectionAppBar&quot; IsVisible=&quot;True&quot;&gt;
        &lt;shell:ApplicationBarIconButton x:Name=&quot;mnuPin&quot; IconUri=&quot;/icons/appbar.pushpin.png&quot; IsEnabled=&quot;True&quot; Text=&quot;Pin&quot; Click=&quot;mnuPin_Click&quot; /&gt;
        &lt;shell:ApplicationBarIconButton x:Name=&quot;mnuDelete&quot; IconUri=&quot;/icons/appbar.delete.rest.png&quot; IsEnabled=&quot;True&quot; Text=&quot;Delete&quot; Click=&quot;mnuDelete_Click&quot;/&gt;
        &lt;shell:ApplicationBarIconButton x:Name=&quot;mnuEdit&quot; IconUri=&quot;/icons/appbar.edit.rest.png&quot; IsEnabled=&quot;True&quot; Text=&quot;Edit&quot; Click=&quot;mnuEdit_Click&quot;/&gt;
    &lt;/shell:ApplicationBar&gt;
    &lt;shell:ApplicationBar x:Key=&quot;MultiSelectionAppBar&quot; IsVisible=&quot;True&quot;&gt;
        &lt;shell:ApplicationBarIconButton x:Name=&quot;mnuDeleteMulti&quot; IconUri=&quot;/icons/appbar.delete.rest.png&quot; IsEnabled=&quot;True&quot; Text=&quot;Delete&quot; Click=&quot;mnuDelete_Click&quot;/&gt;
    &lt;/shell:ApplicationBar&gt;
&lt;/phone:PhoneApplicationPage.Resources&gt;</pre>

<p>&#160;</p>

<h2>Step 2: Use Code to Swap Between Them</h2>

<p>Firstly, we need to set a default application bar to load with the page. We can do this by adding the following code to the constructor:</p>

<pre class="brush: csharp; ruler: true;">ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources[&quot;DefaultAppBar&quot;];</pre>

<p>It's actually the exact same code to change the application bar to one of our other ones. Check out the following code I use to swap between them when my list fires a selection changed event:</p>

<pre class="brush: csharp; ruler: true;">if (list.SelectedItems.Count == 1)
{
    ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources[&quot;SingleSelectionAppBar&quot;];
}
else if (list.SelectedItems.Count &gt; 1)
{
    ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources[&quot;MultiSelectionAppBar&quot;];
}
else
{
    ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources[&quot;DefaultAppBar&quot;];
}</pre>

<p>That's it. You'll also notice that when you change application bars, it uses a cool swoosh down and then back up animation. All for free.</p>