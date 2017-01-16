const $ = require('jquery');
const parse = require('csv-parse');

const geoJsonUrl = 'data/countryshapes.geojson';
const worldDataUrl = 'data/worldData.json';
const refugeeUrl = 'data/refugeesByCountryAndYear.json';
const incidentsUrl = (iso2) => `http://ddjapi.grafsmedjan.se/incidents/${iso2}`;
const countryUrl = (iso2) => `http://ddjapi.grafsmedjan.se/country/${iso2}`;

const globalData = () => new Promise((resolve, reject) => {
    $.getJSON(geoJsonUrl, (geojson) => {
        $.getJSON(worldDataUrl, (worldData) => {
            resolve({
                geojson,
                worldData,
            });
        });
    });
});

const getCountryData = (iso2) => new Promise((resolve, reject) => {
    $.getJSON(countryUrl(iso2), (countryData) => {
        resolve(countryData);
    });
});

const getIncidents = (iso2) => new Promise((resolve, reject) => {
    $.getJSON(incidentsUrl(iso2), (incidents) => {
        resolve(incidents);
    });
});

const getRefugeeStats = (iso2) => new Promise((resolve, reject) => {
    $.getJSON(refugeeUrl, (refugeeData) => {
        resolve(refugeeData[iso2]);
    });
});

module.exports = {
    getIncidents,
    getCountryData,
    globalData,
    getRefugeeStats,
};
