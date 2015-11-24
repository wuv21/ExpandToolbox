angular.module('WeatherApp', ['ui.router', 'chart.js'])
    .constant('openWeatherAPIkey', 'd59ca5993b82edf6497969631e4cabc4')
    .constant('userKey', 'user')
    .service('userInfo', function() {
        var user = {};
        return user;
    })
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
            })
            .state('errormessage', {
                url: '/error',
                templateUrl: '/error.html',
                controller: 'WeatherController'
            });

        $urlRouterProvider.otherwise('/welcome');
    })
    .controller('WelcomeController', function($http, $scope, $state, userInfo, userKey) {
        $scope.user = userInfo;
        $scope.user.loc = null;

        $scope.cityOptions;
        var files = $http.get('json/city_compressed_us.json')
            .success(function(response) {
                $scope.cityOptions = response;
        });

        // Submit button f(x) to see weather. Also saves to localstorage
        $scope.view = function() {
            localStorage.setItem(userKey, angular.toJson($scope.user));
            $state.go('weather.current');
        };
    })
    .controller('WeatherController', function($scope, $http, openWeatherAPIkey, userInfo, userKey, $state) {
        // Personalized date and greeting
        $scope.greeting = function() {
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

            // Days of week
            $scope.dayOfWeek = $scope.daysOfWeek[date.getDay()];
        };

        // Wind radar variables
        $scope.labels = _.fill(Array(36), '');
        $scope.wind = _.fill(Array(36), 0);

        // Converts Kelvin to Farenheit
        function convertKtoF(n) {
            return (n * (9/5) - 459.67).toFixed(1)
        }

        // Get weather data based on city
        $scope.getCurrent = function() {
            if ($scope.user.loc.id) {
                $http.get("http://api.openweathermap.org/data/2.5/weather?id=" + $scope.user.loc.id + "&appid=" + openWeatherAPIkey)
                    .then(function(response) {
                        response = response.data;

                        if (response.cod === '404') {
                            console.log(response.message);
                            $state.go('errormessage');
                        } else {
                            // Current weather data
                            $scope.currentWeather = {description: response.weather[0].description.toLowerCase() || "___",
                                id: response.weather[0].id,
                                currentTemp: convertKtoF(response.main.temp) || "___",
                                city: response.name || "___",
                                country: response.sys.country || "___",
                                wind: $scope.wind[Math.round(response.wind.deg / 10)] = (response.wind.speed / 1609.34 * 3600).toFixed(2),
                                sunrise: new Date(response.sys.sunrise * 1000),
                                sunset: new Date(response.sys.sunset * 1000),
                                humidity: response.main.humidity,
                                pressure: response.main.pressure,
                                cloud: [response.clouds['all'], 100-response.clouds['all']],
                                rain: response.hasOwnProperty('rain') ? response.rain['3h'] : 0,
                                snow: response.hasOwnProperty('snow') ? response.snow['3h'] : 0};

                            // Rain/snow data
                            $scope.rainSnowData = [[$scope.currentWeather.rain, $scope.currentWeather.snow]];
                            $scope.rainSnowLabels = ['Rain', 'Snow'];
                        }
                    });
            }
        };

        // Cloud chart data
        $scope.cloudLabels = ['cloudy', 'clear'];
        $scope.cloudColors = ['#C5C5C5', '#CBDDE6'];

        // Get weather forecast
        $scope.getForecast = function() {
            $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?id=5809844&appid=" + openWeatherAPIkey)
                .then(function(response) {
                    response = response.data;

                    if (response.cod === '404') {
                        console.log(response.message);
                        $state.go('errormessage');
                    } else {
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

                        // Format dates for the weather panel
                        $scope.forecastWeatherDates = _.map(dates, function(x) {return new Date(x * 1000)});
                        $scope.forecastWeather = [];

                        var idx;
                        for(idx = 0; idx < $scope.forecastLabels.length; idx++) {
                            $scope.forecastWeather.push({date: $scope.forecastWeatherDates[idx],
                                id: forecastDesc[idx]});
                        }

                        // Mine humidity data
                        $scope.forecastHumidity = [_.pluck(forecast, 'humidity').slice(0,4)];

                        // Mine pressure data
                        $scope.forecastPressure = [_.pluck(forecast, 'pressure').slice(0,4)];

                        // Modified labels since humidity & pressure have fewer predicted dates
                        $scope.forecastLabelsSlice = _.slice($scope.forecastLabels, 0, 4);
                    }
            });
        };

        // User going back to welcome page when clicked
        $scope.back = function() {
            $state.go('welcome');
        };

        // Get user inputted info and run page
        $scope.user = userInfo || angular.fromJson(localStorage.getItem(userKey));

        // Loads weather page only if user exists
        if (!$scope.user.name) {
            $state.go('welcome');
        } else {
            $scope.greeting();
            $scope.getCurrent();
            $scope.getForecast();
        }

        // Refreshes data upon user click
        $scope.refresh = function() {
            $scope.greeting();
            $scope.getCurrent();
            $scope.getForecast();
        }
    });