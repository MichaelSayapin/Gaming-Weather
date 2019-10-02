const Influx = require('influx');
const unix = require('unix-timestamp');

class MetricsWriter {
    constructor() {
        this.influx = new Influx.InfluxDB({
            host: 'localhost',
            database: 'gaming_weather',
            schema: [{
                fields: {
                    currentTemperature: Influx.FieldType.FLOAT,
                    currentHumidity: Influx.FieldType.FLOAT,
                    currentWindSpeed: Influx.FieldType.FLOAT,
                    currentUVIndex: Influx.FieldType.INTEGER,
                    currentCloudCover: Influx.FieldType.FLOAT,
                    forecastTemperature: Influx.FieldType.FLOAT,
                    forecastHumidity: Influx.FieldType.FLOAT,
                    forecastWindSpeed: Influx.FieldType.FLOAT,
                    forecastUVIndex: Influx.FieldType.INTEGER,
                    forecastCloudCover: Influx.FieldType.FLOAT,
                    amountOfSnow: Influx.FieldType.FLOAT,
                    amountOfRain: Influx.FieldType.FLOAT,
                    chanceOfOccurrence: Influx.FieldType.FLOAT,
                },
                tags: [
                    'weatherType'
                ]
            }]
        });
    }

    async writeMetrics(measurement, tags, fields, time) {
        try {
            await this.influx.writePoints([
                {
                    measurement: measurement,
                    tags: tags,
                    fields: fields,
                    timestamp: time
                }
            ]);
        } catch (e) {
            console.error(e);
        }
    }

    distributeData(inserts) {
        // Writing current weather to InfluxDB
        const {
            apparentTemperature: currentTemperature,
            humidity: currentHumidity,
            windSpeed: currentWindSpeed,
            uvIndex: currentUVIndex,
            cloudCover: currentCloudCover,
            time
        } = inserts.currently;
        this.writeMetrics('current_weather', {}, {
            currentTemperature,
            currentHumidity,
            currentWindSpeed,
            currentUVIndex,
            currentCloudCover
        }, unix.toDate(unix.add(time, '+10h')));

        // Writing forecast weather of the next 48 hours to InfluxDB
        inserts.hourly.data.map(hour => {
            const {
                temperature: forecastTemperature,
                humidity: forecastHumidity,
                windSpeed: forecastWindSpeed,
                uvIndex: forecastUVIndex,
                cloudCover: forecastCloudCover,
                time
            } = hour;
            this.writeMetrics('hourly_weather', {}, {
                forecastTemperature,
                forecastHumidity,
                forecastWindSpeed,
                forecastUVIndex,
                forecastCloudCover
            }, unix.toDate(unix.add(time, '+10h')));
        });

        // Writing forecast for the next 7 days to InfluxDB
        inserts.daily.data.map(day => {
            const {
                precipAccumulation: amountOfSnow = 0,
                precipIntensity: amountOfRain,
                precipProbability: chanceOfOccurrence,
                precipType: weatherType,
                time
            } = day;
            this.writeMetrics('daily_weather', {weatherType}, {
                amountOfSnow,
                amountOfRain,
                chanceOfOccurrence
            }, unix.toDate(unix.add(time, '+10h')));
        });
    }
}

module.exports = MetricsWriter;
