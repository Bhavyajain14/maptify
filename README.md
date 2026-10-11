# Trailmark

Log your runs and bike rides on a map. Click where you went, enter the details, and Trailmark keeps a list of your workouts with pace, speed and totals.

Built with plain JavaScript (ES modules) and the Leaflet map library. No framework, no build step.

## Features

- Opens the map at your current location
- Click the map to log a **running** workout (distance, duration, cadence → pace) or a **cycling** workout (distance, duration, elevation gain → speed)
- Markers and popups for every workout, and clicking a workout in the list moves the map to it
- Sort the list by newest, longest distance or longest duration
- **Show all** zooms the map to fit every workout
- Delete one workout or clear all of them
- Totals summary: number of workouts, total km and total time
- Form errors shown inside the form
- Workouts are saved in the browser (localStorage), so they are still there after a reload

## Project structure

```
index.html
css/style.css
js/
  main.js            starts the app
  app.js             App class: connects the data and the views
  config.js          map and storage settings
  helpers.js         small validation and formatting helpers
  storage.js         saves and loads workouts (localStorage)
  models/
    workout.js       Workout base class
    running.js       Running (pace)
    cycling.js       Cycling (speed)
  views/
    mapView.js       map, markers, show all
    formView.js      new workout form and errors
    listView.js      workout list
    toolbarView.js   sort, show all, clear all
    summaryView.js   totals line
```

Each view only touches its own part of the page. `app.js` holds the workouts and tells the views what to show.

## Run it

The app uses ES modules, which browsers don't load from a plain file, so serve the folder:

```bash
npx serve .
```

Then open the URL it prints and allow location access.
