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
        Office.context.document.settings.set('BroadcastStatus', 'None');
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
        AngularServices.GET("meetings/" + pollID + "/polls/", headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        $scope.Polls = response.data.result;
                        break;
                    case 401:
                        AngularServices.RenewTokenOrLogout(GetPolls(pollID));
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            }
            );
    }
}];

app.controller("myCtrl", myCtrl);
