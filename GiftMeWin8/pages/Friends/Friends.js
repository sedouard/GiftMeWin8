// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
/// <reference path="..\..\scripts\giftme\GiftMeClientLibrary.ts" />
/// <reference path="..\..\scripts\typings\winjs\winjs.d.ts" />
var g_Client;
var g_Friends;
(function () {
    "use strict";

    // Create a namespace to make the data publicly
    // accessible.
    var list = [];
    var friendsList = new WinJS.Binding.List();
    var publicMembers = {
        itemList: friendsList
    };

    WinJS.Namespace.define("Friends", publicMembers);

    WinJS.UI.Pages.define("/pages/Friends/Friends.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        init: function (element, options) {
            var ui = WinJS.UI;

            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
        },
        ready: function (element, options) {
            showProgressRing(false);

            // TODO: Initialize the page here.
            g_Client = new GiftMeClientLibrary(options);
            $("#ui_SearchButton").click(function (object) {
                showProgressRing(true);
                if ($("#ui_SearchTextBox").text() == "Search Friends") {
                    return;
                }

                if ($("#ui_SearchTextBox").val() != "" && $("#ui_SearchTextBox").val().length >= 3) {
                    g_Client.searchFriends($("#ui_SearchTextBox").val(), function (suceeded, results) {
                        showProgressRing(false);
                        if (!suceeded) {
                            console.log("search friends failed");
                            return;
                        }

                        friendsList.forEach(function (item) {
                            friendsList.pop();
                        });
                        g_Friends = results;
                        g_Friends.forEach(function (item) {
                            if (item.Birthday == null) {
                                item.Birthday = "";
                            }
                            if (item.Birthday == null) {
                                item.Birthday = "";
                            }
                            friendsList.push(item);
                        });
                        console.log("search friends suceeded");
                    });
                } else {
                    g_Client.getFriends(function (suceeded, results) {
                        showProgressRing(false);
                        if (!suceeded) {
                            console.log("search friends failed");
                            return;
                        }

                        friendsList.forEach(function (item) {
                            friendsList.pop();
                        });
                        g_Friends = results;
                        g_Friends.forEach(function (item) {
                            if (item.Birthday == null) {
                                item.Birthday = "";
                            }
                            if (item.Birthday == null) {
                                item.Birthday = "";
                            }
                            friendsList.push(item);
                        });
                        console.log("search friends suceeded");
                    });
                }
            });

            if (g_Friends == undefined) {
                showProgressRing(true);
                g_Client.getFriends(function (suceeded, friends) {
                    if (suceeded) {
                        showProgressRing(false);
                        g_Friends = friends;
                        friendsList.forEach(function (item) {
                            friendsList.pop();
                        });
                        g_Friends.forEach(function (item) {
                            if (item.Birthday == null) {
                                item.Birthday = "";
                            }
                            friendsList.push(item);
                        });
                        var ui = WinJS.UI;
                        var p = ui.processAll().then(function () {
                            console.log("loaded all friends");
                        });
                    }
                });
            }
        },
        _itemInvoked: function (args) {
            //Get the selected friend and navigate to their suggestions page
            var friend = g_Friends[args.detail.itemIndex];
            var passedArgs = { friend: friend, client: g_Client };
            WinJS.Navigation.navigate("/pages/items/items.html", passedArgs);
        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: Respond to changes in layout.
        }
    });

    function showProgressRing(show) {
        if (show) {
            $("#ui_ProgressRing").show();
        } else {
            $("#ui_ProgressRing").hide();
        }
    }
})();
