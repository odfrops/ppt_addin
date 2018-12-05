var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {

 
    var Link = decodeURIComponent(getQueryStringValue("BroadcastLink"));
    $scope.BroadcastLink = $sce.trustAsResourceUrl(Link);
    Office.initialize = function (reason) {
        //var SlideID = Office.context.document.settings.get('SlideID');
        //window.setInterval(function () {

        //    Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (r) {
        //        Office.context.document.getActiveViewAsync(function (asyncResult) {
        //            if (asyncResult.status == "failed") {
        //                console.log("Action failed with error: " + asyncResult.error.message);
        //            }
        //            else {
        //                console.log(asyncResult.value);
        //            }
        //        });
        //        if (SlideID == r.value.slides[0].id)
        //            console.log("Meeting:" + SlideID + " Started");
        //        else
        //            console.log("Meeting:" + SlideID + " Stopped");
        
        //    });

        //}, 2500);

       
    };

    
}];

app.controller("myCtrl", myCtrl);






