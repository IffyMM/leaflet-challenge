const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";


// Perform a GET request to the query URL

d3.json(url).then(function(data) {
  createFeatures(data.features);

});



  function createFeatures(earthquakeData) {
        // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }


        // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    });

      // Send our earthquakes layer to the createMap function.
      createMap(earthquakes);
    }

    // Define the getColor function to assign color based on depth.
    
    function getColor(magnitude) {
      if (magnitude <=1) {
        return "#ffffcc";
      } else if (magnitude <=3) {
        return "#a1dab4";
      } else if (magnitude <=5) {
        return "#41b6c4";
      } else if (magnitude <=10) {
        return "#2c7fb8";
      } else if (magnitude <=20) {
        return "#253494";
      } else {
        return "#081d58";
      }
    }
  

  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
  
    let div = L.DomUtil.create('div', 'info legend'),
      depth = [-10, 10, 30, 50, 70, 90],
      labels = [];
  
    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
  
    return div;
  };

  
  
  
  function createMap(earthquakes) {
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      //"Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  }


