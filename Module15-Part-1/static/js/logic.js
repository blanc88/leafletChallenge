console.log()

// map object
let map = L.map('map',  {
    center: [39.82860130003183, -98.5794689733809],
    zoom: 5,
    layers: []
  });

// add layer/map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// grab data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// map styling
let mapStyle = {
    color: 'red',
    fillColor: 'orange',
    fillOpacity: 0.4,
    weight: 1.2
}

// function to choose color based on depth
function chooseColor(depth){
    if(depth <= 10) return 'blue';
    else if(depth > 10 && depth <= 30) return "purple";
    else if(depth > 30 && depth <= 50) return 'red';
    else if(depth > 50 && depth <= 70) return 'orange';
    else if(depth > 70 && depth <= 90) return 'green';
    else return 'black';
    
}


//read in data
d3.json(url).then(function(data) {

    for (let i = 0; i < data.features.length; i++) {
        let earthquakes = data.features[i];
        let coordinates = earthquakes.geometry.coordinates;
        let mag = earthquakes.properties.mag;
        let time = earthquakes.properties.time;
        let date = new Date(time);
        let humanReadableDate = date.toLocaleString();  
        let depth = earthquakes.geometry.coordinates[2]
        let size = mag * 5;
        let markerColor = chooseColor(depth);


        let marker = L.circleMarker([coordinates[1],coordinates[0]], {
            radius: size,
            color: markerColor,
            fillOpacity: 0.5
        }).bindPopup(`<h3>${earthquakes.properties.title}</h3>
            <hr>
            <p><b>Location:</b> ${earthquakes.properties.place}</p> 
            <p><b>Time:</b> ${humanReadableDate}</p>
            <p><b>Depth:</b> ${depth}</p>
            <p><b>Magnitude:</b> ${mag}</p>       
        `).addTo(map);
    
}

// create legend
let legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    let ranges = ["blue", "purple", "red", "orange", "green", "black"];
    let legendInfo = "";
    labels.forEach(function(label, i) {
        let color = ranges[i];
        legendInfo += `<div class='legend-color-box' style='background-color: ${color}'></div><span>${label}</span><br>`;
    });
    div.innerHTML = legendInfo;
    return div;
};      

legend.addTo(map);

});