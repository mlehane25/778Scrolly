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

function createMap(){

    map = L.map('mapid', {
        center: [38.877700, -77.096103],
        zoom: 12,
    });

    //add OSM base tilelayer
    var accessToken = "pk.eyJ1IjoibWxlaGFuZSIsImEiOiJjbG00NzJxNHIwdnQxM3FsZno2NXExeXN6In0.5sv_6g0kMbsjJHYEIJB_Uw";
    var id = "mlehane/clyt8jpzo006901pcg7cg309s/draft";
    L.tileLayer(`https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    var southWest = L.latLng(38.8, -77.15);
    var northEast = L.latLng(39, -77.05);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    

    //call getData function
    getData(); // Call the function to load the second GeoJSON layer
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
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
            
        })
};

// Use different color for different levels
function getColor(rankColor) {
    switch (rankColor) {
        case 1:
            return "#D0C7AB"
        case 2:
            return "#B3A482";
        case 3:
            return "#96815A";
        case 4:
            return "#795E31";
        case 5:
            return "#5C3C09";
        default:
            return "#9e9e9e"; // default color if none of the above categories are matched
    }
};

document.addEventListener('DOMContentLoaded',createMap)

})();