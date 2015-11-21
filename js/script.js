angular.module('WeatherApp', ['ui.router', 'chart.js'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeController'
            })
            .state('weather', {
                url: '/weather',
                templateUrl: 'views/weather.html',
                controller: 'WeatherController'
            });

        $urlRouterProvider.otherwise('/welcome');
    })
    .controller('WelcomeController', function($scope) {
        $scope.user = {};
    })
    .controller('WeatherController', function($scope) {
        $scope.user = {name: '', location: ''};


        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];


    });