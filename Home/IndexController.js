﻿var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
    angular.element(document).ready(function () {
        Office.initialize = function (reason) {
            var User = getCurrentUser();
            if (User == null) {
                Redirect("GettingStarted.html");
            }
            else {
                ValidateToken();
            }
        };


    });

    function RedirectToMeetingsOrBroadcast() {
        var BroadcastLink = Office.context.document.settings.get('BroadcastLink');
        if (BroadcastLink != null) {
            Redirect("Broadcast.html?BroadcastLink=" + encodeURIComponent(BroadcastLink));
        }
        else {
            Redirect("Meetings.html");
        }
    }
    function ValidateToken() {
        var User = getCurrentUser();
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + User.Token
        };
        var data = {
            "email": User.Email,
            "password": User.Password
        };

        AngularServices.GET("meetings", headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        RedirectToMeetingsOrBroadcast();
                        break;
                    case 401:
                        AngularServices.RenewTokenOrLogout(RedirectToMeetingsOrBroadcast);
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            });
    }
}];

app.controller("myCtrl", myCtrl);
