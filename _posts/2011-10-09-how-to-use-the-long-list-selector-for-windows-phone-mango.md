---
title: How to Use the Long List Selector for Windows Phone Mango
date: 2011-10-09
layout: post
categories:
- Windows Phone 7
tags:
- Long List Selector
- Silverlight Toolkit
published: true
---

One of the cool new controls in the Silverlight Toolkit for Windows Phone Mango is the Long List Selector. This post will show you how to get one looking nice, complete with alphabetised grouping.

## Step 1: Make sure you have the Silverlight Toolkit referenced

The best way to do this is via Nuget: 

[![nuget_silverlight_toolkit](/wp-content/uploads/2011/10/nuget_silverlight_toolkit.png "nuget_silverlight_toolkit")](http://nuget.org/List/Packages/SilverlightToolkitWP "Silverlight Toolkit for Windows Phone - Nuget")

or directly from Codeplex:

[![augtk_3](/wp-content/uploads/2011/10/augtk_3.png "augtk_3")](http://silverlight.codeplex.com/releases/view/71550 "Silverlight Toolkit for Windows Phone")

## Step 2: Drop that bad boy onto the page

Paste the following XAML where you would like to use the control.

    <toolkit:LongListSelector x:Name="lstMain" 
    GroupHeaderTemplate="{StaticResource LongListGroupHeader}" GroupItemTemplate="{StaticResource LongListGroupItemTemplate}">
        <toolkit:LongListSelector.ItemTemplate>
            <DataTemplate>
                <Grid Margin="0,12.5,12.5,12.5">
                    <!-- Main List Item Template Here -->
                </Grid>
            </DataTemplate>
        </toolkit:LongListSelector.ItemTemplate>
        <toolkit:LongListSelector.GroupItemsPanel>
            <ItemsPanelTemplate>
                <toolkit:WrapPanel />
            </ItemsPanelTemplate>
        </toolkit:LongListSelector.GroupItemsPanel>
    </toolkit:LongListSelector>

You'll notice we need to implement a few templates, these include: 

*   ItemTemplate – Each actual list item*   GroupItemsPanel – The panel that holds the popup overlay for selecting a new group*   GroupHeaderTemplate – The item at the beginning of each group in the list*   GroupItemTemplate – The individual items inside the popup overlay

The first two I’ve included above for simplicity, this includes the item template (which you will need to create yourself) and the group items panel, in which I’ve used a wrap panel. The second two templates we will add to the resources section of the page as follows:

    <phone:PhoneApplicationPage.Resources>
        <DataTemplate x:Key="LongListGroupHeader">
            <Grid Margin="12,0,0,0">
                <Grid Width="75" Height="75" HorizontalAlignment="Left">
                    <TextBlock Margin="12,0,1,7" TextWrapping="Wrap" d:LayoutOverrides="Width, Height" Style="{StaticResource PhoneTextLargeStyle}" Text="{Binding Title}" VerticalAlignment="Bottom"/>
                    <Border BorderThickness="1">
                        <Border.BorderBrush>
                            <SolidColorBrush Color="{StaticResource PhoneAccentColor}"/>
                        </Border.BorderBrush>
                    </Border>
                </Grid>
            </Grid>
        </DataTemplate>
        <DataTemplate x:Key="LongListGroupItemTemplate">
            <Border Background="{Binding GroupBackgroundBrush}" Width="99" Height="99" Margin="6" IsHitTestVisible="{Binding HasItems}">
                <TextBlock Text="{Binding Title}"
                                       FontFamily="{StaticResource PhoneFontFamilySemiBold}"
                                       FontSize="36"
                                       Margin="{StaticResource PhoneTouchTargetOverhang}"
                                       Foreground="{StaticResource PhoneForegroundBrush}"
                                       VerticalAlignment="Bottom"/>
            </Border>
        </DataTemplate>
    </phone:PhoneApplicationPage.Resources>

You now have all the XAML you need to rock a kick ass selector like the below screenshots:

[
![ItemTemplates](/wp-content/uploads/2011/10/ItemTemplates_thumb.png "ItemTemplates")](/wp-content/uploads/2011/10/ItemTemplates.png)
[
![ItemTemplates2](/wp-content/uploads/2011/10/ItemTemplates2_thumb.png "ItemTemplates2")](/wp-content/uploads/2011/10/ItemTemplates2.png)

## Step 3: Sweet XAML bro, but how do I bind data?

Excellent question, you cant just bind a list of items to the itemsource with a long list selector. What you need is the following class and linq queries.

    public class Group<T> : IEnumerable<T>
    {
        public Group(string name, IEnumerable<T> items)
        {
            this.Title = name;
            this.Items = new List<T>(items);
        }

        public override bool Equals(object obj)
        {
            Group<T> that = obj as Group<T>;

            return (that != null) &amp;&amp; (this.Title.Equals(that.Title));
        }

        public override int GetHashCode()
        {
            return this.Title.GetHashCode();
        }

        public string Title
        {
            get;
            set;
        }

        public IList<T> Items
        {
            get;
            set;
        }

        public bool HasItems
        {
            get
            {
                return Items.Count > 0;
            }
        }

        public Brush GroupBackgroundBrush
        {
            get
            {
                if (HasItems)
                    return (SolidColorBrush)Application.Current.Resources["PhoneAccentBrush"];
                else
                    return (SolidColorBrush)Application.Current.Resources["PhoneChromeBrush"];
            }
        }

        #region IEnumerable<T> Members

        public IEnumerator<T> GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        #endregion

        #region IEnumerable Members

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        #endregion
    }

The group class is fairly simple, and is mostly just a container with a title and a list of items. What makes it handy are the other properties that it provides to the long list selector, such as the background colour and hit test (whether or not a group item can be clicked).

The idea is we are going to bind a list of groups to our long list selector. Check out the following code and then meet me on the other side for an explanation.

    var allTorrents = (from torrent in model
                       select new TorrentListItemViewModel(torrent));

    var emptyGroups = new List<Group<TorrentListItemViewModel>>()
    {
        new Group<TorrentListItemViewModel>("#", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("a", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("b", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("c", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("d", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("e", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("f", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("g", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("h", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("i", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("j", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("k", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("l", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("m", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("n", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("o", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("p", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("q", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("r", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("s", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("t", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("u", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("v", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("w", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("x", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("y", new List<TorrentListItemViewModel>()),
        new Group<TorrentListItemViewModel>("z", new List<TorrentListItemViewModel>())
    };

    var groupedTorrents = (from t in allTorrents
                    group t by t.GroupHeader into grp
                    orderby grp.Key
                    select new Group<TorrentListItemViewModel>(grp.Key, grp));

    lstMain.ItemsSource = (from t in groupedTorrents.Union(emptyGroups)
                    orderby t.Title
                    select t).ToList();

We start off by fetching the data I need and creating a list of my item view models (TorrentListItemViewModel). Next I create a base list of groups that I want to appear on my screen, regardless of whether or not they have data.

Next I turn my flat list of torrents into a list of groups based on the first letter of their name. The magic coming from the GroupHeader property on my view model, which i’ve shared below:

    public string GroupHeader
    {
        get
        {
            switch (Name.ToLower().Substring(0,1))
            {
                case "a": return "a";
                case "b": return "b";
                case "c": return "c";
                case "d": return "d";
                case "e": return "e";
                case "f": return "f";
                case "g": return "g";
                case "h": return "h";
                case "i": return "i";
                case "j": return "j";
                case "k": return "k";
                case "l": return "l";
                case "m": return "m";
                case "n": return "n";
                case "o": return "o";
                case "p": return "p";
                case "q": return "q";
                case "r": return "r";
                case "s": return "s";
                case "t": return "t";
                case "u": return "u";
                case "v": return "v";
                case "w": return "w";
                case "x": return "x";
                case "y": return "y";
                case "z": return "z";
                default: return "#";
            }
        }
    }

Basically I calculate on the fly which group the torrent belongs to based on it's Name property, defaulting to symbol if no letter is found.

Lastly I Union together the list of torrent groups and empty groups to create a fully filled list of groups that I bind to the long list selector’s ItemsSource property.

That should be all you need to create an alphabetical long list selector. A bit long winded in places, but it does the job nicely.

## Step 4: Where else can I get info?

Please check out the [silverlight toolkit’s sample project](http://silverlight.codeplex.com/releases/view/71550 "Silverlight Toolkit for Windows Phone Sample Project") for a succinct and easy to follow piece of sample code for the long list selector and other cool controls.
