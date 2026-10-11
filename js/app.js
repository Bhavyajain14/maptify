import { Running } from './models/running.js';
import { Cycling } from './models/cycling.js';
import { DEFAULT_COORDS } from './config.js';
import { allNumbers, allPositive } from './helpers.js';
import { saveWorkouts, loadWorkouts } from './storage.js';
import * as mapView from './views/mapView.js';
import * as formView from './views/formView.js';
import * as listView from './views/listView.js';
import * as toolbarView from './views/toolbarView.js';
import * as summaryView from './views/summaryView.js';

export class App {
  #workouts = [];
  #clickedCoords; // where the user clicked on the map
  #sortBy = 'newest';

  constructor() {
    this.#workouts = loadWorkouts();
    this._renderList();

    this._showMap();
    this._goToUserLocation();
    formView.addFormHandlers(this._newWorkout.bind(this));
    listView.addListClickHandler(
      this._goToWorkout.bind(this),
      this._deleteWorkout.bind(this)
    );
    toolbarView.addSortHandler(this._sort.bind(this));
    toolbarView.addShowAllHandler(this._showAll.bind(this));
    toolbarView.addClearHandler(this._clearAll.bind(this));
  }

  _showMap() {
    mapView.loadMap(DEFAULT_COORDS, this._handleMapClick.bind(this));
    this.#workouts.forEach(workout => mapView.renderMarker(workout));
  }

  // Moves the map to the user's location if they allow it.
  // If they don't, the map just stays at the default location.
  _goToUserLocation() {
    navigator.geolocation?.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      mapView.moveTo([latitude, longitude]);
    });
  }

  _handleMapClick(mapEvent) {
    const { lat, lng } = mapEvent.latlng;
    this.#clickedCoords = [lat, lng];
    formView.showForm();
  }

  _newWorkout() {
    const { type, distance, duration, cadence, elevation } =
      formView.getFormData();
    let workout;

    if (type === 'running') {
      if (
        !allNumbers(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return formView.showError('Please enter positive numbers only.');

      workout = new Running(this.#clickedCoords, distance, duration, cadence);
    }

    if (type === 'cycling') {
      // elevation gain can be negative (downhill)
      if (
        !allNumbers(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return formView.showError('Please enter positive numbers only.');

      workout = new Cycling(this.#clickedCoords, distance, duration, elevation);
    }

    this.#workouts.push(workout);
    mapView.renderMarker(workout);
    this._renderList();
    formView.hideForm();
    saveWorkouts(this.#workouts);
  }

  _goToWorkout(id) {
    const workout = this.#workouts.find(work => work.id === id);
    mapView.moveTo(workout.coords);
  }

  _deleteWorkout(id) {
    this.#workouts = this.#workouts.filter(work => work.id !== id);
    mapView.removeMarker(id);
    this._renderList();
    saveWorkouts(this.#workouts);
  }

  _renderList() {
    const workouts = [...this.#workouts];

    if (this.#sortBy === 'distance') workouts.sort((a, b) => b.distance - a.distance);
    else if (this.#sortBy === 'duration') workouts.sort((a, b) => b.duration - a.duration);
    else workouts.reverse(); // newest first

    listView.renderList(workouts);
    summaryView.renderSummary(workouts);
  }

  _sort(sortBy) {
    this.#sortBy = sortBy;
    this._renderList();
  }

  _showAll() {
    mapView.showAll(this.#workouts.map(work => work.coords));
  }

  _clearAll() {
    if (!this.#workouts.length) return;
    if (!confirm('Delete all workouts?')) return;

    this.#workouts.forEach(work => mapView.removeMarker(work.id));
    this.#workouts = [];
    this._renderList();
    saveWorkouts(this.#workouts);
  }
}
