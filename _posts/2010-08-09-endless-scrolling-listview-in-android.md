---
title: Endless Scrolling ListView in Android
date: 2010-08-09
layout: post
categories:
- Android
tags:
- ListView
- Scrolling
published: true
---

<p>
<a title="Pictured: Not Uninfinity" href="http://www.google.com.au/images?hl=en&amp;q=infinity&amp;um=1&amp;ie=UTF-8&amp;source=og&amp;sa=N&amp;tab=wi&amp;biw=1680&amp;bih=871" target="_blank">
<img style="border-bottom: 0px; border-left: 0px; display: inline; margin-left: 0px; border-top: 0px; margin-right: 0px; border-right: 0px" title="Not Uninfinity" border="0" alt="Not Uninfinity" align="right" src="/wp-content/uploads/2010/08/newInfinity.jpg" width="244" height="116" />
</a> Implementing an endless scroller in Android was not actually that difficult. Here’s a quick code snippet and explanation to get you on your way.</p>  
<h2>Just give me the code!</h2>  
<p>Well here you go:</p>  
<pre class="prettyprint">    public class EndlessScrollListener implements OnScrollListener {

        private int visibleThreshold = 5;
        private int currentPage = 0;
        private int previousTotal = 0;
        private boolean loading = true;

        public EndlessScrollListener() {
        }
        public EndlessScrollListener(int visibleThreshold) {
            this.visibleThreshold = visibleThreshold;
        }

        @Override
        public void onScroll(AbsListView view, int firstVisibleItem,
                int visibleItemCount, int totalItemCount) {
            if (loading) {
                if (totalItemCount &gt; previousTotal) {
                    loading = false;
                    previousTotal = totalItemCount;
                    currentPage++;
                }
            }
            if (!loading &amp;&amp; (totalItemCount - visibleItemCount) &lt;= (firstVisibleItem + visibleThreshold)) {
                // I load the next page of gigs using a background task,
                // but you can call any function here.
                new LoadGigsTask().execute(currentPage + 1);
                loading = true;
            }
        }

        @Override
        public void onScrollStateChanged(AbsListView view, int scrollState) {
        }
    }</pre>

<p>Ok, so all we’ve done is implement our own <a title="OnScrollListener" href="http://developer.android.com/reference/android/widget/AbsListView.OnScrollListener.html" target="_blank">OnScrollListener</a> named EndlessScrollListener, which can be called like so:</p>

<pre class="prettyprint">GigList.setOnScrollListener(new EndlessScrollListener());</pre>

<h2>Now Explain:</h2>

<p>We start our class with a few private variables which perform the following functions:</p>

<ul>
  <li>visibleThreshold – The minimum amount of items to have below your current scroll position, before loading more.</li>

  <li>currentPage – The current page of data you have loaded</li>

  <li>previousTotal – The total number of items in the dataset after the last load</li>

  <li>loading – True if we are still waiting for the last set of data to load.</li>
</ul>

<p>Next we have a couple of constructors that allow us to set the visibleThreshold inline if we want.</p>

<p>The first overridden method we have is called every time the list is scrolled. This happens many times a second during a scroll, so be wary of the code you place here. We are given a few useful parameters to help us work out if we need to load some more data, but first we check if we are waiting for the previous load to finish.</p>

<p>If it’s still loading, we check to see if the dataset count has changed, if so we conclude it has finished loading and update the current page number and total item count.</p>

<p>If it isn’t currently loading, we check to see if we have breached the visibleThreshold and need to reload more data. If we do need to reload some more data, we execute a background task and set the loading flag to true. Thus solving the problem forever!</p>

<p>The last method in the class we do not need, however if you’re interested, it is primarily used for tracking changes in the scroll action itself via the <a title="OnClickListener - scrollState" href="http://developer.android.com/reference/android/widget/AbsListView.OnScrollListener.html#onScrollStateChanged%28android.widget.AbsListView,%20int%29" target="_blank">scrollState</a> parameter.</p>

<p>Finally, the code to call the class creates a new instance of EndlessScrollListener and bind’s it to a ListView of mine. Of course put your own ListView in place of GigList.</p>