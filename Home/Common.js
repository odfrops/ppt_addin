"use strict";

// Available endpoints and their configs.

var configs = {
    "openeu": {
        "domain": "eu.openmeet.eu",
        "customViews": {
            "GettingStarted": true
        },
        "customPath": "/Home/OpenAudience"
    },
    "development": {
        "domain": "dev.meet.ps"
    },
    "default": {
        "domain": "app.meet.ps"
    },
    "local": {
        "domain": "local.meet.ps:8443"
    }
};

var mode = getQueryStringValue("endpoint");
var config = configs[mode] || configs.default;

var BaseURL = "https://" + config.domain + "/";
var BaseAPIURI = BaseURL + "api/";
// Some assets are hosted in a subdirectory, making it nested..
var basePath = "/Home";


// Reprototypings.

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}


// Common funcs.

function removeObj(myObjects, prop, value) {
    return myObjects.filter(function (val) {
        return val[prop] !== value;
    });
}

function SaveUser(User) {
    localStorage.setObj("User", User);
}

function getCurrentUser() {
    return localStorage.getObj("User");
}

// Relative URL redirector with support for customized views depending on config/endpoint.
function Redirect(q) {
    // Honour base relative path.
    var currentPath = window.location.pathname.indexOf(basePath);
    var basePrefix = window.location.pathname.substring(0, currentPath);
    // Get the target view name, check if it has custom version.
    var view = String(q).trim().split(".").shift();
    var isCustom = config.customViews && config.customViews[view] && config.customPath;
    var prefix = basePrefix + (isCustom ? (config.customPath + "/") : "/Home/");
    // Carry over the endpoint/mode thing. Note that other strings might already be present there.
    var queryGlue = String(q).indexOf("?") === -1 ? "?" : "&";
    var suffix = mode ? (queryGlue + "endpoint=" + mode) : "";
    var path = prefix + q + suffix;

    window.location.href = path;
}

// TODO: ng-click this
function ForgotPassword () {
    window.open(BaseURL + "login/forgot", "_blank");
}

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


// "main"

if (window.angular) {
    var app = angular.module('myApp', ['ngSanitize']);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

    app.filter('encodeURIComponent', function () {
        return window.encodeURIComponent;
    });

    app.filter('sanitizer', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

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
}
