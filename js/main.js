//no property named popupContent; instead, create html string with all properties
var popupContent = "";
var attributesToShow = ["TRACT20", "FinalRanki"];

    // Loop through the selected attributes and add them to the popup
    for (var i = 0; i < attributesToShow.length; i++) {
        var attribute = attributesToShow[i];
        if (feature.properties[attribute]) {
            //popupContent += "<p>" + feature.properties["GEOID20"] +"</p>";
            popupContent += "<h4>" + "Total Access Points: " + feature.properties[attribute] + " pts" + "</h4>";
        }
    }
    
    layer.bindPopup(popupContent);