---
title: Credit Card Validator Attribute for ASP.NET MVC 3
date: 2010-11-04
layout: post
categories:
- &o0 .NET
- &o1 MVC
tags:
- *o0
- Attribute
- *o1
- Validator
---

<a href="/wp-content/uploads/2010/11/credit-cards.jpg"><img class="size-medium wp-image-116 alignright" title="It's not what your credit card company can do for you. It's what you can do for your credit card company." src="/wp-content/uploads/2010/11/credit-cards-300x200.jpg" alt="Pile of credit cards" width="300" height="200" /></a>

Quickly and simply validate your credit card fields by adding this attribute to your POCO model class.
<h2>What do I need to do?</h2>
<ol>
	<li>Start by downloading the <a title="Super Amazing Credit Card Validator Attribute Class" href="https://gist.github.com/662078" target="_blank">CreditCardAttribute class</a> and including it in your project somewhere. (Code shown below)</li>
	<li>Decorate your data model with the attribute like so:</li>
</ol>
<pre class="prettyprint")]
        public string CreditCardNumber { get; set; }
</pre>
You're Done! If you would like to know a little more, read on, but that's enough to get you going.
<h2>But what about card types?</h2>
You can specify which cards you would like to accept using the AcceptedCardTypes named parameter. Do it like so:
<pre class="prettyprint",
            AcceptedCardTypes=CreditCardAttribute.CardType.Visa | CreditCardAttribute.CardType.MasterCard)]
        public string CreditCardNumber { get; set; }
</pre>
You can use as many or as little of the card types as you like, making sure to use the bitwise OR '|' operator to seprate them.
<h2>I'm interested in how you've created this validator. Can you breakdown the code?</h2>
Yes. Yes I can. But first the code.

<pre class="prettyprint">
    /// ASP.NET MVC 3 Credit Card Validator Attribute
    /// by Ben Cull - 4 November 2010
    ///
    /// With special thanks to:
    /// Thomas @ Orb of Knowledge - http://orb-of-knowledge.blogspot.com/2009/08/extremely-fast-luhn-function-for-c.html
    /// For the Extremely fast Luhn algorithm implementation
    ///
    /// And Paul Ingles - http://www.codeproject.com/KB/validation/creditcardvalidator.aspx
    /// For a timeless blog post on credit card validation

    public class CreditCardAttribute : ValidationAttribute
    {
        private CardType _cardTypes;
        public CardType AcceptedCardTypes
        {
            get { return _cardTypes; }
            set { _cardTypes = value; }
        }

        public CreditCardAttribute()
        {
            _cardTypes = CardType.All;
        }

        public CreditCardAttribute(CardType AcceptedCardTypes)
        {
            _cardTypes = AcceptedCardTypes;
        }

        public override bool IsValid(object value)
        {
            var number = Convert.ToString(value);

            if (String.IsNullOrEmpty(number))
                return true;

            return IsValidType(number, _cardTypes) && IsValidNumber(number);
        }

        public override string FormatErrorMessage(string name)
        {
            return "The " + name + " field contains an invalid credit card number.";
        }

        public enum CardType
        {
            Unknown = 1,
            Visa = 2,
            MasterCard = 4,
            Amex = 8,
            Diners = 16,

            All = CardType.Visa | CardType.MasterCard | CardType.Amex | CardType.Diners,
            AllOrUnknown = CardType.Unknown | CardType.Visa | CardType.MasterCard | CardType.Amex | CardType.Diners
        }

        private bool IsValidType(string cardNumber, CardType cardType)
        {
            // Visa
            if (Regex.IsMatch(cardNumber, "^(4)")
                && ((cardType & CardType.Visa) != 0))
                return cardNumber.Length == 13 || cardNumber.Length == 16;

            // MasterCard
            if (Regex.IsMatch(cardNumber, "^(51|52|53|54|55)")
                && ((cardType & CardType.MasterCard) != 0))
                return cardNumber.Length == 16;

            // Amex
            if (Regex.IsMatch(cardNumber, "^(34|37)")
                && ((cardType & CardType.Amex) != 0))
                return cardNumber.Length == 15;

            // Diners
            if (Regex.IsMatch(cardNumber, "^(300|301|302|303|304|305|36|38)")
                && ((cardType & CardType.Diners) != 0))
                return cardNumber.Length == 14;

            //Unknown
            if ((cardType & CardType.Unknown) != 0)
                return true;

            return false;
        }

        private bool IsValidNumber(string number)
        {
            int[] DELTAS = new int[] { 0, 1, 2, 3, 4, -4, -3, -2, -1, 0 };
            int checksum = 0;
            char[] chars = number.ToCharArray();
            for (int i = chars.Length - 1; i > -1; i--)
            {
                int j = ((int)chars[i]) - 48;
                checksum += j;
                if (((i - chars.Length) % 2) == 0)
                    checksum += DELTAS[j];
            }

            return ((checksum % 10) == 0);
        }
    }
</pre>

The first thing to notice is that I have inherited from the ValidationAttribute. This takes care of most the work, allowing me to quickly and easily implement the actual validation. ValidationAttribute is just the default, you can also inherit from other classes within the System.ComponentModel.DataAnnotations namespace. The most useful of which is the RegularExpressionAttribute. Check it out, a simple currency validator:
<pre class="prettyprint">    public class CurrencyAttribute : RegularExpressionAttribute
    {
        public CurrencyAttribute() : base("^\\$?(\\d{1,3},?(\\d{3},?)*\\d{3}(\\.\\d{1,3})?|\\d{1,3}(\\.\\d{2})?)$")
        {
        }
    }
</pre>
That's all you need to do to implement your own regular expression based validator.

Back to our Credit Card Validator, we'll take a look at the only manditory method for creating a custom validator, the IsValid method.
<pre class="prettyprint">        public override bool IsValid(object value)
        {
            var number = Convert.ToString(value);

            return IsValidType(number, _cardTypes) &amp;&amp; IsValidNumber(number);
        }
</pre>
Its very simple, you get the value to validate as an object and you must return a boolean showing whether or not it passed validation. The rest of the methods in the credit card validator are helpers to decide if the card is valid, and an enum to represent card types.