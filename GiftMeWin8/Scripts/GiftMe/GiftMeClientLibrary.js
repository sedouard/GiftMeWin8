/// <reference path="..\typings\jquery\jquery.d.ts" />
var GiftMeClientLibrary = (function () {
    function GiftMeClientLibrary(sessionToken) {
        this.sessionToken = sessionToken;
        this.m_GiftMeRootUrl = "http://giftmeapp.cloudapp.net/api";
    }
    GiftMeClientLibrary.prototype.getFriends = function (onCompleted) {
        $.ajax({
            type: "GET",
            url: this.m_GiftMeRootUrl + "/friends/friends?sessionToken=" + this.sessionToken + "&pictureType=large&limit=60",
            data: "",
            cache: false,
            success: function (response) {
                //Now authenticate into giftme
                onCompleted(true, response);
            },
            error: function (response) {
                //TODO: Add some ui to show that the gift me auth failed
                onCompleted(false, null);
            }
        });
    };
    GiftMeClientLibrary.prototype.getSuggestions = function (friend, onCompleted) {
        $.ajax({
            type: "GET",
            url: this.m_GiftMeRootUrl + "/suggestions/suggestions?id=" + friend.FacebookId + "&sessionToken=" + this.sessionToken,
            data: "",
            cache: false,
            success: function (response) {
                //Now authenticate into giftme
                onCompleted(true, response);
            },
            error: function (response) {
                //TODO: Add some ui to show that the gift me auth failed
                onCompleted(false, null);
            }
        });
    };

    GiftMeClientLibrary.prototype.searchFriends = function (name, onCompleted) {
        $.ajax({
            type: "GET",
            url: this.m_GiftMeRootUrl + "/friends/searchfriends?sessionToken=" + this.sessionToken + "&name=" + name + "&pictureType=large",
            data: "",
            cache: false,
            success: function (response) {
                //Now authenticate into giftme
                onCompleted(true, response);
            },
            error: function (response) {
                //TODO: Add some ui to show that the gift me auth failed
                onCompleted(false, null);
            }
        });
    };
    return GiftMeClientLibrary;
})();
