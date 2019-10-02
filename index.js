const darkSkyReader = require('./metricReaders/dashboards/darkSky.js');

const MetricsWriter = require('./metricsWriter.js');
const weatherMetricWriter = new MetricsWriter();

const READERS = {
    'DarkSky': {read: darkSkyReader.getWeather, write: weatherMetricWriter},
};

const handler = async () => {
    await Promise.all(Object.entries(READERS).map(async reader => {
        try {
            console.info(`INFO data for ${reader[0]}`);
            reader[1].read(data => {
                reader[1].write.distributeData(data);
                console.info(`INFO done for ${reader[0]}`);
            });
        } catch (e) {
            console.error(`ERROR getting data for ${reader[0]}`, e);
        }
    }));
};
module.exports = {
    handler
};
