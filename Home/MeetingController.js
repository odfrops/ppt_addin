var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    angular.element(document).ready(function () {
        

    });

    $("#btnMeeting").click(function () {
        Redirect("Main.html");
    });

}];

app.controller("myCtrl", myCtrl);
