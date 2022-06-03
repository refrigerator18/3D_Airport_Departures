# [flightmap.live](https://flightmap.live/)


https://user-images.githubusercontent.com/57844356/171966558-74e3eb3d-9c1e-4e39-8758-a410fe3500cd.mov


## About
A realtime visualization of the last 48 hours of airplane departures on a 3D interactive globe. This project was made using WebGL (ThreeJS), Javascript, HTML/CSS, airport data, and live airplane data via an API.

* Airplane information is obtained via ADS-B and Mode S data collected by research institutions and local users on the OpenSky Network (https://opensky-network.org/)
* Airport data (ICAO, City, Country, Coordinates) was parsed from the Global Airport Database (https://www.partow.net/miscellaneous/airportdatabase/)

## Data Collection 
For complete airport data, I downloaded the Global Airport Database and wrote a little Python script to parse the data, convert it onto a CSV, and get rid of any data that would cause issues.

``` python
import pandas as pd

col_names = ['ICAO', 'name', 'city', 'country', 'lat', 'long']
# Load in data with only the airport's ICAO, city, country, latitude and longitude columns
df = pd.read_csv("GlobalAirportDatabase.txt", sep = ":", header=None, usecols = [0, 2, 3, 4, 14, 15], names=col_names)

# Drop all rows with no coordinates
df = df[df['lat'] !=0]

# Convert to CSV
df.to_csv('aiport_coords.csv', index=False)

``` 
This CSV is then simply converted into a JavaScript hashmap as shown below (airport_data.js)
``` js
  },
  "KSFO": {
    "name": "SAN FRANCISCO INTERNATIONAL",
    "city": "SAN FRANCISCO",
    "country": "USA",
    "lat": 37.619,
    "long": -122.375
  },
```

The next step in data collection was finding a live airplane API (preferably free) that had the information I needed, which was departure airport, arrival airport, ICAO code, and to be able to filter flights by time frame. For this I chose the OpenSky Network Live API (https://openskynetwork.github.io/opensky-api/)

## Code Walkthrough
* The functions below are seen in /src/globe.js

Say the user enters KSFO (San Fransisco International) and clicks "View Flights"...

The first step is calling the getTimes() function for finding the right time frame for the API call. This function simply returns the current time, and the current time - 48 hrs, all in Unix time (seconds since epoch)

``` js
function getTimes(){
    currentTime = Math.floor(Date.now() / 1000)
    prevTime = currentTime - (2 * 24 * 60 * 60)
    return [String(prevTime), String(currentTime)]
}

```

The next step is getting San Fransico International's JSON departure data from the OpenSky network in that time frame (getData(ICAO='KSFO')). The request to OpenSky only returns the ICAO code for the arrival destination of each flight. That's when we can search through the data created in our data collection step to find the corresponding coordinates, city and country. The data for each flight is stored in an array called routes. 

Now the exciting part, drawing the routes. The first step is to rotate the globe to the departure, KSFO. 

``` js
// 600ms transition to new view point
function rotateGlobe(lat=37.619, long=-122.375){
  globe.pointOfView({lat: lat, lng:long, altitude: 2.2}, 600)
}

```
Second, we draw the routes on our globe, along with a label for the departure airport
``` js
const colors = [['#CCF381', '#4831D4'], ['#9400D3','#FFAA33'], ['#89ABE3FF', '#EA738DFF']]
function setRoutes(routes, ICAO){
    newLabel = [{lat: DATA[ICAO].lat, lng: DATA[ICAO].long, label: DATA[ICAO].name + " ("+ ICAO + ")"}]
    globe.arcColor(colors[Math.floor(Math.random() * colors.length)])
    globe.labelsData(newLabel)
    globe.arcsData(routes);
}
```
Last, we attach a label to each route showing the arrival airport's information
``` js
function showRoute(arc, prevarc){
    if (arc != null){
        globe.arcLabel(["→ " + arc.arrCity + ", " + arc.arrCountry + " (" + arc.arrICAO + ")"])
    }
}
```

And that's it! There are more minutiae such as styling the globe/wesbite, parsing the data, offsets, attaching event listeners etc., but that can all be explored in the /src/ folder







## Running on your local network
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
