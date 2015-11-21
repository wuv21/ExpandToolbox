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
    .controller('WeatherController', function($scope, $http) {
        $scope.user = {name: '', location: ''};

        var date = new Date();
        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        $scope.timeOfDay = 'day';
        var hour = date.getHours();
        if (hour < 12) {
            $scope.timeOfDay = 'morning';
        } else if (hour < 18) {
            $scope.timeOfDay = 'afternoon';
        } else if (hour < 24) {
            $scope.timeOfDay = 'evening';
        }

        $scope.dayOfWeek = daysOfWeek[date.getDay()];

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $http.get("http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=2de143494c0b295cca9337e1e96b00e0")
            .success(function(response) {
                console.log(response);
            })
    });