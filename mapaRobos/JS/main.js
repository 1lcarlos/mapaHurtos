$(document).ready(function () {

    $('#map').height(window.innerHeight);
    $('#side-in').height(window.innerHeight);


//variables
var barriosBogota = false;
var centroidesBarriosBogota = false;

var map = L.map('map',{
            zoomControl: false
        }).setView([4.66198, -74.09935 ], 11);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
//Eventos
    //map.on('click',obtenerCoordenadas);
    $(document).on('click','#informacion',ocultarBarraLateral);


//Funciones

//funcion para obtener las coordenadas en donde doy click
 function obtenerCoordenadas (e) {
    var str = "Latitude: " + e.latlng.lat.toFixed(5) + "  Longitude: " + e.latlng.lng.toFixed(5) + "  Zoom Level: " + map.getZoom();
    //$("#map_coords").html(str); // Agrego una funcion que reacciona al movimiento del mouse y muestra las coordenadas actuales en el footer.
    console.log(str);
};

//funcion para ocultar o mostar la barra lateral.

function ocultarBarraLateral(){
    if($('#side-in').hasClass('in')){
        $('#side-in').removeClass('in');
    }else{
        $('#side-in').addClass('in');
    }
}



fetch('/Datos/bogota_cadastral.json', {
    method: 'GET'
})
.then(response => response.json())
.then(json => {
    console.log(json)
    barriosBogota = L.geoJSON(json,{
        style : function(feature){
            return {
                fillOpacity: 0,
                weight: 0.3
            };
        },
        onEachFeature: resaltar
    }).addTo(map);
    centroidesBarriosBogota.bringToFront();
})

fetch('/Datos/centroidesBarriosBogota.geojson', {
    method: 'GET'
})
.then(response => response.json())
.then(json => {
    console.log(json)
    centroidesBarriosBogota = L.geoJSON(json,{
        style : function(feature){
            return {
                fillOpacity: 0.3,
                fillColor: 'black',
                color: 'black',
                opacity: 0.3
        
            };
        },
        pointToLayer: circulos
    }).addTo(map);
    
    map.fitBounds(centroidesBarriosBogota.getBounds());
})
.catch(error => console.log(error.menssage));

function circulos(geoJsonPoint, latlng){
    return L.circle(latlng, 1000000*geoJsonPoint.properties.shape_area);
}

function resaltar(feature, layer){
    layer.on('mouseover', function(){
        layer.setStyle({fillOpacity:0.3});
    })
    layer.on('mouseout', function(){
        layer.setStyle({fillOpacity:0});
    })

}
});