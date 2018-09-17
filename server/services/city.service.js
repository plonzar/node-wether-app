const axios = require('axios');

function getCityList(citySearchParam) {
  return axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${citySearchParam}&types=(cities)&key=AIzaSyByKrppXU9rxccsUhMZjIbAsFKrUh1TdrY&language=en`);
}

module.exports = {
  getCityList
}
