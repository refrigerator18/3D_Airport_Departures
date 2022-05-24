// 3 hour window
// var time = Math.floor(Date.now() / 1000)
// var start_time = String(time - (2 * 60 * 60))
// var end_time = String(time)
// Airport
// var airport = 'CYYZ'
// URL
// var url = 'https://opensky-network.org/api/flights/departure?airport=' + airport + 
//           '&begin=' + start_time + '&end=' + end_time
// var url = 'https://opensky-network.org/api/flights/all?begin=' + start_time + '&end=' + end_time
// console.log(url)

var routes = [{startLat: 43.6523, startLng: -79.3822, endLat: 53.631611, endLng: -113.323975}, {startLat: 43.6523, startLng: -79.3822, endLat: DATA['AYGA'].lat, endLng: DATA['AYGA'].long}]

var request = new XMLHttpRequest()
// request.open('GET', "https://opensky-network.org/api/flights/departure?airport=CYYZ&begin=1517227200&end=1517230800", true)
request.open('GET', "https://opensky-network.org/api/flights/departure?airport=CYYZ&begin=1517227200&end=1517425200", true)
request.onload = function () {
    // Begin accessing JSON data here
    console.log('Recieved data: ')
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
    data.forEach(flight => {
        if (flight.estArrivalAirport != null)
        console.log(flight.estArrivalAirport)
        if (DATA[flight.estArrivalAirport] != null)
            routes.push({startLat: 43.6523, startLng: -79.3822, endLat: DATA[flight.estArrivalAirport].lat, endLng: DATA[flight.estArrivalAirport].long})
            // console.log(DATA[flight.estArrivalAirport].lat, DATA[flight.estArrivalAirport].long)
    })
    } else {
    console.log('error')
    }
}
request.send()