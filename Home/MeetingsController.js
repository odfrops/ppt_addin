var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    Office.initialize = function (reason) {

    };
    angular.element(document).ready(function () {
        $(".pointcur").css('cursor', 'pointer');

        GetMeetings();

    });

    $scope.Meetings = [];

    $scope.GoToPolls = function (e, meetingId) {
        e.preventDefault();
        Redirect("Polls.html?meetingId=" + meetingId);
    };

    $("#btnLogout").click(function () {
        SaveUser(null);
        Redirect("Login.html");
    });

    function GetMeetings() {
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
                        $scope.Meetings = response.data.result;
                        if ($scope.Meetings.length == 0)
                            document.getElementById("error").innerText = "No meetings have been created in this account.";
                        break;
                    case 401:
                        AngularServices.RenewTokenOrLogout(GetMeetings);
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
