const request = require('request');

const requestOptions = {};
const {
    API_KEY = 'cc2f1950ce7678ce3a3b78a7d97d999b',
    latitude = 32.07682,
    longitude = 34.79278
} = requestOptions;

function getWeather(callback) {
    const weatherURL = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}?units=si&exclude=minutely`;

    request.get(weatherURL, {json: true}, (error, {body}) => {
        if (error) {
            console.info('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            console.info('Unable to find location!', undefined);
        } else {
            callback(body);
        }
    });
}

module.exports = {
    getWeather
};
