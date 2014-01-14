/// <reference path="..\typings\jquery\jquery.d.ts" />

class GiftMeClientLibrary {

    m_GiftMeRootUrl: string;

    public constructor(public sessionToken : string) {
        this.m_GiftMeRootUrl = "http://giftmeapp.cloudapp.net/api";
    }

    getFriends(onCompleted: { (suceeded: Boolean, results: Friend[]) } ) {
            
        $.ajax({
            type: "GET",
            url: this.m_GiftMeRootUrl + "/friends/friends?sessionToken=" + this.sessionToken +"&pictureType=large&limit=60",
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
    }
    getSuggestions(friend: Friend, onCompleted: { (suceeded: Boolean, results: GiftSuggestion[]) }) {

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
    }

    searchFriends(name: string, onCompleted: { (suceeded: Boolean, results: Friend[]) }) {

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
    }
        
}

interface Friend {
    FriendOfId: string;
    ProfilePicUrl: string;
    FacebookId: string;
    Name: string;
    FirstName: string;
    LastName: string;
    Birthday: string;
}

interface GiftSuggestion {
    Name: string;
    ImageUrl: string;
    Description: string;
    //formatted price
    Price: string;
    ProductUrl: string;
    Reason: Reason;
    Category: string;
}

interface Reason {
    FacebookLike: Like;
        
}

interface Like {
    Name: string;
    Category: string;
    Probability: number;
    Id: number;
}