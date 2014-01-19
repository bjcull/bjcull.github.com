---
title: Deserializing JSON in Android using GSON
date: 2010-04-30
layout: post
categories:
- Android
- Web Services
tags:
- Gson
- Json
- Serialization
---

The quickest and easiest way to serialize/deserialize JSON in Android is to use Google’s GSON library. It contains almost everything you need to connect your android application to a web service that returns JSON. I’ve also included a quick filter to successfully deserialize Microsoft styled dates from JSON to Java.

## Download the GSON library

Go ahead and download the latest GSON library which can be found here:

[GSON Library](http://code.google.com/p/google-gson/ "GSON Library")

Make sure you import this into your Android project as an imported library by going to:

Project > Properties > Java Build Path > Libraries > Add Jars…    
(Eclipse build id: 20100218-1602)

##Connect to a Web Service

I would highly recommend you connect to a web service by using the java class written by my friend and I which can be found here:

[Lukencode - Calling Web Services in Android using HttpClient](http://lukencode.com/2010/04/27/calling-web-services-in-android-using-httpclient/ "Lukencode - Calling Web Services in Android using HttpClient")

At the bottom of the post there is an example that returns a string of json data, just replace the [Insert JSON data here] in the below section with the code example from lukencode. For testing, however, it is a good idea to use a hard coded json, so you are not relying on timely API calls.

##Setup the Deserializer

Lets build our deserializer by using the following code, using the type “Gig” as an example:

    String jsonData = "[Insert JSON data here]";

    GsonBuilder gsonb = new GsonBuilder();
    Gson gson = gsonb.create();

    JSONObject j;
    Gig gig = null;

    try
    {
        j = new JSONObject(jsonData);
        gig = gson.fromJson(j.toString(), Gig.class);
    }
    catch(Exception e)
    {
        e.printStackTrace();
    }

Firstly, ensure you have JSON data ready to parse. This can be gathered through a web service call, or any other method of getting JSON data. Next we setup the GSON library by using the GSON builder to create a GSON object.

After this we setup our variables and then try to parse the jsonData into a JSONObject, which is just a java object representation of the JSON data.

Once we have our JSONObject, we can try to deserialize it into a java object by using the fromJson method. To do this we pass in the JSON object we created just above, and the class that we would like to deserialize to. If a property is not found in the JSON data, it will be left as null; Also if a property inside the JSON data is not part of the targeted class, it will be ignored.

##Dealing with WCF Microsoft JSON Dates

If you are like me and use WCF RESTful Web Services, you may have run into the fact that GSON cannot deserialize any Date objects. This can be fixed by making the following alterations to your code, and implementing this date deserializer I have written.

Firstly create the DateDeserializer class using the following code:

	import java.lang.reflect.Type;
	import java.util.Date;
	import java.util.regex.Matcher;
	import java.util.regex.Pattern;
	
	import com.google.gson.JsonDeserializationContext;
	import com.google.gson.JsonDeserializer;
	import com.google.gson.JsonElement;
	import com.google.gson.JsonParseException;
	
	public class DateDeserializer implements JsonDeserializer&lt;Date&gt; {
	      public Date deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
	          throws JsonParseException {
	          String JSONDateToMilliseconds = &quot;\\/(Date\\((.*?)(\\+.*)?\\))\\/&quot;;
	          Pattern pattern = Pattern.compile(JSONDateToMilliseconds);
	          Matcher matcher = pattern.matcher(json.getAsJsonPrimitive().getAsString());
	          String result = matcher.replaceAll(&quot;$2&quot;);
	
	          return new Date(new Long(result));
	      }
	}
	
This class takes in a Microsoft Styled JSON Date and filters it down to an amount of milliseconds since 1 Jan 1970 GMT, allowing you to pass it into a regular Java Date object constructor. Be warned that the above code ignores the time zone of the date.

Now you can make the following alteration to the first block of code to make it look like this:

	String jsonData = "[Insert JSON data here]";
	
	GsonBuilder gsonb = new GsonBuilder();
	DateDeserializer ds = new DateDeserializer();
	gsonb.registerTypeAdapter(Date.class, ds);
	Gson gson = gsonb.create();
	
	JSONObject j;
	Gig gig = null;
	
	try
	{
	    j = new JSONObject(jsonData);
	    gig = gson.fromJson(j.toString(), Gig.class);
	}
	catch(Exception e)
	{
	    e.printStackTrace();
	}
	
This allows us to automatically handle any date object within the JSONObject and deserialize it using our code. You should now be able to successfully deserialize json data from a web service.

##Find More Android Tips

I’ve been writing some Android blog posts to help android developers, especially those coming from C#, ease into android development best practices. You can find these blog posts by browsing through my [Android Tag](http://benjii.me/tag/android/ "Android Tag")
