var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var apiKey = "bc9531820405a218518fa46f5eca8e90";

var formSubmitHandler = function(event) {
  event.preventDefault();

  var city = nameInputEl.value.trim();

  if (city) {
    getWeather(city);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
};

/*var buttonClickHandler = function(event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    alert('You clicked the ' + language + ' button');
  }
};*/

var getWeather = function(city) {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          displayWeather(data, city);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert('Unable to connect to OpenWeatherMap');
    });
};

var displayWeather = function(weatherData, city) {
  // Clear previous weather data
  repoContainerEl.innerHTML = '';

  var cityNameEl = document.createElement('h4');
  cityNameEl.textContent = city;
  repoContainerEl.appendChild(cityNameEl);

  var temperatureEl = document.createElement('p');
  temperatureEl.textContent = 'Temperature: ' + weatherData.main.temp + ' °F';
  repoContainerEl.appendChild(temperatureEl);

  // Display additional weather data as needed

  var humidityEl = document.createElement('p');
  humidityEl.textContent = 'Humidity: ' + weatherData.main.humidity + '%';
  repoContainerEl.appendChild(humidityEl);

  var windSpeedEl = document.createElement('p');
  windSpeedEl.textContent = 'Wind Speed: ' + weatherData.wind.speed + ' MPH';
  repoContainerEl.appendChild(windSpeedEl);
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
