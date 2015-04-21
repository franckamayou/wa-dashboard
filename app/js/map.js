(function($) {

  $(function() {

    var map = L.map('map').setView([35.1344, -89.95743], 10);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      styleId: 22677
    }).addTo(map);

    var myIcon = L.divIcon({className: 'fui-location'});      
    var markers = L.markerClusterGroup();
    
    for (var i = 0; i < addressPoints.length; i++) {
      var a = addressPoints[i];
      var title = a.join(',&nbsp;&nbsp;');
      var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title, icon: myIcon });
      marker.bindPopup(title);
      markers.addLayer(marker);
    }

    map.addLayer(markers);

    function getColor(x) {
      /* orange scale */ /*
      return x > 75 ? '#FC4E2A' :
             x > 50 ? '#FD8D3C' :
             x > 25 ? '#FEB24C' :
                      '#FED976';
      /**/

      /* blue scale */ 
      return x > 75 ? '#185D8B' :
             x > 50 ? '#2980B9' :
             x > 25 ? '#3498db' :
                      '#86C2EA';
      /**/
    }

    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.value)
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        fillOpacity: .9
      });

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }
    }

    var geojson;

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onMapClick 
      });
    }

    geojson = L.geoJson(zipsData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 25, 50, 75],
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);

  });
})(jQuery);