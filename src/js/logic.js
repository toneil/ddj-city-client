const $ = require('jquery');
const L = require('leaflet');
const _ = require('lodash');
const Chart = require('chart.js');
const Promise = require('bluebird');

const api = require('./api');
const styling = require('./styling');

const addIncident = (incident, markersLayer) => {
    const dot = L.circle([incident.latitude, incident.longitude],
        styling.incidentDot(incident)
    ).addTo(markersLayer);
};

const addCity = (city, markersLayer) => {
    const circle = L.circle([city.latitude, city.longitude],
        styling.cityCircle(city)
    ).addTo(markersLayer);
    circle.bindPopup(`
        <strong>${city.name}</strong>
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
                    fill: false,
                    borderWidth: 5,
                    lineTension: 0,
                    borderColor: 'rgba(156, 39, 176,0.5)',
                    data: _
                        .chain(stats)
                        .keys()
                        .sort()
                        .map(k => stats[k].refugees)
                        .value()
                }, {
                    label: 'IDPs',
                    fill: false,
                    borderWidth: 5,
                    lineTension: 0,
                    borderColor: 'rgba(255,160,0,0.5)',
                    data: _
                        .chain(stats)
                        .keys()
                        .sort()
                        .map(k => stats[k].idps)
                        .value()
                }, {
                    label: 'Other PoC',
                    fill: false,
                    borderWidth: 5,
                    lineTension: 0,
                    borderColor: 'rgba(54,160,0,0.5)',
                    data: _
                        .chain(stats)
                        .keys()
                        .sort()
                        .map(k => stats[k].poc)
                        .value()
                }]
            },
            options: {
                showLines: true,
                scales: {
                    yAxes: [{
                        stacked: false,
                    }]
                }
            }
        });
    });
};

const updateInfoHeader = (countryData) => {
    const { name, population } = countryData;
    $('#ddj-infobar-header-name').text(name);
};

const setRefugeeInfoBar = (total, ratio) => {
    $('#ddj-infobar-header-ratio').text(ratio.toFixed(2));
    $('#ddj-infobar-header-total').text(total);
};

const selectCountry = (e, map, markersLayer) => {
    $('#ddj-infobar').css('visibility', 'visible');
    $('#ddj-spinner-container').css('display', 'block');
    markersLayer.clearLayers();
    const { iso2 } = e.target.feature.properties;
    setChart(iso2);
    const fethcRefugees = api.getRefugeeStats(iso2)
        .then(stats => {
            if (!stats) return;
            const year = '2014';
            if (stats.hasOwnProperty(year)) {
                const { idps, poc, refugees }  = stats[year];
                const total = idps + poc + refugees;
                const ratio = idps / (refugees + 1);
                setRefugeeInfoBar(total, ratio);
            }
        });
    const fetchIncidents = api.getIncidents(iso2)
        .then(incidents => {
            _.forEach(incidents, incident => {
                addIncident(incident, markersLayer);
            });
        });
    const fetchCountryData = api.getCountryData(iso2)
        .then(countryData => {
            updateInfoHeader(countryData);
            _.forEach(countryData.cities, c => {
                addCity(c, markersLayer);
            });
        });
    Promise
        .all([fethcRefugees, fetchIncidents, fetchCountryData])
        .then(() => $('#ddj-spinner-container').css('display', 'none'));
};

module.exports = {
    selectCountry,
};
