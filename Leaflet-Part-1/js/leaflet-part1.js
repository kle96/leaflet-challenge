// API for all Earthquakes in the past 30 days
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(baseURL).then(function(response) {
    // Create the map object to match bounds in API
    var myMap = L.map("map", {
        center: [40.737, -100.3736],
        zoom: 4
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
        L.circle(coord_point, {
            fillOpacity: 0.75,
            color: "blue",
            fillColor: "blue",
            radius: details.mag * 1000
        }).bindPopup(`<h1>${details.place}</h1>`).addTo(myMap);

    }
});