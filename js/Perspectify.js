// This code perpectifies the page when you reach the end of a post and displays the twitter plugin stuff

$(function () {
    var perspectified = false;

    $("#tweetFooter").css({ "margin-bottom": $(window).height() / 2 });
    var initialPostBottom = $("#tweetFooter").height() + $("#tweetFooter").offset().top;

    $(window).scroll(function () {
        var midscreen = $(window).height() / 2;
        var scrolltop = $(window).scrollTop();

        if (scrolltop > (initialPostBottom - midscreen) && !perspectified) {
            Perspectify();
        }
        else if (scrolltop <= (initialPostBottom - midscreen) && perspectified) {
            Unperspectify();
        }
    });

    $(".currentPostComments").click(function () {
        if (perspectified) {
            Unperspectify();
        }
        else {
            Perspectify();
        }
    });

    function Perspectify() {
        $(".currentPostComments").addClass("active");
        perspectified = true;

        var postHeight = $("#post").height();

        $("#post").transition({
            perspective: '800',
            rotateX: '45deg',
            scale: 0.5
            //y: (postHeight / 2)
        }, 400, 'in-out');

        $("#tweetBoxWrapper").css({
            left: ($(window).width() / 2) - ($("#tweetBoxWrapper").width() / 2),
            //top: ($(window).height() / 2) - ($("#tweetBoxWrapper").height() / 2),
            top: 0,
            transformOrigin: '50% 0',
            perspective: '800',
            rotate3d: '1, 0, 0, 90deg',
            display: 'block'
        });

        $("#tweetBoxWrapper").transition({
            perspective: '800',
            rotate3d: '1, 0, 0, 0deg',
            //delay:250
        }, 400, "out");

        $("#tweet-box").focus();
    };

    function Unperspectify() {
        $(".currentPostComments").removeClass("active");
        perspectified = false;

        $("#tweetBoxWrapper").transition({
            perspective: '800',
            rotate3d: '1, 0, 0, 90deg'
        }, 400, "out");

        $("#post").transition({
            perspective: '800',
            rotateX: '0deg',
            scale: 1
            //delay:250,
            //y: 0
        }, 400, 'in-out');
    };

    $("#tweetBox").jTweetsAnywhere(GetjTweetsOptions());

    function GetjTweetsOptions() {
        var options = {
            count: 20,
            showTweetBox: {
                counter: true,
                height: 100,
                label: "Don't Comment, Tweet!",
                defaultContent: "via @benjii22"
            },
            showTweetFeed: {
                showProfileImages: true,
                showUserScreenNames: true,
                paging: {
                    mode: "endless-scroll"
                }
            },
            noDataDecorator: function () { return "<strong>There aren't any tweets!</strong> <span>Be the first to start the conversation below.<span>"; }
        };

        if (window.location.href == "http://benjii.me") {
            options.username = "benjii22";
        }
        else {
            options.searchParams = "q=" + window.location.href;
        }

        return options;
    };
});