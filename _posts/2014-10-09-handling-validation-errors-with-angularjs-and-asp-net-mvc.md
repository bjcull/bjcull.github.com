---
title: Handling Validation Errors with AngularJS and ASP.NET MVC
date: 2014-10-09
layout: post
published: true
---

## The Problem

One of the first things you'll notice doesn't work very well when you integrate AngularJS and ASP.NET MVC is forms validation.

We used to have it so good with unobtrusive validation, things *just worked*. Now we need to get used to a new validation system, as well as tie our existing server side in. 

Typically we'd have two types of validation messages to show. A global validation message for things we don't expect or aren't related to any one piece of the page. Eg "An unexpected error occurred" or "Cannot reach the database", etc...

The other type of validation is of course forms validation, whereby each field has it's own validation message.

In an effort to reuse as much existing code as I could, I've come up with the following solution.

## The Solution

Serialize some of the `ModelState` to capture validation errors and always use my error handling nuget package:
[SSW.ErrorHandler](https://www.nuget.org/packages/SSW.ErrorHandler/1.1.0)

First up, lets look at an example of this in action. Here is a basic controller for saving a dog:

    public ActionResult Save(EditVM model)
    {
        if (!_dogLogic.AcceptableName(model.Name))
        {
            ModelState.AddModelError(string.Empty, "That is not a suitable name for a dog, please choose a new one.");
        }

        if (!ModelState.IsValid)
        {
            return JsonFormResponse();
        }

        // Perform Success Actions
        var dog = _dogLogic.Save(model);

        return JsonFormResponse();
        
        // You can also do the following if you want to return actual data
        // return Json(dog.Id);
    }

Here we do three things. First we run the model through any custom validation we have. You should always run all validation over your model before returning to the user to ensure they can fix all errors in one go.

Next we check if there are any validation errors using `ModelState.IsValid`. This will catch any errors from attributes on our model, as well as the custom validation we just performed.

Lastly, if there were no errors, we perform the success logic.

What's this `JsonFormResponse` you ask? Let's dig in:

    protected ActionResult JsonFormResponse(JsonRequestBehavior jsonRequestBehaviour = JsonRequestBehavior.DenyGet)
    {
        if (ModelState.IsValid)
        {
            return new HttpStatusCodeResult(200);
        }

        var errorList = new List<JsonValidationError>();
        foreach (var key in ModelState.Keys)
        {
            ModelState modelState = null;
            if (ModelState.TryGetValue(key, out modelState))
            {
                foreach (var error in modelState.Errors)
                {
                    errorList.Add(new JsonValidationError()
                    {
                        Key = key,
                        Message = error.ErrorMessage
                    });
                }
            }
        }

        var response = new JsonResponse()
        {
            Type = "Validation",
            Message = "",
            Errors = errorList
        };
            
        Response.StatusCode = 400;
        return Json(response, jsonRequestBehaviour);
    }

The classes referenced above:

    public class JsonResponse
    {
        public string Type { get; set; }
        public string Message { get; set; }
        public IEnumerable<JsonValidationError> Errors { get; set; }

        public JsonResponse()
        {
            Errors = new List<JsonValidationError>();
        }
    }

    public class JsonValidationError
    {
        public string Key { get; set; }
        public string Message { get; set; }
    }

Added to my `BaseController`, the class from which all my other controllers inherit, is the JsonFormResponse method. This method returns a nice (200 OK) response if there are no errors. If there are errors, it breaks down the ModelState and serialises them into a nice standardised reponse. For Example, if the Name property of our EditVM model from above was missing, we could expect to see the following response:

    {
        Type: "Validation",
        Message: "",
        Errors: [
            {
                Key: "Name",
                Message: "The field Name is required."
            },
            {
                Key: "",
                Message: "That is not a suitable name for a dog, please choose a new one."
            }
        ]
    }

Remember that we always return all errors, so when the name is missing, it also fails the AcceptableName logic test.

So what do you do with this JSON response? Well lets take a look at my error handler in my Angular controller:

    $http.post("/Dog/Save/" + dog.DogId, postData).success(function() {
        // Add your success stuff here
    }).error(function(data, status, headers, config) {
        handleErrors(data);
    });
    
    function updateErrors(errors) {
        $scope.errors.formErrors = {};
        $scope.errors.pageError = "";

        if (errors) {
            for (var i = 0; i < errors.length; i++) {
                $scope.errors.formErrors[errors[i].Key] = errors[i].Message;
            }
        }
    }

    $scope.handleErrors = function (data) {
        if (data.Errors) {
            updateErrors(data.Errors);
        } else if (data.message) {
            $scope.errors.pageError = data.message;
        } else if (data) {
            $scope.errors.pageError = data;
        } else {
            $scope.errors.pageError = "An unexpected error has occurred, please try again later.";
        }
    };

At the top is the http call to the server. Next is the updateErrors function that spins through our JsonFormResponse JSON data to assign the errors to the appropriate properties. Finally we have the handleErrors method. This method determines which error system the response came from, starting with our JsonFormResponse, followed by the SSW.ErrorHandler package. After that it just checks to see if the response has anything and binds it to our message, and lastly if there is no data in the response it returns a generic error message.

Last but not least we turn to the client side and put up our two types of validation messages. Firstly the field validation:

    <input type="text" ng-model="dog.Name" />
    <span class="help-block" ng-if="errors.formErrors.Name">{% raw %}{{errors.formErrors.Name}}{% endraw %}</span>

and at the bottom the global validation:

    <div class="alert alert-danger" ng-if="errors.pageError">
        <p>{% raw %}{{errors.pageError}}{% endraw %}</p>
    </div>

Right all done. I know it's a fair bit of work at the moment, but I'm sure the great minds at Microsoft are already looking at how to facilitate a new Angular Unobtrusive validation. Until then we'll make do with our own custom Angular + MVC validation combo!
