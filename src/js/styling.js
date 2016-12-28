const _ = require('lodash');

const fillColor = (feature, worldData) => {
    const iso2 = feature.properties.iso2;
    const country = _.find(worldData, c => c.iso2 === iso2);
    const r = country.ratio;
    if (!r)
        return 'gray';
    return r >= 1 ? '#800026' :
         r > 0.8  ? '#BD0026' :
         r > 0.6  ? '#E31A1C' :
         r > 0.4  ? '#FC4E2A' :
         '#FD8D3C' ;
};

const cityCircle = (city, inConflict) => {
    const color = inConflict ? 'red' : 'blue';
    const fillColor = inConflict ? 'black' : 'white';
    const radius = 5000 + Math.sqrt(city.population) * 20;
    return {
        color,
        fillColor,
        weight: 1,
        fillOpacity: 0.9,
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
    styleCountry,
    cityCircle,
    highlight,
    resetHighlight,
    selectCountry,
};
