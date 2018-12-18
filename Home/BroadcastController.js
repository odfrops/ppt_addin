var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {
    UpdateBroadcastLink();
    function EndBroadcast(MeetingID, BroadcastID) {
        if (GetBroadcastStatus() != "ready")
            UpdateBroadcast("ready", MeetingID, BroadcastID);
    }
    function StartBroadcast(MeetingID, BroadcastID) {
        if (GetBroadcastStatus() != "live")
            UpdateBroadcast("live", MeetingID, BroadcastID);
    }
    function UpdateBroadcastStatus(Status) {
        Office.context.document.settings.set('BroadcastStatus', Status);
        Office.context.document.settings.saveAsync(function (asyncResult) {
            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                console.log('Settings save failed. Error: ' + asyncResult.error.message);
            } else {
                console.log('Settings saved.');
            }

        });
    }
    function GetBroadcastStatus() {
        return Office.context.document.settings.get('BroadcastStatus');
    }
    function UpdateBroadcast(Status, MeetingID, BroadcastID) {
      
        var User = getCurrentUser();
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + User.Token
        };
        var data = {
            "state": Status
        };
        AngularServices.PUT("meetings/" + MeetingID + "/polls/" + BroadcastID, data, headers).
            then(function (response) {
                switch (response.status) {
                    case 204:
                        UpdateBroadcastStatus(Status);
                        break;
                    case 401:
                        AngularServices.RenewTokenOrLogout(UpdateBroadcast(Status, MeetingID, BroadcastID));
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            }
            );


    }
    function UpdateBroadcastLink() {
        var Link = decodeURIComponent(getQueryStringValue("BroadcastLink"));
        var User = getCurrentUser();
        Link = Link.replace("#", "?t=" + User.ClientToken + "#");
        console.log("BroadCastLink:" + Link);
        $scope.BroadcastLink = $sce.trustAsResourceUrl(Link);
    }
    Office.initialize = function (reason) {
        var SlideID = Office.context.document.settings.get('SlideID');
        var BroadcastID = Office.context.document.settings.get('BroadcastID');
        var MeetingID = Office.context.document.settings.get('MeetingID');
        if (BroadcastID != null) {
            window.setInterval(function () {
                Office.context.document.getActiveViewAsync(function (asyncResult) {
                    if (asyncResult.status == "failed") {
                        console.log("Action failed with error: " + asyncResult.error.message);
                    }
                    else {
                        if (asyncResult.value == 'read')
                            Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (r) {
                                if (r.status != "failed") {
                                    if (SlideID == r.value.slides[0].id) {
                                        StartBroadcast(MeetingID, BroadcastID);
                                    }
                                    else {
                                        EndBroadcast(MeetingID, BroadcastID);
                                    }
                                }


                            });
                        else {
                            EndBroadcast(MeetingID, BroadcastID);
                        }
                    }
                });
            }, 1000);
        }
    };
}];

app.controller("myCtrl", myCtrl);






