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
            .state('weather.current', {
                url: '/current',
                templateUrl: 'views/current.html',
                controller: 'WeatherController'
            })
            .state('weather.forecast', {
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
        $scope.daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        $scope.timeOfDay = 'day';
        $scope.hour = date.getHours();
        $scope.isEvening = false;
        if ($scope.hour < 12) {
            $scope.timeOfDay = 'morning';
        } else if ($scope.hour < 18) {
            $scope.timeOfDay = 'afternoon';
            $scope.isEvening = true;
        } else if ($scope.hour < 24) {
            $scope.timeOfDay = 'evening';
        }

        $scope.dayOfWeek = $scope.daysOfWeek[date.getDay()];

        // Wind radar variables
        $scope.labels = _.fill(Array(36), '');
        $scope.wind = _.fill(Array(36), 0);

        function convertKtoF(n) {
            return (n * (9/5) - 459.67).toFixed(1)
        }

        // Get weather data based on city
        $http.get("http://api.openweathermap.org/data/2.5/weather?id=5809844&appid=" + openWeatherAPIkey)
            .success(function(response) {
                $scope.currentWeather = {description: response.weather[0].description.toLowerCase() || "___",
                                        id: response.weather[0].id,
                                        currentTemp: convertKtoF(response.main.temp) || "___",
                                        city: response.name || "___",
                                        country: response.sys.country || "___",
                                        wind: $scope.wind[Math.round(response.wind.deg / 10)] = response.wind.speed,
                                        sunrise: new Date(response.sys.sunrise * 1000),
                                        sunset: new Date(response.sys.sunset * 1000),
                                        humidity: response.main.humidity,
                                        pressure: response.main.pressure};

        });

        // Get weather forecast
        $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?id=5809844&appid=" + openWeatherAPIkey)
            .success(function(response) {
                var forecast = response.list;

                // Get dates of days that are in forecast
                var dates = _.pluck(forecast, 'dt');

                // Format dates for the graph
                $scope.forecastLabels = _.map(dates, function(x) {
                    var date = new Date(x * 1000);

                    return date.toDateString();
                });

                // Series for high and low temperatures for each day
                $scope.forecastSeries = ['high', 'low'];

                // Mine temperature data from API response. Collects high and low temperatures for each day.
                $scope.forecastData = [_.pluck(forecast, 'temp.max').map(convertKtoF),
                                        _.pluck(forecast, 'temp.min').map(convertKtoF)];

                // Graph colors
                $scope.forecastColors = ['#E74C3C', '#3498DB'];

                // Mine description data from API response.
                var forecastDesc = _.pluck(forecast, 'weather[0].id');

                //Format dates for the weather panel
                $scope.forecastWeatherDates = _.map(dates, function(x) {return new Date(x * 1000)});
                $scope.forecastWeather = [];

                var idx;
                for(idx = 0; idx < $scope.forecastLabels.length; idx++) {
                    $scope.forecastWeather.push({date: $scope.forecastWeatherDates[idx],
                                                id: forecastDesc[idx]});
                }

                $scope.forecastHumidity = [_.pluck(forecast, 'humidity').slice(0,4)];
                $scope.forecastPressure = [_.pluck(forecast, 'pressure').slice(0,4)];
                $scope.forecastLabelsSlice = _.slice($scope.forecastLabels, 0, 4);
            });
    });