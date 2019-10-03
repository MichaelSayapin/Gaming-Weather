const request = require('request');

const requestOptions = {};
const {
    API_KEY = 'YOUR API KEY',
    latitude = 32.07682,
    longitude = 34.79278
} = requestOptions;

function getWeather(callback) {
    const weatherURL = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}?units=ca`;

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
