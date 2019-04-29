"use strict";

var app = angular.module('myApp', []);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});

var subDomain = "eu";
var BaseAPIURI = "https://" + subDomain + ".openmeet.eu/api/";
var BaseURL = "https://" + subDomain + ".openmeet.eu/";

function Redirect(q) {
    window.location.href = q;
}

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}

function removeObj(myObjects, prop, valu) {
    return myObjects.filter(function (val) {
        return val[prop] !== valu;
    });
}

function SaveUser(User) {
    localStorage.setObj("User", User);
}

function getCurrentUser() {
    return localStorage.getObj("User");
}


app.service('AngularServices', ['$http', function ($http) {
    var API = {
        GET: function (EndPoint,headers) {

            return $http(
                {
                    method: 'GET',
                    url: BaseAPIURI + EndPoint,
                    headers: headers
                })
                .then(function (response) {
                    return response;
                }).catch(function (response) {
                    return response;
                });
        },
        POST: function (EndPoint, body, headers) {
            var settings = {
                method: 'POST',
                url: BaseAPIURI + EndPoint,
                data: body,
                headers: headers
            };
            return $http(settings)
                .then(function (response) {
                    return response;
                }).catch(function (response) {
                    return response;
                });
        },
        PUT: function (EndPoint, body, headers) {
            var settings = {
                method: 'PUT',
                url: BaseAPIURI + EndPoint,
                data: body,
                headers: headers
            };
            return $http(settings)
                .then(function (response) {
                    return response;
                }).catch(function (response) {
                    return response;
                });
        }
    };

    API.RenewTokenOrLogout = function (cb) {
        var User = getCurrentUser();
        var data = {
            "email": User.Email,
            "password": User.Password
        };
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        API.POST("auth", data, headers).
            then(function (response) {
                switch (response.status) {
                    case 401:
                        SaveUser(null);
                        Redirect("Login.html");
                        break;
                    case 200:
                        User.Token = response.data.result.token;
                        User.ClientToken = response.data.result.clientToken;
                        SaveUser(User);
                        cb();
                        break;

                    default:
                        SaveUser(null);
                        Redirect("Login.html");
                        break;
                }
            });
    }

    return API;
}]);
