angular.module('WeatherApp', ['ui.router', 'chart.js'])
    .constant('openWeatherAPIkey', 'd59ca5993b82edf6497969631e4cabc4')
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
            })
            .state('forecast', {
                url: '/forecast',
                templateUrl: 'views/forecast.html',
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
    .controller('WeatherController', function($scope, $http, openWeatherAPIkey) {
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
        $http.get("http://api.openweathermap.org/data/2.5/weather?id=5809844&appid=" + openWeatherAPIkey)
            .success(function(response) {
                $scope.currentWeather = {description: response.weather[0].description.toLowerCase() || "___",
                                        currentTemp: (response.main.temp * (9/5) - 459.67).toFixed(1) || "___",
                                        city: response.name || "___",
                                        country: response.sys.country || "___",
                                        wind: $scope.wind[Math.round(response.wind.deg / 10)] = response.wind.speed,
                                        sunrise: new Date(response.sys.sunrise * 1000),
                                        sunset: new Date(response.sys.sunset * 1000)};

        });

        // Get weather forecast
        $http.get("http://api.openweathermap.org/data/2.5/forecast?id=5809844&appid=" + openWeatherAPIkey)
            .success(function(response) {
                var forecast = response.list;
                console.log(forecast);
                $scope.forecastLabels = _.pluck(forecast, 'dt').map(function(x) {
                    var date = new Date(x * 1000);

                });
                $scope.forecastSeries = ['high'];
                $scope.forecastData = [_.pluck(forecast, 'main.temp')];
                console.log($scope.forecastData);
            });
    });