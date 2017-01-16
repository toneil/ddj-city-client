const _ = require('lodash');

const getColor = (r) => {
    if (!r || r === '-')
        return 'gray';
    return  r >=1000000 ? '#993404' :
            r > 500000  ? '#d95f0e' :
            r > 100000  ? '#fe9929' :
            r > 50000 ? '#fed98e' :
            r > 1000 ? '#ffffd4' :
            '#ffffff';
};

const fillColor = (feature, worldData) => {
    const iso2 = feature.properties.iso2;
    const country = _.find(worldData, c => c.iso2 === iso2);
    return getColor(country.total_poc);
};

const incidentDot = (incident) => {
    const r = Math.sqrt(incident.best_est);
    return {
        color: 'red',
        radius: r,
        weight: 1,
    };
};

const cityCircle = (city) => {
    const color = 'blue';
    const fillColor = 'white';
    const radius = 5000 + Math.sqrt(city.population) * 20;
    return {
        color,
        fillColor,
        weight: 1,
        fillOpacity: 0.2,
        radius,
    };
};

const styleCountry = (feature, worldData) => ({
    fillColor: fillColor(feature, worldData),
    weight: 2,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7,
});

const highlight = (e) => {
    const layer = e.target;
    layer.setStyle({
        weight: 5,
        fillOpacity: 0.3,
    });
};

const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle({
        weight: 2,
        fillOpacity: 0.7
    });
};

const selectCountry = (e, map) => {
    map.fitBounds(e.target.getBounds());
};

module.exports = {
    getColor,
    incidentDot,
    styleCountry,
    cityCircle,
    highlight,
    resetHighlight,
    selectCountry,
};
