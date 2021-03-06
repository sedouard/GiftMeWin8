﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
/// <reference path="..\..\js\winrt.d.ts" />
/// <reference path="..\..\scripts\typings\winjs\winjs.d.ts" />
/// <reference path="..\..\scripts\typings\jquery\jquery.d.ts" />
/// <reference path="..\..\js\lib.d.ts" />
var g_giftMeBaseUri = "http://giftmeapp.cloudapp.net";

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/login/Login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var fontSize = "800";
            if ((element.clientWidth == 1440 && element.clientHeight == 1080) || (element.clientWidth == 1024 && element.clientHeight == 768)) {
                fontSize = "800";
            } else if ((element.clientWidth == 1920 && element.clientHeight == 1200) || (element.clientWidth == 1366 && element.clientHeight == 768) || (element.clientWidth == 1280 && element.clientHeight == 800)) {
                fontSize = "1000";
            } else if ((element.clientWidth == 1920 && element.clientHeight == 1080)) {
                fontSize = "1400";
            } else if ((element.clientWidth == 1280 && element.clientHeight == 800)) {
                fontSize = "1650";
            }
            $("#ui_GiftMeBanner").attr("style", "font-size:" + fontSize + "%");
            $("#ui_FacebookIcon").click(function (evt) {
                GiftMeFacebookAuthenticate.onCompleted = function (suceeded, authToken) {
                    WinJS.Navigation.navigate("/pages/friends/friends.html", authToken);
                };
                GiftMeFacebookAuthenticate.launchFacebookWebAuth();
            });
        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            //GiftMe banner words needs different font size for different screen sizes
            // TODO: Respond to changes in layout.
        }
    });
})();

var GiftMeFacebookAuthenticate = (function () {
    function GiftMeFacebookAuthenticate() {
    }
    GiftMeFacebookAuthenticate.callbackFacebookWebAuth = function (result) {
        var url = result.responseData;
        var querystring = {};
        var accessTokPatter = new RegExp("#access_token=.*=");
        var results = accessTokPatter.exec(url);

        if (results.length <= 0) {
            return;
        }

        results[0] = results[0].replace("#access_token", "");
        results[0] = results[0].replace("=", "");

        var shortLivedToken = results[0];

        //Get the user id from facebook book
        $.ajax({
            type: "GET",
            url: "https://graph.facebook.com/me?access_token=" + shortLivedToken,
            data: "",
            cache: false,
            success: function (response) {
                //Now authenticate into giftme
                var id = response.id;
                $.post(g_giftMeBaseUri + '/api/authentication/authenticate', { FacebookId: id, AccessToken: shortLivedToken }, function (resp) {
                    if (resp.SessionToken) {
                        console.log("GiftMe authentication suceeded");
                        GiftMeFacebookAuthenticate.onCompleted(true, resp.SessionToken);
                    } else {
                        console.log("GiftMe authentication failed, no session token provided");
                        GiftMeFacebookAuthenticate.onCompleted(false, null);
                    }
                });
            },
            failure: function (response) {
                //TODO: Add some ui to show that the gift me auth failed
            }
        });
        var response = "Status returned by WebAuth broker: " + result.responseStatus + "\r\n";
        if (result.responseStatus == 2) {
            response += "Error returned: " + result.responseErrorDetail + "\r\n";
        }
    };

    GiftMeFacebookAuthenticate.callbackFacebookWebAuthError = function (err) {
        var error = "Error returned by WebAuth broker. Error Number: " + err.number + " Error Message: " + err.message + "\r\n";
    };

    GiftMeFacebookAuthenticate.launchFacebookWebAuth = function () {
        var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
        var callbackURL = "https://www.facebook.com/connect/login_success.html";
        var scope = 'user_birthday, friends_birthday' + ', user_interests, friends_interests' + ', user_likes, friends_likes' + ', user_relationships, friends_relationships' + ', user_relationship_details, friends_relationship_details' + ', email, user_friends, friends_location';

        var clientID = "175469245988036";
        facebookURL += clientID + "&scope=publish_stream,publish_checkins,publish_actions,share_item&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=" + scope + "&display=popup&response_type=token";

        var startURI = new Windows.Foundation.Uri(facebookURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        try  {
            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.default, startURI, endURI).then(GiftMeFacebookAuthenticate.callbackFacebookWebAuth, GiftMeFacebookAuthenticate.callbackFacebookWebAuthError);
        } catch (err) {
            console.log(err.message);
            return;
        }
    };
    GiftMeFacebookAuthenticate.s_facebookAppID = "175469245988036";
    return GiftMeFacebookAuthenticate;
})();
