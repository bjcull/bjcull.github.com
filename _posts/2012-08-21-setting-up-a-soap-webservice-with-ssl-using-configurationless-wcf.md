---
layout: post
date: 2012-08-21
title: Setting up a SOAP WebService with SSL using Configurationless WCF
published: true
---

WCF is notorious for being overengineered and difficult to setup, however, these days there are many shortcuts you can take advantage of to get something up and running in no time.

This post will outline how to quickly setup a WCF Webservice to use SOAP, with support for SSL, the configurationless way. Let's dig in.

## Step 1: Create the project
We want File > New Project > WCF > WCF Service Application

![New Project](http://i.imgur.com/2FE5P.png)

You'll notice that we start with a service already made for us. Each service consists of an interface (IService1.cs) and the actual service code (Service1.svc).

The interface defines what our web service will look like to the outside world and the rest of our code will live in the .svc file.

![Starting Files](http://i.imgur.com/bWxTt.png)

#### IService1.cs ####

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


#### Service1.svc ####

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

#### System.ServiceModel.Activation ####

Firstly, we are going to need to add a reference to the magical `System.ServiceModel.Activation` namespace.

![Add Reference](http://i.imgur.com/JbmXC.png)

Remember the shortcuts I mentioned earlier? This library contains most of them. It's going to allow us to setup a route to our service quite easily.

#### Global.asax ####

Next we are going to setup our Global.asax. At this stage we don't have one yet so start by right clicking your project and going to Add Item. Select the Global Application Class and click add.

![Global.asax](http://i.imgur.com/7Diz2.png)

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
    
All we're really doing here is setting up the route. If you've done any work with MVC or any other routing, this should hopefully be familiar. For everyone else, the important parts are: `"MyService"` which is the url (or route) we want to achieve; `new ServiceHostFactory()` which sets up our SOAP web service via some magic from the System.ServiceModel.Activation library; and `typeof(Service1)` which points to the Service1.svc class we made earlier.

In a sentence it means, If someone navigates to `http://example.com/MyService` respond with our Service1.svc class using SOAP.

#### AspNetCompatibility ####

If you tried to run your service at this point, you might realise that you can't. There are a couple of compatibility issues we need to cleanup first.

Firstly, add the following attribute to your Service1.svc class.

    [AspNetCompatibilityRequirements(RequirementsMode=AspNetCompatibilityRequirementsMode.Allowed)]
    
Now add the following line to your web config, inside the `<system.serviceModel>` tag.

    <serviceHostingEnvironment aspNetCompatibilityEnabled="True" />

Congratulations! You now have a fully working SOAP web service complete with extensionless urls. If, like me, you needed to deploy this to a secure environment and have people access it using https/SSL then you best read on.

## Https/SSL Support ##

Configurationless WCF has made life so much easier when it comes to setting up a web service, however it does fall over if you venture outside the bounds of what it likes to do. Https/SSL is one such example.

Luckily for you I've already dealt with the pain and have come up with a simple class that will handle everything for you.

Firstly, add the following class to your project:

    public class HttpsServiceHostFactory : ServiceHostFactory
    {
        protected override System.ServiceModel.ServiceHost CreateServiceHost(Type serviceType, Uri[] baseAddresses)
        {
            ServiceHost host = new ServiceHost(serviceType, baseAddresses);

            foreach (Uri baseAddress in baseAddresses)
            {
                BasicHttpBinding binding = CreateSoapBinding(baseAddress);
                ServiceEndpoint endpoint = host.AddServiceEndpoint(serviceType.GetInterfaces()[0], binding, baseAddress);
            }

            if (HasHttpEndpoint(baseAddresses))
            {
                if (host.Description.Behaviors.Contains(typeof(ServiceMetadataBehavior)))
                {
                    var smb = (ServiceMetadataBehavior)host.Description.Behaviors[typeof(ServiceMetadataBehavior)];
                    smb.HttpGetEnabled = true;
                }
                else
                {
                    var smb = new ServiceMetadataBehavior();
                    smb.HttpGetEnabled = true;

                    host.Description.Behaviors.Add(smb);
                }
            }

            if (HasHttpsEndpoint(baseAddresses))
            {
                if (host.Description.Behaviors.Contains(typeof(ServiceMetadataBehavior)))
                {
                    var smb = (ServiceMetadataBehavior)host.Description.Behaviors[typeof(ServiceMetadataBehavior)];
                    smb.HttpsGetEnabled = true;
                }
                else
                {
                    var smb = new ServiceMetadataBehavior();
                    smb.HttpsGetEnabled = true;

                    host.Description.Behaviors.Add(smb);
                }
            }

            return host;
        }

        private bool HasHttpsEndpoint(Uri[] baseAddresses)
        {
            return baseAddresses.Any(b => b.Scheme == Uri.UriSchemeHttps);
        }

        private bool HasHttpEndpoint(Uri[] baseAddresses)
        {
            return baseAddresses.Any(b => b.Scheme == Uri.UriSchemeHttp);
        }

        private BasicHttpBinding CreateSoapBinding(Uri baseAddress)
        {
            BasicHttpBinding binding;
            if (baseAddress.Scheme == Uri.UriSchemeHttps)
            {
                binding = new BasicHttpBinding(BasicHttpSecurityMode.Transport);
            }
            else
            {
                binding = new BasicHttpBinding();
            }

            return binding;
        }

    }
    
Now, all we need to do to take advantage of it's magic is change our route. Remember this from our Global.asax?

    routes.Add(new ServiceRoute("MyService", new ServiceHostFactory(), typeof(Service1)));
Change it to this:

    routes.Add(new ServiceRoute("MyService", new HttpsServiceHostFactory(), typeof(Service1)));

Tada! We now have a fully functioning, SSL supporting, SOAP loving web service.