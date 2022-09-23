// Global Variables
const searchBar = document.querySelector('#input-city');
const submitBtn = document.querySelector('#submitBtn');
const cityName = document.querySelector('#city-name');
const temp = document.querySelector('#temp');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const date = $('#date');
const weatherIcon = $('#weather-icon');
const forecastDiv = document.querySelector('#forecast-div');
const searchHistory = document.querySelector('#search-history');

const apiKey = '9a0e69caa74173c0114ce7fbdff85d61';
const apiKey2 = '7bc24c01b2e153d36807a1d6904b8e37';

// Empty object to be used within local storage functions
let cityList = [];

// Function to pull data from API based on user input
function getCityChoice(){

    var cityNameURL = 'https://api.openweathermap.org/data/2.5/weather?q='+searchBar.value+'&APPID='+apiKey;
    // fetch the URL require longitude and latitude for forecast, therefore require that data from intial API call.
    return fetch(cityNameURL)    
        .then(function(response){
            // turn top JSON format
            return response.json()
        })
        // Pull data from response (longitude and latitude)
        .then(function(result){
            console.log(result);
            const lat = result.coord.lat
            console.log(lat);
            const lon = result.coord.lon
            console.log(lon);
    
            var lonLatURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&exclude=hourly,minutely&appid=" + apiKey;
            console.log(lonLatURL);
            // fetch URL with Longitute and latitude
            return fetch(lonLatURL)
            .then(function(response){
                return response.json();
            })
        })
        // 
        .then(function(result){
            console.log(result);
            //declare variables for each required piece of information for Current weather
            var nameValue = result.city.name
            console.log(nameValue);
            var iconValue = result.list[1].weather[0].icon
            console.log(iconValue);
            var iconUrl = "http://openweathermap.org/img/wn/"+iconValue+".png"
            console.log(iconUrl);
            var tempValue = result.list[0].main.temp_max;
            console.log(tempValue)
            var tempValueFix = tempValue.toFixed(2);
            var humidValue = result.list[1].main.humidity;
            var windValue = result.list[1].wind.speed;
            var iconImg = $("#weather-icon").html("<img src='" + iconUrl + "'>");
            var rightNow = moment().format("dddd, MMMM Do YYYY");

               
            // display content in already created HTML elements.
            cityName.textContent = nameValue;
            temp.textContent = ("Temp: "+ (tempValueFix) + "C");
            wind.textContent = ("Wind Speed: " + windValue + " M/S");
            humidity.textContent = ("Humidity: "+ humidValue + "%");
            date.text(rightNow)
            weatherIcon.textContent = iconImg;
            
            // Require a for loop to pull specific data from API for 5 days
            for (let i = 6; i < 40; i++) {
            
                // check for specific parameters. API provides a 5day forecast every 3hrs, therefore require every 6th list item.
                if (result.list[i].dt_txt.includes("12:00:00")) {

                    
                    let dateFive = result.list[i].dt;
                    let iconFive = result.list[i].weather[0].icon;
                    console.log(iconFive);
                    let tempFive = result.list[i].main.temp_max;
                    let humidFive = result.list[i].main.humidity;
                    let windFive = result.list[i].wind.speed;
                    
                    // create div element for content to go inside
                    var forecastCard = document.createElement("div");
                    
                    // add HTML with bootstrap classes to add card content and style
                    forecastCard.innerHTML = `
                    <div class="card-body d-flex flex-wrap border-light mb-3 bg-dark p-2 text-light rounded">
                    <h4 class="col-sm">${moment.unix(dateFive).format("ll")}
                    <h4 class="col-sm">Temp: ${tempFive}&#176;C
                    <h4 class="col-sm">Humidity: ${humidFive}%
                    <h4 class="col-sm">Wind speed: ${windFive}
                    <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${iconFive}@4x.png">
                    </div>
                    `;
                    
                    // append card to div already created in HTML
                    forecastDiv.appendChild(forecastCard);
                };
                
            }
        

        })
    
   
         
}

var storePreviousSearches = function(event){
    if(localStorage.getItem('cityList')){
        // get values from local storage
        var storedCities = JSON.parse(localStorage.getItem('cityList'));
        // add city from local storage to city list object declared globally
        storedCities.push({name: searchBar.value});
        cityList = storedCities;
        // save amended object to local storage
        localStorage.setItem('cityList', JSON.stringify(storedCities));
    } else {
        var storedCities = [{name: searchBar.value}]
        localStorage.setItem('cityList', JSON.stringify(storedCities));
    }
    console.log('StoreCityLength', cityList.length)
}

function displayPreviousSearches(event){
    searchHistory.textContent = "";
    // for loop to display each item in local storage as a button beginning from the last in length to show most recent first.
    for (let i = cityList.length -1; i >= 0; i--) {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("history-btn", "btn-dark", "rounded", "p-1", "m-1");
        btn.setAttribute("id", "previousCityBtn");
        btn.setAttribute("data-search", cityList[i]);
        btn.textContent = cityList[i].name;

        searchHistory.append(btn);
        
    }
}

// activates submit button
submitBtn.addEventListener('click', function(event){
    
    storePreviousSearches(event);
    displayPreviousSearches(event);
    getCityChoice();
    

})

// allows local storage to display upon opening of app
function initSearchHistory(){
    var searchHistory = localStorage.getItem('cityList');
    if (searchHistory){
        cityList = JSON.parse(searchHistory);

    }
    let event;
    displayPreviousSearches(event);
}


// repeat function when history buttons are clicked 
$(function(){
    $(".history-btn").click(function(){
        var previousSearch = $(this).html()
        console.log(previousSearch);
        return fetch('https://api.openweathermap.org/data/2.5/weather?q='+previousSearch+'&APPID='+apiKey)
        .then(function(response){
            return response.json();
        })
        .then(function(result){
            console.log(result);
            const lat = result.coord.lat
            console.log(lat);
            const lon = result.coord.lon
            console.log(lon);
            var lonLatURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&exclude=hourly,minutely&appid=" + apiKey;
            console.log(lonLatURL);
            return fetch(lonLatURL)
            .then(function(response){
                return response.json();
            })
            .then(function(result){
                console.log(result);
                var nameValue = result.city.name
                console.log(nameValue);
                var iconValue = result.list[1].weather[0].icon
                console.log(iconValue);
                var iconUrl = "http://openweathermap.org/img/wn/"+iconValue+".png"
                console.log(iconUrl);
                var tempValue = result.list[0].main.temp_max;
                console.log(tempValue)
                var tempValueFix = tempValue.toFixed(2);
                var humidValue = result.list[1].main.humidity;
                var windValue = result.list[1].wind.speed;
                var iconImg = $("#weather-icon").html("<img src='" + iconUrl + "'>");
                var rightNow = moment().format("dddd, MMMM Do YYYY");
    
                   
            
                cityName.textContent = nameValue;
                temp.textContent = ("Temp: "+ (tempValueFix) + "C");
                wind.textContent = ("Wind Speed: " + windValue + " M/S");
                humidity.textContent = ("Humidity: "+ humidValue + "%");
                date.text(rightNow)
                weatherIcon.textContent = iconImg;
                
                for (let i = 6; i < 40; i++) {
                
    
                    if (result.list[i].dt_txt.includes("12:00:00")) {
    
                        
                        let dateFive = result.list[i].dt;
                        let iconFive = result.list[i].weather[0].icon;
                        console.log(iconFive);
                        let tempFive = result.list[i].main.temp_max;
                        let humidFive = result.list[i].main.humidity;
                        let windFive = result.list[i].wind.speed;
                        
                        var forecastCard = document.createElement("div");
                        
                        forecastCard.innerHTML = `
                        <div class="card-body d-flex flex-wrap border-light mb-3 bg-success p-2 text-dark bg-opacity-25 rounded">
                        <h4 class="col-sm">${moment.unix(dateFive).format("ll")}
                        <h4 class="col-sm">Temp: ${tempFive}&#176;C
                        <h4 class="col-sm">Humidity: ${humidFive}%
                        <h4 class="col-sm">Wind speed: ${windFive}
                        <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${iconFive}@4x.png">
                        </div>
                        `;
                        
                        forecastDiv.appendChild(forecastCard);
                    };
                    
                }
            
    
            })
        })

    })
})

initSearchHistory();



// When the User searches for a city
    // Presented with current conditions
        // Including:
        // Name of city,
        // Today's date
        // An Icon representing conditions,
        // current temperature,
        // humidity
        // wind speed
        // UV index
            // Colour coded to favorable, moderate or severe
    // Presented with a 5 day forecast
        // Including:
        // Date,
        // Icon representing conditions
        // Temperature
        // Wind speed
        // humidity
// When the user clicks on a city inside the search history
    // Again shown current and future conditions for that city
