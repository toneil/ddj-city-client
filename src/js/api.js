const $ = require('jquery');
const parse = require('csv-parse');

const geoJsonUrl = 'data/countryshapes.geojson';
const worldDataUrl = 'data/worldData.json';
const countryUrl = (iso2) => `http://ddjapi.grafsmedjan.se/country/${iso2}?minCas=10&minInc=5&range=100&from=1995&to=2015`;
const refugeeUrl = (iso2) => `http://ddjapi.grafsmedjan.se/refugees/${iso2}`;

const getCountry = (iso2) => new Promise((resolve, reject) => {
    $.getJSON(countryUrl(iso2), (countryData) => {
        resolve(countryData);
    });
});

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

const getRefugeeStats = (iso2) => new Promise((resolve, reject) => {
    $.get(refugeeUrl(iso2), (refugeeData) => {
        resolve(refugeeData);
    });
});

module.exports = {
    globalData,
    getCountry,
    getRefugeeStats,
};
