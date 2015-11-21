angular.module('WeatherApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'views/welcome.html',
                controller: 'WeatherController'
            })
            .state('weather', {
                url: '/weather',
                templateUrl: 'views/weather.html',
                controller: 'WeatherController'
            });

        $urlRouterProvider.otherwise('/welcome');
    })
    .controller('WeatherController', function($scope) {
        $scope.user = {name: '', location: ''};

        $('h1').fadeIn(5000);
    });