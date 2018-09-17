const axios = require('axios');

function getWeatherData(city){
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=e8f06a17c960ddb6a8bcc6b90aba9aae`);
}

function getWatherForecast(weatherData, city) {

  let serializedData = serializeData(weatherData, city);
  let forecastData = [];
  let currentDay =serializedData[0].weatherDate.split(' ')[0].split('-')[2];
  let tempWeatherArray = [];

  for(let item of serializedData) {
    if(item.weatherDate.split(' ')[0].split('-')[2] === currentDay){
      tempWeatherArray.push(item);
    } else {
      forecastData.push(tempWeatherArray);
      tempWeatherArray = [];
      currentDay = item.weatherDate.split(' ')[0].split('-')[2];
      tempWeatherArray.push(item);
    }
  }

  if(forecastData[0].length < 8){
    let lackingDays = 8 - forecastData[0].length;

    for(let i =0; i < lackingDays; i++){
      forecastData[0].push(forecastData[1][i]);
    }
  }

  return forecastData;
}

function getTodayWeather(weatherData, city) {
  let serializedData = serializeData(weatherData, city);
  let forecastData = [];

  for(let i = 0; i < 8; i++) {
    forecastData.push(serializedData[i]);
  }

  return forecastData;
}

function serializeData(weatherList, city) {

  let serializedData = []

  for(let i = 0; i < weatherList.length; i++) {

    let weatherData = {
      city,
      humidity: weatherList[i]["main"]["humidity"],
      temperature: weatherList[i]["main"]["temp"],
      pressure: weatherList[i]["main"]["pressure"],
      weatherCondition: weatherList[i]["weather"][0]["main"],
      windSpeed: weatherList[i]["wind"]["speed"],
      windDirection: weatherList[i]["wind"]["deg"],
      weatherDate: weatherList[i]["dt_txt"]
    }

    serializedData.push(weatherData);
  }

  return serializedData;
}

module.exports = {
  getWeatherData,
  getWatherForecast,
  getTodayWeather
}