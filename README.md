# Trailmark

**Live:** https://bhavyajain14.github.io/trailmark/

Log your runs and bike rides on a map. Draw your route by clicking on the map, Trailmark measures the distance, and you add the time. It keeps a list of your workouts with pace, speed and totals.

Built with plain JavaScript (ES modules) and the Leaflet map library. No framework, no build step.

## Features

- Opens the map at your current location (or New Delhi if location is off)
- **Draw your route:** each click on the map adds a point, and the distance is calculated from the route. Undo the last point or cancel the route at any time.
- Log a **running** workout (duration, cadence → pace) or a **cycling** workout (duration, elevation gain → speed)
- Add an optional description, shown as the workout's heading. Each workout also shows a Running or Cycling tag and when it was logged.
- **Edit** a saved workout: change any detail, or add and undo points on its route
- Saved routes are drawn as lines with start and finish dots (teal for runs, orange for rides), and clicking a workout in the list zooms to its route
- Missing details are pointed out in the form, with the field marked in red
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
  helpers.js         validation, formatting and route distance helpers
  storage.js         saves and loads workouts (localStorage)
  models/
    workout.js       Workout base class
    running.js       Running (pace)
    cycling.js       Cycling (speed)
  views/
    mapView.js       map, saved routes, the route being drawn
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
