---
title: Credit Card Validator Attribute for ASP.NET MVC 3
date: 2010-11-04
layout: post
categories:
- .NET
- MVC
tags:
- Attribute
- Validator
published: true
---

![Pile of credit cards](/wp-content/uploads/2010/11/credit-cards-300x200.jpg "It")

Quickly and simply validate your credit card fields by adding this attribute to your POCO model class.

## What do I need to do? ##

1. Start by downloading the [CreditCardAttribute class](https://gist.github.com/662078 "Super Amazing Credit Card Validator Attribute Class") and including it in your project somewhere. (Code shown below)

2. Decorate your data model with the attribute like so:

    [CreditCard]
    public string CreditCardNumber { get; set; }

You're Done! If you would like to know a little more, read on, but that's enough to get you going.

 ## But what about card types? ##

You can specify which cards you would like to accept using the AcceptedCardTypes named parameter. Do it like so:

    [CreditCard(AcceptedCardTypes=CreditCardAttribute.CardType.Visa | CreditCardAttribute.CardType.MasterCard)]
    public string CreditCardNumber { get; set; }

You can use as many or as little of the card types as you like, making sure to use the bitwise OR '|' operator to separate them.

##I'm interested in how you've created this validator. Can you breakdown the code? ##

Yes. Yes I can. But first the code.

<script src="https://gist.github.com/662078.js"></script>

The first thing to notice is that I have inherited from the ValidationAttribute. This takes care of most the work, allowing me to quickly and easily implement the actual validation. `ValidationAttribute` is just the default, you can also inherit from other classes within the `System.ComponentModel.DataAnnotations` namespace. The most useful of which is the `RegularExpressionAttribute`. Check it out, a simple currency validator:

    public class CurrencyAttribute : RegularExpressionAttribute
    {
        public CurrencyAttribute() : base("^\\$?(\\d{1,3},?(\\d{3},?)*\\d{3}(\\.\\d{1,3})?|\\d{1,3}(\\.\\d{2})?)$")
        {
        }
    }

That's all you need to do to implement your own regular expression based validator.

Back to our Credit Card Validator, we'll take a look at the only manditory method for creating a custom validator, the IsValid method.

    public override bool IsValid(object value)
    {
        var number = Convert.ToString(value);        
        return IsValidType(number, _cardTypes) && IsValidNumber(number);
    }

Its very simple, you get the value to validate as an object and you must return a boolean showing whether or not it passed validation. The rest of the methods in the credit card validator are helpers to decide if the card is valid, and an enum to represent card types.