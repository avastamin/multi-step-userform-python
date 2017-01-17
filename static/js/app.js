angular.module('formApp', ['ngAnimate','ui.router','ngFileUpload'])

// configuring our routes
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'static/templates/form.html',
            controller: 'formController'
        })

        // nested states
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'static/templates/form-profile.html'
        })

        // url will be /form/interests
        .state('form.image', {
            url: '/profileimage:user_id',
            templateUrl: 'static/templates/form-profile-image.html'
        })
        // url will be /form/completed
        .state('form.completed', {
            url: '/profilecompleted',
            templateUrl: 'static/templates/profile-completed.html'
        })
    // catch all route
    // send users to the form page
    $urlRouterProvider.otherwise('/form/profile');
})

// our controller for the form
// =============================================================================
.controller('formController', ['$scope','$http','Upload','$timeout','$state', function($scope, $http, Upload, $timeout, $state) {

    // we will store all of our form data in this object
    $scope.formData = {};



    // function to process the form
    $scope.processForm = function() {
        var config = {
                headers : {
                     'Content-Type': 'application/json'
                }
            }

       $http.post('/savedata',$scope.formData,config)
       .success(function (data, status, headers, config) {
                $scope.formData.user_id = data;
                $state.go("form.image",{ user_id: data});
            })
      .error(function (data, status, header, config) {
      console.log("Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config );
    });
    };

// upload later on form submit or something similar
 $scope.uploadPic = function(file) {
    $scope.formData.imagename = file.name;

    file.upload = Upload.upload({
      url: '/uploadimage',
      data: {file: file, user_id:$scope.formData.user_id },
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
    file.upload.success(function (data, status, headers, config) {
            $state.go("form.completed");
        });
    }
}]);