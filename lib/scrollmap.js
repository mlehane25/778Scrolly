(function(){
    //calculate inline position of a right element 
    function rightPosition(){
        document.querySelectorAll('.right').forEach(div =>{
            var children = div.parentNode.childNodes,
                containsLeft;

            //calculate if positioned next to a .left element
            for (child of children){
                if(child.classList){
                    containsLeft = child.classList.contains("left");
                    if (containsLeft){
                        div.classList.remove('right')
                        div.classList.add('right-inline')
                        break;
                    }
                }
            }
        });

        //full width element
        document.querySelectorAll('.full-width').forEach(div =>{
            div.parentNode.style.padding = 0;
        });
    }
    //center title horizontally and vertically within page
    function positionTitle(){
        if (document.querySelector('.title')){
            var children = document.querySelector('.title').childNodes,
                tHeight = document.querySelector('.title').clientHeight,
                cHeight = 0;

            for (child of children){
                if (child.clientHeight)
                    cHeight += child.clientHeight;
            }

            document.querySelector('.title').firstElementChild.style.marginTop = (tHeight - cHeight)/2 + "px";
        }
    }
    //center element vertically within the page
    function vertCenter(){
        document.querySelectorAll('.vert-center').forEach(div =>{
            var height = div.clientHeight,
                pHeight = div.parentNode.clientHeight;
                
            div.style.marginTop = (pHeight/2) - (height/2) + "px";
        });
    }
    //resize background elements
    function resizeBackround(){
        var width = document.documentElement.clientWidth;

        document.querySelectorAll('.container').forEach(div =>{
            div.width = width + 'px !important';
        });
    }
    //function for a smooth transition between background elements
    function backgroundTransition(){
        document.querySelectorAll(".scroll-container").forEach(function(scrollContainer){
            let foreground = scrollContainer.children[1],
                background = scrollContainer.children[0],
                foregroundItems = [];
            //add individual foreground items to the array
            foreground.childNodes.forEach(function(child){
                if (child.nodeName == "DIV"){
                    foregroundItems.push(child);
                }
            })
            //if there is more than one background item, activate scroll listener
            if(background.children.length > 1){
                background.childNodes.forEach(function(child){
                    //if the element is not a "text" element
                    if (child.nodeName != "#text" && child.nodeName != "#comment"){
                        //retrieve data-slide value to get the foreground item
                        console.log(child)
                        let id = child.dataset.slide ? child.dataset.slide : 0;
                        //activate listener for each background item
                        document.addEventListener("scroll",function(){
                            //position at the bottom of the screen
                            let scrollPos = window.scrollY + (window.innerHeight) - foregroundItems[id].clientHeight,
                            //position of the select foreground item
                                foreGroundOffset = foregroundItems[id].offsetParent.offsetTop + foregroundItems[id].offsetTop;
                            //if the current scroll position is greater than the bottom position of the foreground element
                            if (scrollPos > foreGroundOffset){
                                if (child.previousElementSibling)
                                    child.previousElementSibling.classList.add("hidden");
                                if (child.nextElementSibling)
                                    child.nextElementSibling.classList.add("hidden");
                                child.classList.remove("hidden");
                                vertCenter();
                            }  
                        })
                    }
                })
            }
        })
    }
    //functions to fire on resize
    function resize(){
        rightPosition();
        vertCenter();
        positionTitle();
        resizeBackround();
        backgroundTransition();
    }

    document.addEventListener('DOMContentLoaded', resize);
    document.addEventListener('scroll', vertCenter);
    window.addEventListener('resize', resize);

//initilize map and set center of map with coordinates
/* Map of GeoJSON city data from map.geojson */
//declare map var in global scope
//function to instantiate Leaflet map
var map;

function popupContent(properties, attribute) {
	this.properties = properties;
	this.attribute = attribute;
	this.year = attribute.split("_")[1];
	this.population = this.properties[attribute];
	this.formatted = "<p><b>Country:</b> " + this.properties["Country or Area"] + "</p><p><b>Nuclear Electricity Output in " + this.year + ":</b> " + this.population + " million kilowatts per hour</p>";
};

function createMap(){

    map = L.map('mapid', {
        center: [38.877700, -77.098103],
        zoom: 12,
    });

    //add OSM base tilelayer
    var accessToken = "pk.eyJ1IjoibWxlaGFuZSIsImEiOiJjbG00NzJxNHIwdnQxM3FsZno2NXExeXN6In0.5sv_6g0kMbsjJHYEIJB_Uw";
    var id = "mlehane/clzo768ru00ax01pcc0ygak9e";
    L.tileLayer(`https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    var southWest = L.latLng(38.8, -77.15);
    var northEast = L.latLng(39, -77.05);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    

    //call getData function
    getData(); // Call the function to load the second GeoJSON layer

    createLegend();
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    var attributesToShow = ["TRACT20", "FinalRanki"];

    // Loop through the selected attributes and add them to the popup
    for (var i = 0; i < attributesToShow.length; i++) {
        var attribute = attributesToShow[i];
        if (feature.properties[attribute]) {
            popupContent += "<h4>" + "Census Tract Number: " + feature.properties["NAME20"] +"</h4>";
            popupContent += "<h4>" + "Total Park Acres: " + feature.properties["sum_acreag"] + " acres" + "</h4>";
            popupContent += "<h4>" + "Number of Parks: " + feature.properties["Polygon_Co"] + "</h4>";
            //popupContent += "<h4>" + "Acreage Points: " + feature.properties["AcreageTot"] + " pts" + "</h4>";
            //popupContent += "<h4>" + "Access Points: " + feature.properties["AccessTota"] + " pts" + "</h4>";
            //popupContent += "<h4>" + "Equity Points: " + feature.properties["EquityTota"] + " pts" + "</h4>";
            //popupContent += "<h4>" + "Total Points: " + feature.properties["FinalRanki"] + " pts" + "</h4>";
            popupContent += "<h4>" + "Total Points: " + feature.properties[attribute] + " pts" + "</h4>";
        }
    }
    
    layer.bindPopup(popupContent);
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("lib/CensusTractPoints.json")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                style: function (feature) {
                    // Customize the style based on feature properties
                    var rankColor = feature.properties.Categories;
        
                    // Example: Set color based on chloride value using HSL
                    return {
                        fillColor: getColor(rankColor),
                        color: 'white',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8,
                    };
                },
                onEachFeature:onEachFeature
            }).addTo(map);
            var attributes = processData(json);
            console.log(attributes);
            
        })
};

// Use different color for different levels
function getColor(rankColor) {
    switch (rankColor) {
        case 5:
            return "#D7E8B6"
        case 4:
            return "#AEC08B";
        case 3:
            return "#859961";
        case 2:
            return "#5C7237";
        case 1:
            return "#334B0D";
        default:
            return "#9e9e9e"; // default color if none of the above categories are matched
    }
};

//function to process the data and get an attributes array
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
        attributes.push(attribute);
    };
    console.log(attributes);
    return attributes;
};

//function to create the legend
function createLegend(attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {

            //array of circle names to base loop on
			var div = L.DomUtil.create('div', 'legend-control-container'),
                grades = [5, 4, 3, 2, 1, 0],
                labels = ["No Population", "202-227","227-246", "246-271", "271-323", "323-454"];

            div.innerHTML = '<p1>Total Nature Access<br>Points Earned</p1><br>';

			//loop to add each circle and text to svg string  
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    labels[i] + '<br>'
            };

            return div;
        }
    });

    map.addControl(new LegendControl());

};

document.addEventListener('DOMContentLoaded',createMap)

})();