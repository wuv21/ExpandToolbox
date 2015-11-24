# ExpandToolbox
Expanding my javascript toolbox with Chart.js, lodash, and angular-chart.js. Welcome to Raindrop!

## What is my challenge (Raindrop)?
This challenge is to utilize Chart.js, Angular-chart.js, and Angular to create a responsive and modern weather information site based on the user's current location or an user-inputted location via the OpenWeatherMap API. This project will also utilize lodash.js and ui-routing for quicker data crunching and seamless interactions. For styling purposes, Bootstrap is used.

## Why these technologies?
Data visualization is a hot topic nowadays and it serves the saying that a picture is worth a thousand words. Data, when organized and presented in a certain, provides information to the user. By combining Chart.js (which is a library on top of D3.js) with Angular, and lodash, a web developer can quickly harness data and present that data in a powerful web app. The latter library provides functions to quickly deal with working with collections and pulling out specific information from objects.

## Are there any potential cautions?
Chart.js is a popular library with over 17 thousand stars and 57 contributors. It currently has 393 issues open with the latest commit being a week ago. The wrapper for Chart.js for Angular has about 1.2 thousand stars with 22 issues open. Their latest commit was nine hours ago. By using Angular, it does create limitations on what graphs can be created. Using just Chart.js (and by extension, using just D3.js) would offer a greater breadth of options and possibilities in representing data. Lodash, on the other hand, will run well with or without Angular. This library currently has over 12 thousand stars with 0 issues open - with a commit occurring today.

## What is this app?
This app (called Raindrop) is a weather app that will:
1 Ask user for location
2 Get weather information based on that location from OpenWeatherMap API
3 Load the data into a user-friendly interface.
  * Current forecast - including temperature, sunrise, sunset, description, humidity, pressure, cloud coverage, & rain/snow amounts
  * Predicted 7-day forecast - including temperature, 

Since weather data is quite functional in graphs, I used the data visualization libraries to simplify the data and allow the user to quickly get what he or she needs without having to pore through textual or numerical data. This ranges from using a radar graph to see where and how strong the wind is blowing - which is more intuitive way than saying "`NNE at 5mph`"). Chart.js allows interaction with the graphs such as hovering over a point/area to see what that point/area means.

## How to run Raindrop?
All that is needed to run Raindrop is to visit the [website](http://students.washington.edu/wuv21/ExpandToolbox/#/welcome).

However, more steps are required if re-creating Raindrop. Libraries (in this order) that must be downloaded or linked via a CDN are stated below.
* Chart.js
* lodash.js
* angular.js
* angular-ui-router.js
* angular-chart.js

In addition, one must sign up for an OpenWeatherMap API key located [here](http://openweathermap.org/api). To allow for user to input a location based on a city rather than a long numerical id, I used their city names/city id json file located [here](http://bulk.openweathermap.org/sample/). Since the file size is relatively big for the world cities, I decided to use only the US cities one. In using the `city.list.us.json.gz` file, this file must be uncompressed. I additionally shrunk and corrected the format of the json file with my python program that I included in the json folder of this repository. It is advised to run this python program once to generate a compressed json prior to deploying the final product.

## What to do if I want to learn more?
Definitely check out the documentation! They often have examples and the links to their repositories on GitHub. I have included links below and also a link to the Weather Icons that I used for this app.
* [Chart.js](http://www.chartjs.org/)
* [lodash.js](https://lodash.com/)
* [angular.js](https://angularjs.org/)
* [angular-ui-router.js](http://angular-ui.github.io/ui-router/site/#/api/ui.router)
* [angular-chart.js](http://jtblin.github.io/angular-chart.js/)
* [Bootstrap](http://getbootstrap.com/getting-started/)
* [Weather Icons](https://erikflowers.github.io/weather-icons/)

Hope you enjoy Raindrop!