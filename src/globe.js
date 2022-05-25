const w = window.innerWidth;
const shiftFactor = 0.3;
const shiftAmmount = shiftFactor * w;
const startAirport = 'CYYZ'
// Starting at Toronto Pearson Aiport
const globe = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .width(w + shiftAmmount)
    .pointOfView({ lat: DATA[startAirport].lat, lng: DATA[startAirport].long, altitude: 2 })
    
getData(callback = setRoutes, ICAO=startAirport);

function getTimes(){
    currentTime = Math.floor(Date.now() / 1000)
    prevTime = currentTime - (2 * 24 * 60 * 60)
    return [String(prevTime), String(currentTime)]
}

function getData(callback, ICAO){
    const depLat = DATA[ICAO].lat
    const depLng = DATA[ICAO].long 
    rotateGlobe(depLat, depLng)
    times = getTimes()
    var routes = []
    const url = "https://opensky-network.org/api/flights/departure?airport=" + ICAO + "&begin=" + times[0] + "&end=" + times[1]
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function () {
        var data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
        data.forEach(flight => {
            if (flight.estArrivalAirport != null && flight.estArrivalAirport != ICAO && DATA[flight.estArrivalAirport] != null) {
                arrivalAirport = DATA[flight.estArrivalAirport]
                routes.push({startLat: depLat, startLng: depLng, endLat: arrivalAirport.lat, endLng: arrivalAirport.long})
            }
        })
        } else {
        console.log('error')
        }
        callback(routes, ICAO)
    }
    request.send()
}

function rotateGlobe(lat, long){
    globe.pointOfView({lat: lat, lng:long, altitude: 2}, 600)
}

function setRoutes(routes, ICAO){
    globe.arcColor(['#9400D3','#FF7F50'])
    globe.arcsData(routes);
}

// Changing Airports
function btnSubmit() {
    getData(callback = setRoutes, ICAO=document.getElementById('fICAO').value);
}
var el = document.getElementById('bICAO');
el.addEventListener('click', btnSubmit)









