const request = require('request-promise');

const requestOptions = {};
const {
    API_KEY = 'YOUR API KEY',
    latitude = 32.07682,
    longitude = 34.79278
} = requestOptions;

async function getWeather() {
    const weatherURL = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}?units=ca`;
    try {
        return await request.get(weatherURL, {json: true});
    } catch (e) {
        throw  e;
    }
}

module.exports = {
    getWeather
};
