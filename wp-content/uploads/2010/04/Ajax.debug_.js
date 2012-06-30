
function Ajax() {

    this.CallWebServiceWithGET = function (WebService, GetData, ShowLoading, LoaderText, SuccessCallBack, ErrorCallback) {

        if (ShowLoading)
            ShowLoader(LoaderText);

        if (WebService == "")
            return 1; // Incorrect Parameters

        if (ErrorCallback == null)
            ErrorCallback = Ajax.DefaultErrorCallBack;

        if (typeof (GetData) === "object")
            GetData = $.param(GetData);
        
        $.ajax({
            type: "GET",
            url: WebService,
            data: GetData,
            success: SuccessCallBack,
            error: ErrorCallback
        });

        return 0; // Successful    
    }

    this.CallWebServiceWithJSON = function (WebService, JsonData, ShowLoading, LoaderText, SuccessCallBack, ErrorCallback) {

        if (ShowLoading)
            ShowLoader(LoaderText);

        if (WebService == "")
            return 1; // Incorrect Parameters

        if (ErrorCallback == null)
            ErrorCallback = Ajax.DefaultErrorCallBack;

        if (typeof(JsonData) === "object")
            JsonData = JSON.stringify(JsonData);
            
        $.ajax({
            type: "POST",
            url: WebService,
            data: JsonData,
            contentType: "application/json; charset=utf-8",
            success: SuccessCallBack,
            error: ErrorCallback
        });

        return 0; // Successful
    };

    function ShowLoader(LoaderText) {
        var loadingText = "Loading...";
        if (LoaderText != null && LoaderText != "") {
            loadingText = LoaderText;
        }

        $("#divLoader").text(loadingText);
        $("#divLoader").fadeIn("fast");    
    }

    this.DefaultErrorCallBack = function (XMLHttpRequest, textStatus, errorThrown) {
        var response = eval("(" + XMLHttpRequest.responseText + ")");
        var output = "Message: " + response.Message + "\n\n";
        output += "StackTrace: " + response.StackTrace;
        alert(output);
    }


    $(document).ready(function () {

        $("#divLoader").ajaxStop(function () {
            $(this).stop(true, true).fadeOut("fast");
        });

    });
    
};

Ajax = new Ajax();