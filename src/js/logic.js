const $ = require('jquery');
const L = require('leaflet');
const _ = require('lodash');
const Chart = require('chart.js');

const api = require('./api');
const styling = require('./styling');

const addCircle = (city, inConflict, markersLayer) => {
    const circle = L.circle([city.latitude, city.longitude],
        styling.cityCircle(city, inConflict)
    ).addTo(markersLayer);
    const conflictString = inConflict ? 'Has seen conflict since 1995' : 'Has not seen conflict since 1995';
    circle.bindPopup(`
        <strong>${city.name}</strong>
        <hr/>
        <em>${conflictString}</em>
        <br/>
        <span>Population: ${city.population}</span>
    `);
};

const resetCanvas = () => {
    $('#ddj-graph').remove(); // this is my <canvas> element
    $('#ddj-graph-container').append('<canvas id="ddj-graph"><canvas>');
    const canvas = document.querySelector('#ddj-graph');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = $('#ddj-graph-container').width();
    ctx.canvas.height = $('#ddj-graph-container').height();
    return ctx;
};

const setChart = (iso2) => {
    api.getRefugeeStats(iso2)
    .then(stats => {
        const ctx = resetCanvas();
        const years = _.keys(stats);
        const refugeeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Refugees',
                    fill: true,
                    lineTension: 0,
                    backgroundColor: 'rgba(156, 39, 176,0.5)',
                    data: _
                        .chain(stats)
                        .keys()
                        .sort()
                        .map(k => stats[k].refugees)
                        .value()
                }, {
                    label: 'IPDs',
                    fill: true,
                    lineTension: 0,
                    backgroundColor: 'rgba(255,160,0,0.5)',
                    data: _
                        .chain(stats)
                        .keys()
                        .sort()
                        .map(k => stats[k].idps)
                        .value()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    });
};

const updateInfoHeader = (countryData) => {
    const { confCities, safeCities, name, population } = countryData;
    const ratio = confCities.length + safeCities.length > 0 ?
        confCities.length / (confCities.length + safeCities.length) :
        0;
    const ratioString = (ratio * 100).toFixed(0);
    $('#ddj-infobar-header-name').text(name);
    $('#ddj-infobar-header-ratio').text(`${ratioString}%`);
};

const selectCountry = (e, map, markersLayer) => {
    $('#ddj-infobar').css('visibility', 'visible');
    $('#ddj-spinner-container').css('display', 'block');
    markersLayer.clearLayers();
    const { iso2 } = e.target.feature.properties;
    setChart(iso2);
    api.getCountry(iso2)
    .then(countryData => {
        $('#ddj-spinner-container').css('display', 'none');
        updateInfoHeader(countryData);
        countryData.confCities.forEach(
            city => addCircle(city, true, markersLayer));
        countryData.safeCities.forEach(
            city => addCircle(city, false, markersLayer));
    });
};

module.exports = {
    selectCountry,
};
