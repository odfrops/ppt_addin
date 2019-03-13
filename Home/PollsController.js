var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
    Office.initialize = function (reason) {
    };
    angular.element(document).ready(function () {
        $scope.meetingID = getQueryStringValue("meetingID");
        $scope.BaseURL = BaseURL + "broadcast/" + $scope.meetingID + "/";
        GetPolls($scope.meetingID);
        $(".pointcur").css('cursor', 'pointer');
      

    });
    $("#btnMeeting").click(function () {
        Redirect("Meetings.html");
    });
    $scope.SavePoll = function (BroadcastLink,BroadcastID) {
        Office.context.document.settings.set('BroadcastLink', BroadcastLink );
        Office.context.document.settings.set('BroadcastStatus', 'ready');
        Office.context.document.settings.set('BroadcastID', BroadcastID );
        Office.context.document.settings.set('MeetingID', $scope.meetingID);
        Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (r) {
            Office.context.document.settings.set('SlideID', r.value.slides[0].id);
            Office.context.document.settings.saveAsync(function (asyncResult) {
                if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                    console.log('Settings save failed. Error: ' + asyncResult.error.message);
                } else {
                    console.log('Settings saved.');
                }
                Redirect("Broadcast.html?BroadcastLink=" + encodeURIComponent(BroadcastLink));
            });
        });
    }
    $scope.Polls = [];
    $scope.CleanPoll = function (poll) {
        if ( String(poll).indexOf('[fmd]') > -1)
            return JSON.parse(poll.replace('[fmd]:', '')).caption;
        else
            return poll;
    }
    function GetPolls(pollID) {
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
        // These poll types are not broadcastable right now.
        var unsupportedTypes = [
            // Surveys are just poll containers.
            "group",
            // Survey poll dividers are stub objects.
            "divider",
            // Grid polls are not supported as of March '19, but will be in future.
            "rated-multiple"
        ];
        AngularServices.GET("meetings/" + pollID + "/polls/", headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        var polls = Array.isArray(response.data.result) ? response.data.result : [];
                        $scope.Polls = polls.filter(function(poll) {
                            return unsupportedTypes.indexOf(poll.type) === -1;
                        });

                        if ($scope.Polls.length == 0)
                            document.getElementById("error").innerText = "No polls have been created in this meeting.";
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
}];

app.controller("myCtrl", myCtrl);
