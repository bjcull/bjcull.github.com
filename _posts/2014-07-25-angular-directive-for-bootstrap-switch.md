---
title: Angular Directive for Bootstrap-Switch
date: 2014-07-25
layout: post
published: true
---

Have you seen the [Bootstrap Switch](http://www.bootstrap-switch.org)? If not, check it out:

<div>
    <input id="sweetCheckbox" type="checkbox" />

    <link href="/wp-content/uploads/2014/07/bootstrap-switch.min.css" rel="Stylesheet" type="text/css" />
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="/wp-content/uploads/2014/07/bootstrap-switch.min.js"></script>

    <script>
        $("#sweetCheckbox").bootstrapSwitch();
    </script>
</div>

Awesome!

## Angular Directive

Once you've added bootstrap-switch to your project, simply add this directive to your `app.js` or controller.

<script src="https://gist.github.com/bjcull/8ff8611f5b39978e5134.js"></script>


**Usage**

    <input type="checkbox" ng-model="mymodel.mystate" bootstrap-switch />

**WARNING** I can't stress this enough:

> "Always use a dot in your ng-model"
> - A war-torn, battle-scarred, mentally-exhausted person who didn't do exactly this

Scoping and binding are *potentially* screwed if you don't. It is a difficult problem to find and understand.

Further reading is required:
[https://github.com/angular/angular.js/wiki/Understanding-Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes)

[http://stackoverflow.com/questions/17178943/does-my-ng-model-really-need-to-have-a-dot-to-avoid-child-scope-problems](http://stackoverflow.com/questions/17178943/does-my-ng-model-really-need-to-have-a-dot-to-avoid-child-scope-problems)

[http://stackoverflow.com/questions/18128323/angularjs-if-you-are-not-using-a-dot-in-your-models-you-are-doing-it-wrong](http://stackoverflow.com/questions/18128323/angularjs-if-you-are-not-using-a-dot-in-your-models-you-are-doing-it-wrong)

