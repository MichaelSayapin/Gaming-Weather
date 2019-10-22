const darkSkyReader = require('./darkSky');

const WeatherWriter = require('./metricsWriter');
const weatherDataWriter = new WeatherWriter();

const READER = {
    'DarkSky': {read: darkSkyReader.getWeather, write: weatherDataWriter},
};

const handler = async () => {
    await Promise.all(Object.entries(READER).map(async reader => {
        try {
            console.info(`Fetching INFO for ${reader[0]}`);
            const data = await reader[0].read();
            await reader[1].write.distributeData(data);
            console.info(`Fetching INFO for ${reader[0]} is done`);
        } catch (e) {
            console.error(`ERROR getting data for ${reader[0]}`, e);
        }
    }));
};
module.exports = {
    handler
};
