---
title: "SuperQ – A Portable Persistent .NET Queue"
date: 2010-09-05
layout: post
categories:
- .NET
- Database
tags:
- Azure
- Portable
- Queue
---

[![I](/wp-content/uploads/2010/09/largesuperqlogolightweighttshirt_design.png "I")](http://www.spreadshirt.com/large-super-q-logo-light-weight-t-shirt-C3380A4298535 "I") SuperQ is much like the Queue Storage for Windows Azure, except it automatically creates a local db instead of using the cloud. It is also self-polling, so all you need is a callback method and you’re ready to go. This allows you to create quick and easy task schedulers and background worker processes.

## Step #1 – Ensure you have SQL Compact Edition 4 Installed

To let SuperQ build a database automatically in your App_Data folder, we have opted to use SQL Compact Edition 4.

Use the Web Platform Installer to download and install SQL Compact Edition 4. If you’ve never used Web Platform Installer, I strongly [urge you to try it](http://www.microsoft.com/web/webmatrix/download/ "Download Web Platform Installer"), it makes installing common software a breeze.

Otherwise you can download SQL Compact Edition 4 directly from here: [http://www.microsoft.com/downloads/details.aspx?FamilyID=0d2357ea-324f-46fd-88fc-7364c80e4fdb&amp;displaylang=en](http://www.microsoft.com/downloads/details.aspx?FamilyID=0d2357ea-324f-46fd-88fc-7364c80e4fdb&amp;displaylang=en "http://www.microsoft.com/downloads/details.aspx?FamilyID=0d2357ea-324f-46fd-88fc-7364c80e4fdb&amp;displaylang=en")

## Step #2 – Reference the SuperQ Library

Download and reference the SuperQ library from here: [http://github.com/downloads/bjcull/SuperQ/SuperQ_v0.3.dll](http://github.com/downloads/bjcull/SuperQ/SuperQ_v0.3.dll "http://github.com/downloads/bjcull/SuperQ/SuperQ_v0.3.dll")

If you’re interested in the inner workings of the queue, or would like to help out, please feel free to jump over to [http://github.com/bjcull/SuperQ](http://github.com/bjcull/SuperQ "http://github.com/bjcull/SuperQ") and grab the latest source code for yourself.

On a side note, either me or [lukencode](http://lukencode.com "lukencode") will probably be doing a blog post on how to implement some of the features that SuperQ makes use of such as Async Callbacks and SQL Compact DB Creation, soon.

## Step #3 – Use the Queue

**UPDATE (8 Sep 2010): **I’ve now implemented class level generics instead of method level, as suggested by [James Curran](http://www.honestillusion.com/ "What a champion").

You now have access to one of the most abbreviated and super of queues known to man. Here are a few common methods to get you going:

### Create or Open a Queue

This will create a queue in your data folder (Usually App_Data) with the name provided. If it already exists it just opens it. Since SuperQ can only handle one type per queue, you must specify it when calling GetQueue, as above.

Sorry about the namespace, it might be changed in future.

### Push a message onto the queue

    queue.PushMessage("P was pressed in message form");

    // OR

    var queue = SuperQ.SuperQ<int>.GetQueue("MyQueueInt");queue.PushMessage(45);

    // OR

    var queue = SuperQ.SuperQ<MyClass>.GetQueue("MyQueueClass");
    queue.PushMessage(
        new MyClass() {
            Name = "Ben",
            Status = "Awesome",
            Amount = 10000.00
        }
    );
    
Yep, you can push whatever class you like onto the queue and you’re guaranteed to get it back.

### Get a message off the queue

    var message = queue.GetMessage();

    // Payload will be the same type you specify above
    MyClass result = message.Payload;

    // Instead of using get message, you can call get payload to just get the next payload

    var payload = queue.GetPayload();

Keep in mind that SuperQ is designed to use only one type at a time per queue. Please also remember to delete the message from the queue once you have successfully processed it. See Below.

### Delete the message from the queue

    queue.DeleteMessage(message);

To make sure that the queue message will survive even if your program crashes, you must delete the message from the queue within 30 seconds (soon to be an option) otherwise the message will become available to other GetMessage calls.

### Automatically receive a callback when a message arrives

If you do not want to poll the queue manually, you can setup a callback method that will be called each time there is a message waiting to be processed.

First create the callback method like so:

    protected void MessageReceived(QueueMessage<MyClass> message)
    {
        Console.WriteLine("Message Received: " + message.Payload.Name);
        queue.DeleteMessage(message);
    }
    
Now you can start and stop the callback like so:

    // Start receiving messages
    queue.StartReceiving(MessageReceived);

    // Run for as long as you like here

    //Stop receiving messages
    queue.StopReceiving();

## Can I have an example of all of the above?

No problem imaginary heading friend, SuperQ can help. Here’s a quick Console App combining all the above methods:

    class Program
    {
        private static SuperQ.SuperQ<string> queue;

        static void Main(string[] args)
        {
            queue = SuperQ.SuperQ<string>.GetQueue("MyQueue");
            queue.StartReceiving(MessageReceived);

            bool running = true;
            while (running)
            {
                var key = Console.ReadKey(true);
                if (key.Key == ConsoleKey.Enter)
                    running = false;
                else if (key.Key == ConsoleKey.P)
                {
                    Console.WriteLine("Message Pushed");
                    queue.PushMessage(new QueueMessage<string>("P was pressed in message form"));
                }
                else if (key.Key == ConsoleKey.G)
                {
                    var message = queue.GetMessage();
                    if (message != null)
                        Console.WriteLine("Message: " + message.Payload);
                    else
                        Console.WriteLine("No Message Received...");
                }
                else if (key.Key == ConsoleKey.L)
                {
                    Console.WriteLine("Payload Pushed");
                    queue.PushMessage("P was pressed in Payload form");
                }
                else if (key.Key == ConsoleKey.V)
                {
                    var payload = queue.GetPayload();
                    if (payload != null)
                        Console.WriteLine("Payload: " + payload);
                    else
                        Console.WriteLine("No Payload Received...");
                }

            }

            queue.StopReceiving();
        }

        static void MessageReceived(QueueMessage<string> message)
        {
            Console.WriteLine("Message Received: " + message.Payload);
            queue.DeleteMessage(message);
        }
    }
