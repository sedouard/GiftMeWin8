/// <reference path="winrt.d.ts" />
/// <reference path="..\scripts\typings\winjs\winjs.d.ts" />
/// <reference path="..\scripts\typings\jquery\jquery.d.ts" />
/// <reference path="lib.d.ts" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var g_giftMeBaseUri = "http://giftmeapp.cloudapp.net";
var g_sessionToken;
var GiftMeApp;
(function (GiftMeApp) {
    (function () {
        "use strict";
        var app = WinJS.Application;
        var nav = WinJS.Navigation;
        var sched = WinJS.Utilities.Scheduler;
        var ui = WinJS.UI;
        var app = WinJS.Application;

        var activation = Windows.ApplicationModel.Activation;

        app.addEventListener("activated", function (args) {
            if (args.detail.kind === activation.ActivationKind.launch) {
                // else statement omitted in code snippet
                if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                    // Add privacy policy to settings charm
                    WinJS.Application.onsettings = function (e) {
                        e.detail.applicationcommands = { "help": { title: "Privacy policy", href: "/pages/privacypolicy/privacy.html" } };
                        WinJS.UI.SettingsFlyout.populateSettings(e);
                    };
                } else {
                    // TODO: This application has been reactivated from suspension.
                    // Restore application state here.
                }

                ui.disableAnimations();
                var p = ui.processAll().then(function () {
                    return nav.navigate(nav.location || Application.navigator.home, nav.state);
                }).then(function () {
                    return sched.requestDrain(sched.Priority.aboveNormal + 1);
                }).then(function () {
                    ui.enableAnimations();
                });
                args.setPromise(p);
            }
        });

        app.oncheckpoint = function (args) {
            // TODO: This application is about to be suspended. Save any state
            // that needs to persist across suspensions here. You might use the
            // WinJS.Application.sessionState object, which is automatically
            // saved and restored across suspension. If you need to complete an
            // asynchronous operation before your application is suspended, call
            // args.setPromise().
        };

        app.start();
    })();
})(GiftMeApp || (GiftMeApp = {}));
