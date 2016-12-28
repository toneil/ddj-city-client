const L = require('leaflet');
const styling = require('./styling');
const api = require('./api');
const logic = require('./logic');

const map = L.map('ddj-map').setView([25, 34], 4);
const markersLayer = new L.LayerGroup().addTo(map);

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const onEachFeature = (map, markersLayer) =>
    (feature, layer) => {
        layer.on({
            mouseover: styling.highlight,
            mouseout: styling.resetHighlight,
            click: (e) => {
                logic.selectCountry(e, map, markersLayer);
                styling.selectCountry(e, map);
            },
        });
    };

api.globalData().then(({worldData, geojson}) => {
    L.geoJson(geojson, {
        onEachFeature: onEachFeature(map, markersLayer),
        style: (feature) => styling.styleCountry(feature, worldData),
    }).addTo(map);
});
