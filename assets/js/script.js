var userFormEl = document.querySelector('#user-form');
var searchHistoryEl = document.querySelector('#search-history');
var nameInputEl = document.querySelector('#cityname');
var forecastContainerEl = document.querySelector('#forecast-container');
var forecastResults = document.querySelector('#forecast-results');
var apiKey = "bc9531820405a218518fa46f5eca8e90";

var formSubmitHandler = function(event) {
  event.preventDefault();

  var city = nameInputEl.value.trim();

  if (city) {
    getWeather(city);

    forecastContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
};

var buttonClickHandler = function(event) {
  var language = event.target.getAttribute('data-language');
};

var getWeather = function(city) {
    var apiUrl = 'api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
  
    fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayWeather(data, city);
            saveCitySearch(city);
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
    forecastContainerEl.innerHTML = '';
  
    var cityNameEl = document.createElement('h4');
    cityNameEl.textContent = city;
    forecastContainerEl.appendChild(cityNameEl);
  
    var forecastData = weatherData.list;
    for (var i = 0; i < forecastData.length; i += 8) {
      var forecastEl = document.createElement('div');
      forecastEl.classList.add('forecast-item');
  
      var dateEl = document.createElement('p');
      var date = new Date(forecastData[i].dt * 1000);
      dateEl.textContent = date.toLocaleDateString();
      forecastEl.appendChild(dateEl);
  
      var temperatureEl = document.createElement('p');
      var temperature = Math.round(((forecastData[i].main.temp - 273.15) * 9) / 5 + 32); // Convert temperature from Kelvin to Fahrenheit
      temperatureEl.textContent = 'Temperature: ' + temperature + ' °F';
      forecastEl.appendChild(temperatureEl);
  
      var humidityEl = document.createElement('p');
      humidityEl.textContent = 'Humidity: ' + forecastData[i].main.humidity + '%';
      forecastEl.appendChild(humidityEl);

      var windSpeedEl = document.createElement('p');
      var wind = Math.round(forecastData[i].wind.speed * 2.237); // Convert mps to MPH
      windSpeedEl.textContent = 'Wind Speed: ' + wind + ' MPH';
      forecastEl.appendChild(windSpeedEl);
  
      forecastContainerEl.appendChild(forecastEl);
    }
  };  

var saveCitySearch = function(city) {
    var pastSearches = JSON.parse(localStorage.getItem('citySearches')) || [];
  
    // Check if the city already exists in the past searches
    var existingIndex = pastSearches.findIndex(function(search) {
      return search.toLowerCase() === city.toLowerCase();
    });
  
    // If the city is not already in the past searches, add it
    if (existingIndex === -1) {
      pastSearches.push(city);
      // Save the updated array in localStorage
      localStorage.setItem('citySearches', JSON.stringify(pastSearches));
  
      // Update the displayed past searches
      var searchItemEl = document.createElement('button');
      searchItemEl.textContent = city;
      searchItemEl.classList.add('btn');
      searchItemEl.classList.add('past-search');
      searchHistoryEl.appendChild(searchItemEl);
    }
  };  

var loadPastSearches = function() {
  var pastSearches = JSON.parse(localStorage.getItem('citySearches')) || [];

  // Display past searches
  for (var i = 0; i < pastSearches.length; i++) {
    var searchItemEl = document.createElement('button');
    searchItemEl.textContent = pastSearches[i];
    searchItemEl.classList.add('btn');
    searchItemEl.classList.add('past-search');
    searchHistoryEl.appendChild(searchItemEl);
  }
};

var pastSearchClickHandler = function(event) {
  var city = event.target.textContent;
  getWeather(city);
};

userFormEl.addEventListener('submit', formSubmitHandler);
searchHistoryEl.addEventListener('click', buttonClickHandler);
searchHistoryEl.addEventListener('click', pastSearchClickHandler);

// Load past searches on page load
loadPastSearches();