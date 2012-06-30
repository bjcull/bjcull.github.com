---
title: How to Use the Long List Selector for Windows Phone Mango
date: 2011-10-09
layout: post
categories:
- Windows Phone 7
tags:
- Long List Selector
- Silverlight Toolkit
---

<p>One of the cool new controls in the Silverlight Toolkit for Windows Phone Mango is the Long List Selector. This post will show you how to get one looking nice, complete with alphabetised grouping.</p>  <h2>Step 1: Make sure you have the Silverlight Toolkit referenced</h2>  <p>The best way to do this is via Nuget: <a title="Silverlight Toolkit for Windows Phone - Nuget" href="http://nuget.org/List/Packages/SilverlightToolkitWP" target="_blank"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: left; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="nuget_silverlight_toolkit" border="0" alt="nuget_silverlight_toolkit" align="left" src="/wp-content/uploads/2011/10/nuget_silverlight_toolkit.png" width="763" height="87" /></a></p>  <p>&#160;</p>  <p>&#160;</p>  <p>or directly from Codeplex:</p>  <p><a title="Silverlight Toolkit for Windows Phone" href="http://silverlight.codeplex.com/releases/view/71550" target="_blank"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="augtk_3" border="0" alt="augtk_3" src="/wp-content/uploads/2011/10/augtk_3.png" width="273" height="82" /></a></p>  <h2>&#160;</h2>  <h2>Step 2: Drop that bad boy onto the page</h2>  <p>Paste the following XAML where you would like to use the control.</p>  <pre class="prettyprint">&lt;toolkit:LongListSelector x:Name=&quot;lstMain&quot; 
GroupHeaderTemplate=&quot;{StaticResource LongListGroupHeader}&quot; GroupItemTemplate=&quot;{StaticResource LongListGroupItemTemplate}&quot;&gt;
    &lt;toolkit:LongListSelector.ItemTemplate&gt;
        &lt;DataTemplate&gt;
            &lt;Grid Margin=&quot;0,12.5,12.5,12.5&quot;&gt;
                &lt;!-- Main List Item Template Here --&gt;
            &lt;/Grid&gt;
        &lt;/DataTemplate&gt;
    &lt;/toolkit:LongListSelector.ItemTemplate&gt;
    &lt;toolkit:LongListSelector.GroupItemsPanel&gt;
        &lt;ItemsPanelTemplate&gt;
            &lt;toolkit:WrapPanel /&gt;
        &lt;/ItemsPanelTemplate&gt;
    &lt;/toolkit:LongListSelector.GroupItemsPanel&gt;
&lt;/toolkit:LongListSelector&gt;</pre>

<p>You'll notice we need to implement a few templates, these include: </p>

<ul>
  <li>ItemTemplate – Each actual list item </li>

  <li>GroupItemsPanel – The panel that holds the popup overlay for selecting a new group </li>

  <li>GroupHeaderTemplate – The item at the beginning of each group in the list </li>

  <li>GroupItemTemplate – The individual items inside the popup overlay </li>
</ul>

<p>The first two I’ve included above for simplicity, this includes the item template (which you will need to create yourself) and the group items panel, in which I’ve used a wrap panel. The second two templates we will add to the resources section of the page as follows:</p>

<pre class="prettyprint">&lt;phone:PhoneApplicationPage.Resources&gt;
    &lt;DataTemplate x:Key=&quot;LongListGroupHeader&quot;&gt;
        &lt;Grid Margin=&quot;12,0,0,0&quot;&gt;
            &lt;Grid Width=&quot;75&quot; Height=&quot;75&quot; HorizontalAlignment=&quot;Left&quot;&gt;
                &lt;TextBlock Margin=&quot;12,0,1,7&quot; TextWrapping=&quot;Wrap&quot; d:LayoutOverrides=&quot;Width, Height&quot; Style=&quot;{StaticResource PhoneTextLargeStyle}&quot; Text=&quot;{Binding Title}&quot; VerticalAlignment=&quot;Bottom&quot;/&gt;
                &lt;Border BorderThickness=&quot;1&quot;&gt;
                    &lt;Border.BorderBrush&gt;
                        &lt;SolidColorBrush Color=&quot;{StaticResource PhoneAccentColor}&quot;/&gt;
                    &lt;/Border.BorderBrush&gt;
                &lt;/Border&gt;
            &lt;/Grid&gt;
        &lt;/Grid&gt;
    &lt;/DataTemplate&gt;
    &lt;DataTemplate x:Key=&quot;LongListGroupItemTemplate&quot;&gt;
        &lt;Border Background=&quot;{Binding GroupBackgroundBrush}&quot; Width=&quot;99&quot; Height=&quot;99&quot; Margin=&quot;6&quot; IsHitTestVisible=&quot;{Binding HasItems}&quot;&gt;
            &lt;TextBlock Text=&quot;{Binding Title}&quot;
                                   FontFamily=&quot;{StaticResource PhoneFontFamilySemiBold}&quot;
                                   FontSize=&quot;36&quot;
                                   Margin=&quot;{StaticResource PhoneTouchTargetOverhang}&quot;
                                   Foreground=&quot;{StaticResource PhoneForegroundBrush}&quot;
                                   VerticalAlignment=&quot;Bottom&quot;/&gt;
        &lt;/Border&gt;
    &lt;/DataTemplate&gt;
&lt;/phone:PhoneApplicationPage.Resources&gt;</pre>

<p>You now have all the XAML you need to rock a kick ass selector like the below screenshots:</p>

<p><a href="/wp-content/uploads/2011/10/ItemTemplates.png"><img style="background-image: none; border-right-width: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="ItemTemplates" border="0" alt="ItemTemplates" src="/wp-content/uploads/2011/10/ItemTemplates_thumb.png" width="148" height="244" /></a><a href="/wp-content/uploads/2011/10/ItemTemplates2.png"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="ItemTemplates2" border="0" alt="ItemTemplates2" src="/wp-content/uploads/2011/10/ItemTemplates2_thumb.png" width="148" height="244" /></a></p>

<p>&#160;</p>

<h2>Step 3: Sweet XAML bro, but how do I bind data?</h2>

<p>Excellent question, you cant just bind a list of items to the itemsource with a long list selector. What you need is the following class and linq queries.</p>

<pre class="prettyprint">public class Group&lt;T&gt; : IEnumerable&lt;T&gt;
{
    public Group(string name, IEnumerable&lt;T&gt; items)
    {
        this.Title = name;
        this.Items = new List&lt;T&gt;(items);
    }

    public override bool Equals(object obj)
    {
        Group&lt;T&gt; that = obj as Group&lt;T&gt;;

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

    public IList&lt;T&gt; Items
    {
        get;
        set;
    }

    public bool HasItems
    {
        get
        {
            return Items.Count &gt; 0;
        }
    }

    public Brush GroupBackgroundBrush
    {
        get
        {
            if (HasItems)
                return (SolidColorBrush)Application.Current.Resources[&quot;PhoneAccentBrush&quot;];
            else
                return (SolidColorBrush)Application.Current.Resources[&quot;PhoneChromeBrush&quot;];
        }
    }

    #region IEnumerable&lt;T&gt; Members

    public IEnumerator&lt;T&gt; GetEnumerator()
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
}</pre>

<p>The group class is fairly simple, and is mostly just a container with a title and a list of items. What makes it handy are the other properties that it provides to the long list selector, such as the background colour and hit test (whether or not a group item can be clicked).</p>

<p>The idea is we are going to bind a list of groups to our long list selector. Check out the following code and then meet me on the other side for an explanation.</p>

<pre class="prettyprint">var allTorrents = (from torrent in model
                select new TorrentListItemViewModel(torrent));

var emptyGroups = new List&lt;Group&lt;TorrentListItemViewModel&gt;&gt;()
{
    new Group&lt;TorrentListItemViewModel&gt;(&quot;#&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;a&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;b&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;c&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;d&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;e&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;f&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;g&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;h&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;i&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;j&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;k&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;l&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;m&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;n&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;o&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;p&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;q&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;r&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;s&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;t&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;u&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;v&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;w&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;x&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;y&quot;, new List&lt;TorrentListItemViewModel&gt;()),
    new Group&lt;TorrentListItemViewModel&gt;(&quot;z&quot;, new List&lt;TorrentListItemViewModel&gt;())
};
                                        
var groupedTorrents = (from t in allTorrents
                group t by t.GroupHeader into grp
                orderby grp.Key
                select new Group&lt;TorrentListItemViewModel&gt;(grp.Key, grp));

lstMain.ItemsSource = (from t in groupedTorrents.Union(emptyGroups)
                orderby t.Title
                select t).ToList();</pre>

<p>We start off by fetching the data I need and creating a list of my item view models (TorrentListItemViewModel). Next I create a base list of groups that I want to appear on my screen, regardless of whether or not they have data.</p>

<p>Next I turn my flat list of torrents into a list of groups based on the first letter of their name. The magic coming from the GroupHeader property on my view model, which i’ve shared below:</p>

<pre class="prettyprint">public string GroupHeader
{
    get
    {
        switch (Name.ToLower().Substring(0,1))
        {
            case &quot;a&quot;: return &quot;a&quot;;
            case &quot;b&quot;: return &quot;b&quot;;
            case &quot;c&quot;: return &quot;c&quot;;
            case &quot;d&quot;: return &quot;d&quot;;
            case &quot;e&quot;: return &quot;e&quot;;
            case &quot;f&quot;: return &quot;f&quot;;
            case &quot;g&quot;: return &quot;g&quot;;
            case &quot;h&quot;: return &quot;h&quot;;
            case &quot;i&quot;: return &quot;i&quot;;
            case &quot;j&quot;: return &quot;j&quot;;
            case &quot;k&quot;: return &quot;k&quot;;
            case &quot;l&quot;: return &quot;l&quot;;
            case &quot;m&quot;: return &quot;m&quot;;
            case &quot;n&quot;: return &quot;n&quot;;
            case &quot;o&quot;: return &quot;o&quot;;
            case &quot;p&quot;: return &quot;p&quot;;
            case &quot;q&quot;: return &quot;q&quot;;
            case &quot;r&quot;: return &quot;r&quot;;
            case &quot;s&quot;: return &quot;s&quot;;
            case &quot;t&quot;: return &quot;t&quot;;
            case &quot;u&quot;: return &quot;u&quot;;
            case &quot;v&quot;: return &quot;v&quot;;
            case &quot;w&quot;: return &quot;w&quot;;
            case &quot;x&quot;: return &quot;x&quot;;
            case &quot;y&quot;: return &quot;y&quot;;
            case &quot;z&quot;: return &quot;z&quot;;
            default: return &quot;#&quot;;
        }
    }
}</pre>

<p>Basically I calculate on the fly which group the torrent belongs to based on it's Name property, defaulting to symbol if no letter is found.</p>

<p>Lastly I Union together the list of torrent groups and empty groups to create a fully filled list of groups that I bind to the long list selector’s ItemsSource property.</p>

<p>That should be all you need to create an alphabetical long list selector. A bit long winded in places, but it does the job nicely.</p>

<h2>&#160;</h2>

<h2>Step 4: Where else can I get info?</h2>

<p>Please check out the <a title="Silverlight Toolkit for Windows Phone Sample Project" href="http://silverlight.codeplex.com/releases/view/71550" target="_blank">silverlight toolkit’s sample project</a> for a succinct and easy to follow piece of sample code for the long list selector and other cool controls.</p>