---
title: Using SMTP with Wordpress and IIS
date: 2010-03-28
layout: post
categories:
- Wordpress
tags:
- Email
- IIS
- SMTP
---

This post explains how to use SMTP instead of PHP Mail to fix issues when using Wordpress and IIS.

If you are having issues allowing your wordpress blog to send email and you are running IIS 7 (or you are on shared hosting), you may need to use SMTP instead of PHP Mail when trying to send emails. Here’s a quick guide to setting up SMTP.

## #1 | Download an SMTP Wordpress Plugin

There are a couple of good plugins you can download, the one that worked for me is:

[WP Mail SMTP - http://www.callum-macdonald.com/code/wp-mail-smtp/](http://www.callum-macdonald.com/code/wp-mail-smtp/)

or you can try

[Cimy Swift SMTP - http://www.marcocimmino.net/cimy-wordpress-plugins/cimy-swift-smtp/](http://www.marcocimmino.net/cimy-wordpress-plugins/cimy-swift-smtp/)

Once you have downloaded a plugin, make sure you install and activate it.

## #2 | Set your SMTP Settings

These details change depending on your hosting situation, however most of the time your hosting provider should be able to give them to you.

I use Google Apps, so the following information is specific to Google Apps users. I’m also following the structure of the WP Mail SMTP plugin to make things easier.

<table border="0" cellspacing="0" cellpadding="2" width="549"><tbody>     <tr>       <td valign="top" width="200"><strong>Setting</strong></td>        <td valign="top" width="347"><strong>Value</strong></td>     </tr>      <tr>       <td valign="top" width="200">From Email</td>        <td valign="top" width="347"><a href="mailto:anyuser@yourdomain.com">anyuser@yourdomain.com</a></td>     </tr>      <tr>       <td valign="top" width="200">From Name</td>        <td valign="top" width="347">Any User</td>     </tr>      <tr>       <td valign="top" width="200">Mailer</td>        <td valign="top" width="347">Send all WordPress emails via SMTP</td>     </tr>      <tr>       <td valign="top" width="200">SMTP Host</td>        <td valign="top" width="347">smtp.gmail.com</td>     </tr>      <tr>       <td valign="top" width="200">SMTP Port</td>        <td valign="top" width="347">465</td>     </tr>      <tr>       <td valign="top" width="200">Encryption</td>        <td valign="top" width="347">Use SSL Encryption</td>     </tr>      <tr>       <td valign="top" width="200">Authentication</td>        <td valign="top" width="347">Yes: Use SMTP Authentication</td>     </tr>      <tr>       <td valign="top" width="200">Username</td>        <td valign="top" width="347"><a href="mailto:anyuser@yourdomain.com">anyuser@yourdomain.com</a></td>     </tr>      <tr>       <td valign="top" width="200">Password</td>        <td valign="top" width="347">yourpassword</td>     </tr>   </tbody></table>

If you are using the WP Mail SMTP plugin, you can send a test email by entering an email address in the textbox provided and clicking Send Test.

Any emails sent from wordpress should now be working.

### If you are interested in setting up a contact form  

I’d recommend using the [ContactForm7 Plugin](http://contactform7.com/) as it’s quick and simple to setup.
