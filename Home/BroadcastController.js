var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {

    UpdateBroadcastLink();

    function UpdateBroadcastStatus(Status) {
        if (Status != "ready") {
            $("#status").html('Stop');
        } else if (Status != "live") {
            $("#status").html('Start');
        }
    }

    function GetPollState(MeetingID, BroadcastID) {
        var User = getCurrentUser();
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + User.Token
        };
        // These poll types are not broadcastable right now.
        var unsupportedTypes = [
            // Surveys are just poll containers.
            "group",
            // Survey poll dividers are stub objects.
            "divider",
            // Grid polls are not supported as of March '19, but will be in future.
            "rated-multiple"
        ];
        AngularServices.GET("meetings/" + MeetingID + "/polls/", headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        var polls = Array.isArray(response.data.result) ? response.data.result : [];
                        polls = polls.filter(function(poll) {
                            return poll.id == BroadcastID;
                        });
                        if (polls.length > 0) {
                            var poll = polls[0];
                            UpdateBroadcastStatus(poll.state);
                        }
                        break;
                    case 401:
                        AngularServices.RenewTokenOrLogout(GetPolls(pollID));
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            });
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

    function Begin() {
        var BroadcastID = Office.context.document.settings.get('BroadcastID');
        var MeetingID = Office.context.document.settings.get('MeetingID');
        if (BroadcastID != null) {
            GetPollState(MeetingID, BroadcastID)
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

    $scope.UpdateStatus = function () {
        var Status = $('#status').html()
        if (Status == 'Start') {
            UpdateBroadcast("live", MeetingID, BroadcastID);
        } else {
            UpdateBroadcast("ready", MeetingID, BroadcastID);
        }
    }
}];

app.controller("myCtrl", myCtrl);






