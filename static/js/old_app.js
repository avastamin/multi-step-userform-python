// app.js
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('formApp', ['ngRoute','ngAnimate', 'ui.router','ngMessages'])
// our controller for the form
// =============================================================================
.controller('formController', function($scope, $http, $location) {
    // we will store all of our form data in this object
    $scope.formData = {};

    // function to process the form
    $scope.processForm = function() {
console.log($scope.formData);
    var config = {
                headers : {
                     'Content-Type': 'application/json'
                }
            }

       $http.post('/savedata',$scope.formData,config)
       .success(function (data, status, headers, config) {
               $location.path('/uploadimage');

                console.log(data);
                $scope.PostDataResponse = data;
            })
      .error(function (data, status, header, config) {
      console.log("Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config );
    });
}
})

.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/uploadimage', {
        controller: 'formController',
        templateUrl: 'static/templates/form-interests.html'
    })
});