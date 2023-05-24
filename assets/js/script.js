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

var buttonClickHandler = function(event) {
  var language = event.target.getAttribute('data-language');
};

var getWeather = function(city) {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

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
      languageButtonsEl.appendChild(searchItemEl);
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
    languageButtonsEl.appendChild(searchItemEl);
  }
};

var pastSearchClickHandler = function(event) {
  var city = event.target.textContent;
  getWeather(city);
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
languageButtonsEl.addEventListener('click', pastSearchClickHandler);

// Load past searches on page load
loadPastSearches();