// Shifting globe to the right 
const w = window.innerWidth;
const shiftFactor = 0.35;
const shiftAmmount = shiftFactor * w;

// Flags to set starting parameters
const startAirport = 'CYYZ'
var addInitialOffset = true
var startColor = true

const colors = [['#CCF381', '#4831D4'], ['#D198C5FF' ,'#E0C568FF' ],['#89ABE3FF', '#EA738DFF'], ['#FDF5DF', '#F92C85'], 
                ['#2BAE66FF', '#FCF6F5FF'], ['#9400D3','#FFAA33']]
const globe = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .width(w + shiftAmmount)
    .pointOfView({ lat: 29.197123, lng: -46.185931, altitude: 2.2})
    .arcsTransitionDuration(500)
    .arcDashLength(0.15)
    .arcDashGap(0.01)
    .arcDashInitialGap(() => Math.random())
    .arcDashAnimateTime(6000)
    .onArcHover(showRoute)
    .labelText('label')
    .labelSize(1.5)
    .labelDotRadius(0.4)
    .labelAltitude(0.1)
    .labelDotOrientation(() => 'right')
    .labelColor(() => 'whitesmoke')
    .labelsTransitionDuration(0)

getData(callback = setRoutes, ICAO=startAirport);


// Function to get currentTime and currenTime - 48hrs in Unix time
function getTimes(){
    currentTime = Math.floor(Date.now() / 1000)
    prevTime = currentTime - (2 * 24 * 60 * 60)
    return [String(prevTime), String(currentTime)]
}

// Gets JSON airport departure data from OpenSky 
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
        var seenFlights = new Set()
        if (request.status >= 200 && request.status < 400) {
            data.forEach(flight => {
                const arrivalAirport = flight.estArrivalAirport
                if (arrivalAirport!= null && seenFlights.has(arrivalAirport) != true && arrivalAirport != ICAO && DATA[arrivalAirport] != null) {
                    seenFlights.add(arrivalAirport)
                    arrivalAirportData = DATA[flight.estArrivalAirport]
                    routes.push({startLat: depLat, startLng: depLng, endLat: arrivalAirportData.lat, endLng: arrivalAirportData.long, 
                                arrICAO: arrivalAirport, arrCity: arrivalAirportData.city, arrCountry: arrivalAirportData.country })
                }
            })
        } else {
        console.log('error')
        }
        callback(routes, ICAO)
    }
    request.send()
}


// Smooth spin of the globe to a new airport
function rotateGlobe(lat, long){
    if (addInitialOffset == true) {
        globe.pointOfView({lat: 35, lng:-60, altitude: 2.2}, 600)
        addInitialOffset = false
    }
    else {
        globe.pointOfView({lat: lat, lng:long, altitude: 2.2}, 600)
    }
}

// Populates the globe with new airport data
function setRoutes(routes, ICAO){
    newLabel = [{lat: DATA[ICAO].lat, lng: DATA[ICAO].long, label: DATA[ICAO].name + " ("+ ICAO + ")"}]
    if (startColor == true){
        globe.arcColor(colors[0])
        startColor = false
    }
    else{
        globe.arcColor(colors[Math.floor(Math.random() * colors.length)])
    }
    globe.labelsData(newLabel)
    globe.arcsData(routes);
}

// Changing Airports when user clicks button
function btnSubmit() {
    getData(callback = setRoutes, ICAO=document.getElementById('fICAO').value);
}

// Event listener for button click
var el = document.getElementById('bICAO')
el.addEventListener('click', btnSubmit)

function showRoute(arc, prevarc){
    if (arc != null){
        globe.arcLabel(["→ " + arc.arrCity + ", " + arc.arrCountry + " (" + arc.arrICAO + ")"])
    }
}




