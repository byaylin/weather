var key = '8ac71f89ab787e646c3057d3bb3b70fb';

var searchForm = document.querySelector('form');
var searchInput = document.querySelector('#search');
var searchBtn = document.querySelector('#searchBtn');
var cityList = document.querySelector('#buttonList');

//current city weather variable
var currentSection = document.querySelector('section');
var citySelected = document.querySelector('#city');
var date = document.querySelector('#date');
var icon = document.querySelector('#weatherIcon')
var cityTemp = document.querySelector('#temp');
var cityWeather = document.querySelector('#weather');
var cityWind = document.querySelector('#wind');
var cityHumidity = document.querySelector('#humidity');

//forecast variables
var forecastDate = document.querySelector('#forecastDate');
var forecastWeather = document.querySelector('#forecastWeather');
var forecastTemp = document.querySelector('#forecastTemp');
var forecastWind = document.querySelector('#forecastWind');
var forecastHumidity = document.querySelector('#forecastHumidity');
var forecastIcon = document.querySelector('#forecastIcon');

function getWeather() {
    currentSection.setAttribute("id", "")

    const citySearchVal = searchInput.value;
    const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchVal}&appid=${key}&units=imperial`
    
    console.log(citySearchVal)

    fetch(cityURL).then(res => res.json()).then(data => {
        lat = data.coord.lat;
        lon = data.coord.lon;

        const geoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

        fetch(geoURL).then(res => res.json()).then(data => {
            const city = data.name;
            const country = data.sys.country;
            const temp = data.main.temp;
            const weather = data.weather[0].main;
            const weatherIcon = data.weather[0].icon;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            citySelected.textContent = city + ', ' + country;
            cityTemp.textContent = 'Current Temperature: ' + temp + '°F';
            cityWeather.textContent = 'Weather: ' + weather;
            cityWind.textContent = 'Wind Speed: ' + windSpeed + 'mph';
            cityHumidity.textContent = 'Humidity: ' + humidity + '%';
            icon.src = 'http://openweathermap.org/img/w/' + weatherIcon + '.png'
        })
    
        //forecast
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
        
        fetch(forecastURL).then(res => res.json()).then((data) => {
            const forecastDays = document.querySelectorAll('.grid');

            for(let i = 0; i < forecastDays.length; i++){
                forecastDays[i].innerHTML='';
                const forecastIndex = i * 8 + 4;

                var icon = data.list[forecastIndex].weather[0].icon;
                var forecastIconEl = document.createElement("img");
                forecastIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
                forecastDays[i].append(forecastIconEl);


                var temperature = data.list[forecastIndex].main.temp;
                var forecastTempEl = document.createElement("p");
                forecastTempEl.textContent = ("Temperature: " + temperature + "\u00B0");
                forecastDays[i].append(forecastTempEl);

                var wind = data.list[forecastIndex].wind.speed;
                var forecastWindEl = document.createElement("p");
                forecastWindEl.textContent = ("Wind: " + wind + " MPH");
                forecastDays[i].append(forecastWindEl);

                var humidity = data.list[forecastIndex].main.humidity;
                var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = ("Humidity: " + humidity);
                forecastDays[i].append(forecastHumidityEl);
            }
        })
    })
}

                  

//saves previous search history
function recentSearch() {
    const searchInputVal = document.querySelector("#search").value;
    const citySearchArr = JSON.parse(localStorage.getItem("city-search")) || [];
    const searchHistoryBtn = document.createElement("button");
    
    searchHistoryBtn.textContent = searchInputVal;
    document.querySelector("#buttonList").appendChild(searchHistoryBtn);
    searchHistoryBtn.addEventListener("click", renderCity);

    citySearchArr.push(searchInputVal);
    localStorage.setItem("city-search", JSON.stringify(citySearchArr));
}

function renderCity(event) {
    event.preventDefault();
    searchInput.value = event.target.textContent;
    getWeather();
    clearSubmit();
}

//clear input form
function clearSubmit() {
    document.querySelector("#search").value=('');
}

//event listeners for search button
searchBtn.addEventListener("click", function (event){
    event.preventDefault();
    recentSearch();
    getWeather();
    clearSubmit();
})