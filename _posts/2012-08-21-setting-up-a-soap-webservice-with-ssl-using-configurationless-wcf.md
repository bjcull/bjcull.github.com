---
layout: post
title: Setting up a SOAP WebService with SSL using Configurationless WCF
published: false
---

WCF is notorious for being overengineered and difficult to setup, however, these days there are many shortcuts you can take advantage of to get something up and running in no time.

This post will outline how to quickly setup a WCF Webservice to use SOAP, with support for SSL, the configurationless way. Let's dig in.

## Step 1: Create the project
We want File > New Project > WCF > WCF Service Application

* NEW PROJECT IMAGE HERE *

You'll notice that we start with a service already made for us. Each service consists of an interace (IService1.cs) and the actual service code (Service1.svc).

The interface defines what our web service will look like to the outside world and the rest of our code will live in the .svc file.

* STARTING FILES IMAGE HERE *

### IService1.cs ###

Firstly, let's look at the interface. Really, it's just the same as a normal interface with a couple of extra attributes. The `[ServiceContract]` and `[OperationContract]` attributes. The service contract attribute lets WCF know that this interface represents a web service, and the operation contract lets it know that the methods should be a part of that service.

    [ServiceContract]
    public interface IService1
    {
        [OperationContract]
        string GetData(int value);

        [OperationContract]
        CompositeType GetDataUsingDataContract(CompositeType composite);
    }

There is also an example of Data Contracts just below, we'll leave it there for now. The `[DataContract]` attribute allows the class to be serialized to JSON or XML so it can be returned by the web service. The `[DataMember]` attribute let's the class know which properties to serialize and which to ignore.

    [DataContract]
    public class CompositeType
    {
        bool boolValue = true;
        string stringValue = "Hello ";

        [DataMember]
        public bool BoolValue
        {
            get { return boolValue; }
            set { boolValue = value; }
        }

        [DataMember]
        public string StringValue
        {
            get { return stringValue; }
            set { stringValue = value; }
        }
    }


### Service1.svc ###

Now let's look at the Service1.svc file where the majority of our web service code will live. Really, all we are doing is inheriting from the `IService1` class and implementing the methods, returning normal types.

    public class Service1 : IService1
    {
        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }
    }
    
Whilst still in the Service1.svc class, hit Ctrl+F5. Boom, a handy dandy web service tester shoud appear. Right now you might be thinking, Hey! this was far too easy, where is all the pain and suffering? Well as long as all you want is http only, ugly url WCF, then you're fine. Not me though, let's kick it up a notch.

## Extensionless URLs ##

Now it's time to get tricky. Instead of the boring and lame `http://example.com/Service1.svc` we can get any route we want, like  `http://example.com/Service1` or `http://example.com/MyService` or `http://example.com/absolutely/any/route/we/want`.

### System.ServiceModel.Activation ###

Firstly, we are going to need to add a reference to the magical `System.ServiceModel.Activation` namespace.

* ADD REFERENCE IMAGE HERE *

Remember the shortcuts I mentioned earlier? This library contains most of them. It's going to allow us to setup a route to our service quite easily.

### Global.asax ###

Next we are going to setup our Global.asax. At this stage we don't have one yet so start by right clicking your project and going to Add Item. Select the Global Application Class and click add.

You can delete the empty methods that already exist in there and replace them with the following code:

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            RegisterRoutes(RouteTable.Routes);
        }

        private void RegisterRoutes(RouteCollection routes)
        {
            routes.Add(new ServiceRoute("MyService", new ServiceHostFactory(), typeof(Service1)));
        }
    }
    


- WCF Service Application
- Add new item, Global Application Handler
- System.ServiceModel.Activation
- AspNetCompatibilityRequirements attribute
- serviceHostingEnvironment web.config entry
- Add https 