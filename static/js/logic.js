

function createMap(eartQuakes,L1s,L0s,clrs,earthMags) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 10,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    console.log(eartQuakes)
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": eartQuakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [39.39, -99.1],
      zoom: 5,
      layers: [lightmap, eartQuakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    for (var i=0; i<L1s.length; i++){
      L.circle([L1s[i], L0s[i]], {
        color: clrs[i],
        fillColor: clrs[i],
        fillOpacity: 0.75,
        radius: 10000*earthMags[i]
      }).addTo(map);
    }

  }


function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var earthQs= response.features;

    // Initialize an array to hold bike markers
    var eqMarkers = [];
    
    console.log(earthQs.length);
    // Loop through the stations array
    var earthMags=[];
    var L1s=[];
    var L0s=[];
    var clrs=[]
    for (var index = 0; index < earthQs.length; index++) {
      var earthQ = earthQs[index];
      ertMag=earthQ.properties.mag;

      // For each station, create a marker and bind a popup with the station's name
      var eqMarker = L.marker([earthQ.geometry.coordinates[1], earthQ.geometry.coordinates[0]])
        .bindPopup("<h3>Magnitude: " + ertMag + "<h3><h3>" + earthQ.properties.place + "<h3>");


        if (ertMag>5){
          clr="Red"
        }
        else if (ertMag>4){
          clr="darkOrange"
        }
        else if (ertMag>3){
          clr="orange"
        }
        else if (ertMag>2){
          clr="yellow"
        }
        else if (ertMag>1){
          clr="lime"
        }
        else if (ertMag>0){
          clr="green"
        }

      // Add the marker to the bikeMarkers array
      eqMarkers.push(eqMarker);
      earthMags.push(ertMag);
      L1s.push(earthQ.geometry.coordinates[1]);
      L0s.push(earthQ.geometry.coordinates[0]);
      clrs.push(clr);

    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(eqMarkers),L1s,L0s,clrs,earthMags);


  }

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);