---
title: How to Send Email using .NET Core
date: 2017-02-13
layout: post
published: true
---

The new .NET Core doesn't support SMTP yet but there's a better way! Fluent Email let's you send emails with razor templates, has integrations with third party mail senders like Mailgun, and even supports SMTP for .NET 4.6.

If you're keen to jump straight in, you can grab the **Razor** and **Mailgun** packages here:

[`PM> Install-Package FluentEmail.Razor`](https://www.nuget.org/packages/FluentEmail.Razor)  
[`PM> Install-Package FluentEmail.Mailgun`](https://www.nuget.org/packages/FluentEmail.Mailgun)


## Usage

At it's most basic, here's how you use Fluent Email.

    var email = Email
        .From("john@email.com")
        .To("bob@email.com", "bob")
        .Subject("hows it going bob")
        .Body("yo dawg, sup?");

    await email.SendAsync();

## Using Razor Templates

Things start to get interesting when you add Razor Template support. This let's you very easily send emails from your application, without needing to handcraft each one. Take a look at this basic example:

    // Using Razor templating package
    Email.DefaultRenderer = new RazorRenderer();

    var template = "Dear @Model.Name, You are totally @Model.Compliment.";

    var email = Email
        .From("bob@hotmail.com")
        .To("somedude@gmail.com")
        .Subject("woo nuget")
        .UsingTemplate(template, new { Name = "Luke", Compliment = "Awesome" });

Firstly, we let Fluent Email know which renderer to use (you can even implement your own!). Next we provide a template, and lastly we provide a model so the template can be filled in.

## Embedding Templates as cshtml files

More than likely, your razor templates will be big cshtml files containing complex html and css. Ideally this will be a file in your solution that has been embedded into your assembly. Let's take a look at how to do that.

Firstly, you can embed any file into your assembly by adding the following to your project.json:  

    "buildOptions": {
        "embed": {
            "include": [
                "emails/*.cshtml"
            ]
        },
    }

In this case we're embedding any cshtml files it can find in the emails folder.

Next, you can easily use Fluent Email to send your email like so:

    var email = Email
        .From(fromEmail)
        .To(toEmail)
        .Subject(subject)
        .UsingTemplateFromEmbedded("My.Assembly.test-embedded.cshtml", new { Name = "Ben" }, 
            this.GetType().GetTypeInfo().Assembly);

The first parameter is the assembly name plus the filename together. Next we supply the model, and finally we let it know which assembly to look in (the current one).

## Using a template on disk

Much the same, but this time we supply the path on disk to the template.

    var email = Email
        .From(fromEmail)
        .To(toEmail)
        .Subject(subject)
        .UsingTemplateFromFile($"{Directory.GetCurrentDirectory()}/Test.cshtml", new { Name = "Ben" });

## Sending email using Mailgun

Rather than sending email via the sometimes troublesome SMTP protocol, I use MailGun. It's a fantastic service with a very generous free tier (10,000 email/month). It makes use of a REST API to manage the sending and receiving of emails, but you don't have to worry about that, Fluent Email has you covered.

To start using Mailgun, install the appropriate Nuget Package:

[`PM> Install-Package FluentEmail.Mailgun`](https://www.nuget.org/packages/FluentEmail.Mailgun)

Next, configure fluent email during your application startup:

    var sender = new MailgunSender(
        "sandboxcf5f41bbf2f84f15a386c60e253b5fe8.mailgun.org", // Mailgun Domain
        "key-8d32c046d7f14ada8d5ba8253e3e30df" // Mailgun API Key
    );
    Email.DefaultSender = sender;

and that's it. You send email the exact same way you were before:

    var email = Email
        .From(fromEmail)
        .To(toEmail)
        .Subject(subject)
        .Body(body);

    var response = await email.SendAsync();

## Help Fluent Email become even better!

You can check out [all the source code on Github](https://github.com/lukencode/FluentEmail), but if you're interested, there are two interfaces for extending Fluent Email.

 - `ITemplateRenderer` - If you want to implement another method of parsing templates or generating HTML.
 - `ISender` - If you want to implement another way of sending the final email. (Sendgrid anyone?)

There are many improvements that can be made to this already super useful library. If you want to help out, just let [Luke Lowrey](https://twitter.com/lukencode) or [myself](https://twitter.com/BenWhoLikesBeer) know.

Happy Sending!
