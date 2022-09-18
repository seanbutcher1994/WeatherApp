const searchBar = document.querySelector('#input-city');
const submitBtn = document.querySelector('#submitBtn');
const cityName = document.querySelector('#city-name');
const temp = document.querySelector('#temp');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const date = $('#date');
const weatherIcon = $('#weather-icon');

const apiKey = '9a0e69caa74173c0114ce7fbdff85d61';
const apiKey2 = '7bc24c01b2e153d36807a1d6904b8e37';

submitBtn.addEventListener('click', function(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+searchBar.value+'&APPID='+apiKey)
        .then(function(response){
            return response.json()
        })
        // .then(function(result){
        //     console.log(result);
        //     const lat = result.coord.lat;
        //     console.log(lat);
        //     const lon = result.coord.lon;
        //     console.log(lon);
        //     const currentURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+ apiKey;
        //     console.log(currentURL);
        //  return fetch(currentURL)
         
        // })
        // .then(function(response){
        //     console.log(response);
        //    return response.json();
        // })
        // .then(function(result){
        //     console.log(result);
        // })
    
        .then(function(data){
            console.log(data);
            var nameValue = data.name;
            var iconValue = data.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/"+iconValue+".png"
            console.log(iconValue);
            var tempValue = data.main.temp;
            var tempValueFix = tempValue.toFixed(0);
           
            var humidValue = data.main.humidity;
            var windValue = data.wind.speed;
            var iconImg = $("#weather-icon").html("<img src='" + iconUrl + "'>");
            var rightNow = moment().format("dddd, MMMM Do YYYY");
            cityName.textContent = nameValue;
            temp.textContent = ("Temp: "+ (tempValueFix - 273) + "C");
            wind.textContent = windValue;
            humidity.textContent = ("Humidity: "+ humidValue + "%");
            date.text(rightNow)
            weatherIcon.textContent = iconImg;

         })
    
    

})




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
