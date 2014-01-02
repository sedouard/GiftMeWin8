/// <reference path="..\..\scripts\giftme\GiftMeClientLibrary.ts" />
/// <reference path="..\..\scripts\typings\winjs\winjs.d.ts" />
/// <reference path="..\..\pages\friends\friends.ts"/>
var g_Client;
var g_Friend;
var g_GiftSuggestions;
(function () {
    "use strict";

    var ui = WinJS.UI;

    // Create a namespace to make the data publicly
    // accessible.
    var list = [];
    var suggestionsList = new WinJS.Binding.List();
    var publicMembers = {
        itemList: suggestionsList
    };

    //Define the list datasource
    WinJS.Namespace.define("GiftSuggestions", publicMembers);

    ui.Pages.define("/pages/items/items.html", {
        // This function is called to initialize the page.
        init: function (element, options) {
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
        },
        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            showProgressRing(true);
            $("#friendNotAvailable").text("");
            g_Client = options.client;
            g_Friend = options.friend;

            //set the friend image
            $("#ui_FriendImage").attr("style", "background-image:url('" + g_Friend.ProfilePicUrl + "')");

            //set the friend image
            //set their name
            console.log("setting name to " + g_Friend.Name);
            $("#ui_Name").text(g_Friend.Name);

            if (g_Friend.Birthday != null && g_Friend.Birthday != "") {
                $("#ui_Field1").text("Born on: " + g_Friend.Birthday);
            }

            $("#ui_GiftItem").click(function () {
                console.log("woop");
            });

            g_Client.getSuggestions(g_Friend, function (suceeded, results) {
                showProgressRing(false);
                if (!suceeded) {
                    $("#friendNotAvailable").text(":( Oops " + g_Friend.FirstName + "'s info is under wraps");
                    console.log("Couldn't load gift suggestions");
                    return;
                }

                if (results.length == 0) {
                    $("#friendNotAvailable").text(":( Oops " + g_Friend.FirstName + "'s info is under wraps");
                } else {
                    $("#friendNotAvailable").text("");
                }

                g_GiftSuggestions = results;

                $("ui_ItemsPageTitle").val(g_Friend.Name);
                publicMembers.itemList.forEach(function (value, index, array) {
                    publicMembers.itemList.pop();
                });
                results.forEach(function (value, index, array) {
                    publicMembers.itemList.push(value);
                });
            });
        },
        // This function updates the page layout in response to layout changes.
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        },
        _itemInvoked: function (args) {
            //Get the selected friend and navigate to their suggestions page
            var suggestion = g_GiftSuggestions[args.detail.itemIndex];
            var uri = new Windows.Foundation.Uri(suggestion.ProductUrl);
            Windows.System.Launcher.launchUriAsync(uri).done(function (success) {
                if (success) {
                    console.log("page opened correctly");
                } else {
                    console.log("an error has occured");
                }
            });
        }
    });
})();

function showProgressRing(show) {
    if (show) {
        $("#ui_ProgRing").show();
    } else {
        $("#ui_ProgRing").hide();
    }
}
