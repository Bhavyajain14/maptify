# Maptify

Log your runs and bike rides on a map. Built with plain JavaScript and the Leaflet map library.

## Features

- Opens the map at your current location (browser geolocation)
- Click anywhere on the map to log a workout at that spot
- **Running:** distance, duration and cadence, with pace (min/km) calculated
- **Cycling:** distance, duration and elevation gain, with speed (km/h) calculated
- Each workout gets a marker and a popup on the map
- Click a workout in the list to move the map to it
- Form inputs are checked so only positive numbers are accepted

## How it's built

- `Workout` base class with `Running` and `Cycling` subclasses (JavaScript classes and inheritance)
- An `App` class holds the map and handles all events
- Private class fields for app state

## Tech

HTML, CSS, JavaScript (ES6+), Leaflet

## Run it

Open `index.html` in a browser and allow location access when asked.
