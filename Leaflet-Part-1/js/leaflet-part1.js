// API for all Earthquakes in the past 30 days
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create color scales
function getColor(d) {
    return d > 90 ? '#800026' :
           d > 70  ? '#BD0026' :
           d > 50  ? '#618685' :
           d > 30  ? '#80ced6' :
           d > 10   ? '#b1cbbb' :
           d > -10   ? '#d5f4e6' :
                      '#fefbd8';
};

d3.json(baseURL).then(function(response) {
    // Create the map object to match bounds in API
    var myMap = L.map("map", {
        center: [40.737, -120.3736],
        zoom: 5
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Loop through API
    for (var i= 0; i < response.features.length; i++){
        // Create circles
        var details = response.features[i].properties
        var location = response.features[i].geometry
        var coord_point = [location.coordinates[1], location.coordinates[0]]

        
        var color = "";
        if (location.coordinates[2] <=10) {
            color="#fefbd8";
        }
        else if (location.coordinates[2] <= 30) {
            color="#d5f4e6";
        }
        else if (location.coordinates[2] <= 50) {
            color = "#b1cbbb";
        }
        else if (location.coordinates[2] <= 70) {
            color = "#80ced6";
        }
        else {
            color = "#618685";
        }

        L.circle(coord_point, {
            fillOpacity: 0.90,
            color: "black",
            fillColor: getColor(location.coordinates[2]),
            radius: Math.pow(details.mag, 3) * 1000,
            weight: 1
        }).bindPopup(`<h1>${details.place}</h1>`).addTo(myMap);

    }
    // Create a Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (MyMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 20) + '"></i> ' +
            grades[i] + (grades[i + 20] ? '&ndash;' + grades[i + 20] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
});

