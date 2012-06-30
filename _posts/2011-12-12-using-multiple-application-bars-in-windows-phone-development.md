---
title: Using Multiple Application Bars in Windows Phone Development
date: 2011-12-12
layout: post
categories:
- Windows Phone 7
tags: []
---

<p>You know when you select multiple emails and the application bar swaps out for a different one? No? We’ll get ready to learn. This trick looks much better than enabling and disabling menu items on your application bar and is dead simple to achieve.</p>  <h2>Step 1: Create your Application Bars</h2>  <p>Make sure you have the shell namespace reference at the top of your PhoneApplicationPage:</p>  <pre class="prettyprint">xmlns:shell=&quot;clr-namespace:Microsoft.Phone.Shell;assembly=Microsoft.Phone&quot;</pre>

<p>Create your application bars and add them to your page resources using the following XAML. I’ve created three, naming them “DefaultAppBar”, “SiungleSelectionAppBar” and “MultiSelectionAppBar”.</p>

<pre class="prettyprint">&lt;phone:PhoneApplicationPage.Resources&gt;
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

<pre class="prettyprint">ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources[&quot;DefaultAppBar&quot;];</pre>

<p>It's actually the exact same code to change the application bar to one of our other ones. Check out the following code I use to swap between them when my list fires a selection changed event:</p>

<pre class="prettyprint">if (list.SelectedItems.Count == 1)
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