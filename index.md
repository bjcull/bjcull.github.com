---
layout : layout
title : Ben Cull's Blog
---

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- Above Blog Post -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9830260905637575"
     data-ad-slot="6090557647"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>

<ul id="archive">
    {% for post in site.posts %}
		<li>
			<a href="{{ post.url }}">{{ post.title }}</a>
			<span class="date">{{ post.date | date: "%d %B, %Y" }}</span>
		</li>
    {% endfor %}
</ul>

<!--
<script type="text/javascript">
//<![CDATA[
(function() {
    var links = document.getElementsByTagName('a');
    var query = '?';
    for(var i = 0; i < links.length; i++) {
    if(links[i].href.indexOf('#disqus_thread') >= 0) {
        query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
    }
    }
    document.write('<script charset="utf-8" type="text/javascript" src="http://disqus.com/forums/DISQUS_NAME/get_num_replies.js' + query + '"></' + 'script>');
})();
//]]>
</script>
-->