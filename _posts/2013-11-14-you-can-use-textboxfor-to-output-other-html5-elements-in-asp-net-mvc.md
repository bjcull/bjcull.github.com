---
published: false
---

You can use TextBoxFor to output other HTML5 elements in ASP.NET MVC

I needed to use a `<input type="range">` the other day. I thought of creating a new HTML helper to output the range input, but then I a much simpler solution was pointed out to me.

You'll get:
 - Model binding
 - Validation Attributes
 - Unobtrusive validation

By simply using:
    @Html.TextBoxFor(m => m.MyProperty, new { @type = "range" });
    
Easy.