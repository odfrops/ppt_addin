var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
    angular.element(document).ready(function () {
        var User = getCurrentUser();
        if (User == null)
            Redirect("Login.html");
        else
            ValidateToken();

    });
    function RenewTokenOrLogout(RedirectTo) {
        var User = getCurrentUser();
        var data = {
            "email": User.Email,
            "password": User.Password
        };
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        AngularServices.POST("auth", data, headers).
            then(function (response) {
                switch (response.status) {
                    case 401:
                        Redirect("Login.html");
                        break;
                    case 200:
                        User.Token = response.data.result.token;
                        SaveUser(User);
                        Redirect(RedirectTo);
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            }

            );

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
                        Redirect("Main.html");
                        break;
                    case 401:
                        RenewTokenOrLogout("Main.html")
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
