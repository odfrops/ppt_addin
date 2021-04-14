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
                        //Redirect("Login.html");
                        break;
                }
            });
    }
    function UpdateBroadcastLink() {
        var Link = decodeURIComponent(getQueryStringValue("BroadcastLink"));
        var User = getCurrentUser();
        Office.initialize = function (reason) {
            var BroadcastID = Office.context.document.settings.get('BroadcastID');
            if (BroadcastID == null)
                Link = Link.replace("#", "?t=" + User.ClientToken + "#")
            else
                Link = Link + "?t=" + User.ClientToken;
            console.log("BroadCastLink:" + Link);
            $scope.BroadcastLink = $sce.trustAsResourceUrl(Link);
            $scope.$apply();
            Begin();
        }
    }
    window.getActiveViewCallback = function getActiveViewCallback(asyncResult) {
        if (asyncResult.status == "failed") {
            console.log("Action failed with error: " + asyncResult.error.message);
        }
        else {
            // if (asyncResult.value == 'read')
            //     Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (r) {
            //         if (r.status != "failed") {
            //             if (window._slide_id == r.value.slides[0].id) {

            //                 StartBroadcast(window._meeting_id, window._broadcase_id);
            //             }
            //             else {
            //                 EndBroadcast(window._meeting_id, window._broadcase_id);
            //             }
            //         }


            //     });
            // else {
            //     EndBroadcast(window._meeting_id, window._broadcase_id);
            // }
        }
    }
    window._asyncCount = 0;
    async function updateLoop() {
        // Office.context.document.getActiveViewAsync(getActiveViewCallback);
        var promise = new OfficeExtension.Promise(function (resolve) {
            Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function(asyncResult) {
                resolve(asyncResult);
            });
        });
        var result = await promise;
        console.log(result);
        promise = null;
        result = null;
        if (window._asyncCount < 100) {
            ++ window._asyncCount;
        } else {
            window._asyncCount = 0;
            clearInterval(window._interval_id);
            window.location.reload();
        }
    }
    function Begin() {
        window._slide_id = Office.context.document.settings.get('SlideID');
        window._broadcase_id = Office.context.document.settings.get('BroadcastID');
        window._meeting_id = Office.context.document.settings.get('MeetingID');
        if (window._broadcase_id != null) {
            window._interval_id = setInterval(updateLoop, 100);
        }
    }
    $scope.RedirectToMeetings = function () {
        Office.context.document.settings.set('BroadcastLink', null);
        var MeetingID = Office.context.document.settings.get('MeetingID');
        Office.context.document.settings.saveAsync(function (asyncResult) {
            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                console.log('Settings save failed. Error: ' + asyncResult.error.message);
            } else {
                console.log('Settings saved.');
            }
            Redirect("Polls.html?meetingID=" + MeetingID)
        });
    }
}];

app.controller("myCtrl", myCtrl);






