---
title: Using Multiple Application Bars in Windows Phone Development
date: 2011-12-12
layout: post
categories:
- Windows Phone 7
tags: []
---

You know when you select multiple emails and the application bar swaps out for a different one? No? We’ll get ready to learn. This trick looks much better than enabling and disabling menu items on your application bar and is dead simple to achieve.

## Step 1: Create your Application Bars

Make sure you have the shell namespace reference at the top of your PhoneApplicationPage:

    xmlns:shell="clr-namespace:Microsoft.Phone.Shell;assembly=Microsoft.Phone"

Create your application bars and add them to your page resources using the following XAML. I’ve created three, naming them “DefaultAppBar”, “SiungleSelectionAppBar” and “MultiSelectionAppBar”.

    <phone:PhoneApplicationPage.Resources>
        <shell:ApplicationBar x:Key="DefaultAppBar" IsVisible="True">
            <shell:ApplicationBarIconButton x:Name="mnuAdd" IconUri="/icons/appbar.add.rest.png" IsEnabled="True" Text="Add" Click="mnuAdd_Click"/>
        </shell:ApplicationBar>
        <shell:ApplicationBar x:Key="SingleSelectionAppBar" IsVisible="True">
            <shell:ApplicationBarIconButton x:Name="mnuPin" IconUri="/icons/appbar.pushpin.png" IsEnabled="True" Text="Pin" Click="mnuPin_Click" />
            <shell:ApplicationBarIconButton x:Name="mnuDelete" IconUri="/icons/appbar.delete.rest.png" IsEnabled="True" Text="Delete" Click="mnuDelete_Click"/>
            <shell:ApplicationBarIconButton x:Name="mnuEdit" IconUri="/icons/appbar.edit.rest.png" IsEnabled="True" Text="Edit" Click="mnuEdit_Click"/>
        </shell:ApplicationBar>
        <shell:ApplicationBar x:Key="MultiSelectionAppBar" IsVisible="True">
            <shell:ApplicationBarIconButton x:Name="mnuDeleteMulti" IconUri="/icons/appbar.delete.rest.png" IsEnabled="True" Text="Delete" Click="mnuDelete_Click"/>
        </shell:ApplicationBar>
    </phone:PhoneApplicationPage.Resources>

## Step 2: Use Code to Swap Between Them

Firstly, we need to set a default application bar to load with the page. We can do this by adding the following code to the constructor:

    ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources["DefaultAppBar"];

It's actually the exact same code to change the application bar to one of our other ones. Check out the following code I use to swap between them when my list fires a selection changed event:

    if (list.SelectedItems.Count == 1)
    {
        ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources["SingleSelectionAppBar"];
    }
    else if (list.SelectedItems.Count > 1)
    {
        ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources["MultiSelectionAppBar"];
    }
    else
    {
        ApplicationBar = (Microsoft.Phone.Shell.ApplicationBar)Resources["DefaultAppBar"];
    }

That's it. You'll also notice that when you change application bars, it uses a cool swoosh down and then back up animation. All for free.
