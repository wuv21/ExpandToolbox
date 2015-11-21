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
    .factory('currentWeatherReport', function($http) {
        return $http.get("http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=2de143494c0b295cca9337e1e96b00e0");
    })
    .controller('WelcomeController', function($scope) {
        $scope.user = {};
    })
    .controller('WeatherController', function($scope, $http) {
        $scope.user = {name: '', location: ''};

        // Personalized date and greeting
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

        // Wind radar variables
        $scope.labels = _.fill(Array(36), '');
        $scope.wind = _.fill(Array(36), 0);

        //Testing factory
        //currentWeatherReport.success(function(response) {
        //    console.log(response);
        //});

        // Get weather data based on city
        $http.get("http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=2de143494c0b295cca9337e1e96b00e0")
            .success(function(response) {
                $scope.currentWeather = {description: response.weather[0].description.toLowerCase() || "___",
                                        currentTemp: (response.main.temp * (9/5) - 459.67).toFixed(1) || "___",
                                        city: response.name || "___",
                                        country: response.sys.country || "___",
                                        wind: $scope.wind[Math.round(response.wind.deg / 10)] = response.wind.speed};

        });
    });