---
title: Continuum Transition for Windows Phone Silverlight Toolkit
date: 2011-11-07
layout: post
categories:
- Windows Phone 7
tags:
- animation
- continuum
- Silverlight Toolkit
- transition
- windows phone
---

<p><a href="/wp-content/uploads/2011/11/WP7_Email.png"><img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: right; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="Check out my awesome Paint.NET skills!" border="0" alt="Check out my awesome Paint.NET skills!" align="right" src="/wp-content/uploads/2011/11/WP7_Email_thumb.png" width="244" height="198" /></a>You know that cool swooshing transition you get when you click an email on your Windows Phone? Now you too can make use of that awesome transition using only the Silverlight Toolkit and this handy dandy Continuum Transition class.</p>  <h2>Step 1 – Go get the Silverlight Toolkit!!</h2>  <p>As always, I suggest you use Nuget to include it, but feel free to <a title="Download the Silverlight Toolkit for Windows Phone" href="http://silverlight.codeplex.com/" target="_blank">download it from Codeplex</a></p>  <p>&#160;</p>  <h2>Step 2 – Let’s See How to Use It</h2>  <p>The actual continuum transition class is pretty big for a blog post, so I’ll show you how to use it first and then you can copy the Continuum Transition class after that.</p>  <p>If you are already using the Silverlight Toolkit transitions using code, then this should hopefully be familar:</p>  <pre class="brush: csharp; ruler: true;">private void ListBox_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
{
    var selectedElement = (sender as ListBox).ItemContainerGenerator.ContainerFromIndex(lstSeeding.SelectedIndex) as FrameworkElement;
                    
    var navOutTransition = new NavigationOutTransition();
    navOutTransition.Forward = new ContinuumTransition(ContinuumTransitionMode.ContinuumForwardOutStoryboard, selectedElement);

    var navInTransition = new NavigationInTransition();
    navInTransition.Backward = new ContinuumTransition(ContinuumTransitionMode.ContinuumBackwardInStoryboard, selectedElement);

    PhoneApplicationPage phoneApplicationPage =
    (PhoneApplicationPage)(((PhoneApplicationFrame)Application.Current.RootVisual)).Content;

    TransitionService.SetNavigationOutTransition(phoneApplicationPage, navOutTransition);
    TransitionService.SetNavigationInTransition(phoneApplicationPage, navInTransition);

    NavigationService.Navigate(new Uri(&quot;/DetailPage.xaml&quot;, UriKind.Relative));
}</pre>

<p>I’ve used a listbox’s selection changed event as an example, as this is the most common scenario. To break it down, firstly we get the selected item’s framework element. This is the containing element that we are going to animate, in this case a list item.</p>

<p>Next, we setup the actual transitions using the awesome continuum transition class. The first parameter is the type of transition you are making and the second is the element you wish to animate.</p>

<p>After this, we obtain our phone application page and assign the transitions to the transition service.</p>

<p>Once we have done that we can navigate as per normal and the page will automatically transition for you!</p>

<p>&#160;</p>

<h2>Step 3 – Copy the Continuum Transition Class</h2>

<p>The code in full is below. It is <a title="Continuum Transition on Github" href="https://gist.github.com/1345156" target="_blank">hosted on Github</a> so you can be confident the below code is up to date.</p>

<p>Also please note the actual storyboards have come from the awesome guys at Clarity Consulting. There is an <a title="Clarity Consulting Page Transitions Sample" href="http://blogs.claritycon.com/kevinmarshall/2010/10/13/wp7-page-transitions-sample/" target="_blank">especially useful post about transitions you should go read right now</a>.</p>
[gist id=1345156] 

<p>Welcome to the bottom of the post, please spread the word about this transition to better the Windows Phone platform for everyone :)</p>