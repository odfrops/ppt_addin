var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    angular.element(document).ready(function () {
        

    });

    $("#btnLogout").click(function () {
        SaveUser(null);
        Redirect("Login.html");
    });

}];

app.controller("myCtrl", myCtrl);
