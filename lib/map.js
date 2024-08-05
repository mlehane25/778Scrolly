var map= L.map('mapid', {
    center: [38.877700, -77.096103],
    zoom: 11,
    scrollWheelZoom:false
});

// Define the bounding box for map panning constraints
var southWest = L.latLng(38.7, -77.1),
    northEast = L.latLng(38.9, -77),
    bounds = L.latLngBounds(southWest, northEast);

        


//adding tileset layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var Stadia_StamenTerrain = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });



/* Map of GeoJSON city data from map.geojson */
//declare map var in global scope
//function to instantiate Leaflet map
function createMap(){
    //add OSM base tilelayer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    //call getData function
    getData(); // Call the function to load the second GeoJSON layer
};

function onEachFeature(feature, layer) {
    var popupContent = "";
     var attributesToShow = ["GEOGID20","Categories"];

        // Loop through the selected attributes and add them to the popup
        for (var i = 0; i < attributesToShow.length; i++) {
            var attribute = attributesToShow[i];
            if (feature.properties[attribute]) {
                popupContent += "<p>" + attribute + ": " + feature.properties[attribute] + "</p>";
            }
        }
        layer.bindPopup(popupContent);
};

//function to retrieve the data and place it on the map
function getData() {
    //load the data
    fetch("lib/CensusTractsPoints.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                style: function (feature) {
                    var Rank = feature.properties.Categories;

                    
                    // Conditionally set the fillColor based on a property (e.g., Sodium)
if (
    String(feature.properties.Categories) === '1' ||
    String(feature.properties.Categories) === '2' ||
    String(feature.properties.Categories) === '3' ||
    String(feature.properties.Categories) === '4' ||
    String(feature.properties.Categories) === '5' 
) {
    return {
        fillColor: '#b5903e',
        color: 'white',
        opacity: 1,
        fillOpacity: 0.8
    };
} else {
    return {
        fillColor: '#b2aca1',
        color: 'white',
        opacity: 1,
        fillOpacity: 0.8
    };
}

                },
                pointToLayer: function (feature, latlng) {
                    return L.polygon(latlng);
                },
                onEachFeature: onEachFeatureSecond
            }).addTo(map);
        });
}



// Example getHSLColor function for setting fill color based on chloride value
function getHSLColor2(Categories) {
    // Adjust the hue value (0-360) based on your preference
    var hue = 1; // For example, setting it to 120 for a greenish hue
    var saturation = 31; // 0-100
    var lightness = 68; // 0-100

    // Customize this function based on your specific requirements
    return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
}

document.addEventListener('DOMContentLoaded',createMap)