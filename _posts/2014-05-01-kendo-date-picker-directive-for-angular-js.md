---
title: Kendo Date Picker Directive for AngularJS
date: 2014-05-01
layout: post
published: true
---

Who says that Angular doesn't play nicely with other tools and frameworks. 

Here's a directive that will automatically add a Kendo Date Picker to any text box with the attribute `kendo-date-picker`.

## 'kendoDatePicker' Directive

    .directive('kendoDatePicker', function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (!element.data('kendoDatePicker')) {
                    element.kendoDatePicker();
                }
            }
        };
    });

Attach this directive to one of your modules. Mine is attached to my app module so it is available globally.

## Example Usage

    <input type="text" kendo-date-picker />

## Quick Directive Explanation

Directives are the perfect place to manipulate the DOM. In this case, when angular detects the directive as an attribute, 
it runs our custom linking code to enable the Kendo Date Picker.

The `restrict: 'A'` means look for our directive as an attribute.

The `link: function(scope, element, attrs)` gives us the local scope of the directive, the element itself, and any attributes on that element.
  

Want to write your own simple directive? Take a look at these:

- [AngularJS Directives Tutorial](http://www.befundoo.com/university/tutorials/angularjs-directives-tutorial/)
- [Creating Custom Directives](https://docs.angularjs.org/guide/directive)

