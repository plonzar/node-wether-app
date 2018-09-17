const path = require('path');
const express = require('express');
const http = require('http');
//const cors = require('cors');
const cityService = require('./services/city.service');
const weatherService = require('./services/weather.service');
const bodyParser = require('body-parser');

//const hbs = require('hbs');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//app.set('view engine', 'hbs');
//hbs.registerPartials(path.join(__dirname, '../views/partials'));

//only for development
//app.use(cors());


app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`)
});

app.get('/api/cities/:cityParam', (req, res) => {
  let searchParam = req.params['cityParam'];

  if (searchParam != undefined) {
    cityService.getCityList(searchParam)
      .then(
        (response) => {
          let responseData = [];


          for (let info of response.data.predictions) {
            let infoArray = String(info.description).split(',').map(x => x.trim());

            let cityData = {
              name: infoArray[0],
              country: infoArray[1]
            };

            responseData.push(cityData);
          }

          res.status(200).send(responseData);
        },
        (err) => {
          console.log(err)
          res.status(400).send(err);
        })
      .catch(
        (err) => {
          console.log(err)
          res.status(500).send(err);
        });

  } else
    res.status(400).send({ message: 'bad parameter' });
});

app.get('/api/weatherForecast/:city', (req, res) => {
  let searchParam = req.params['city'];

  if (searchParam != undefined) {
    weatherService.getWeatherData(searchParam)
      .then(
        (response) => {
          let forcastData = weatherService.getWatherForecast(response.data.list, searchParam);
          res.status(200).send(forcastData);
        },
        (err) => {
          console.log(err)
          res.status(400).send(err);
        })
      .catch(
        (err) => {
          console.log(err)
          res.status(500).send(err);
        });

  } else
    res.status(400).send({ message: 'bad parameter' });
});

app.get('/api/todayWeather/:city', (req, res) => {
  let searchParam = req.params['city'];

  if (searchParam != undefined) {
    weatherService.getWeatherData(searchParam)
      .then(
        (response) => {
          let forcastData = weatherService.getTodayWeather(response.data.list, searchParam);
          res.status(200).send(forcastData);
        },
        (err) => {
          console.log(err)
          res.status(400).send('city not found');
        })
      .catch(
        (err) => {
          console.log(err)
          res.status(500).send('internal error');
        });
  } else
    res.status(400).send({ message: 'no parameter' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));