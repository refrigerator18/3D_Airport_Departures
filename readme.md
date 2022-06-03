# Live 3D Airport Departures
## About
This projects visualizes the last 48 hours of airplane departures on a 3D interactive globe. This project was made with WebGL (ThreeJS), Javascript, HTML/CSS, airport data, and live airplane data via an API.


* Airplane information is obtained via ADS-B and Mode S data collected by research institutions and local users on the OpenSky Network (https://opensky-network.org/)
* Airport data (ICAO, City, Country, Coordinates) was parsed from the Global Airport Database (https://www.partow.net/miscellaneous/airportdatabase/)

## Data Collection 
A vital step in this project was finding complete airport data, so that the visualization would be accurate. I downloaded the Global Airport Database and wrote a little Python script to parse the data, convert it onto a CSV, and get rid of any data that would cause issues

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

The next step in data collection was finding a live airplane API (preferably free) that had the information I needed, which was departure airport, arrival airport, ICAO code, and to be able to filter flights by time frame. For this I chose the OpenSky Network Live API (https://openskynetwork.github.io/opensky-api/)

## Code Walkthrough
In this section I will focus more on the main logic of the code, more than the styling of the globe.

As soon as a user searches for an airport, the getTimes() function,

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
