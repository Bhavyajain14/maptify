import { Running } from './models/running.js';
import { Cycling } from './models/cycling.js';
import { allNumbers, allPositive } from './helpers.js';
import { saveWorkouts, loadWorkouts } from './storage.js';
import * as mapView from './views/mapView.js';
import * as formView from './views/formView.js';
import * as listView from './views/listView.js';
import * as toolbarView from './views/toolbarView.js';

export class App {
  #workouts = [];
  #clickedCoords; // where the user clicked on the map

  constructor() {
    this.#workouts = loadWorkouts();
    this.#workouts.forEach(workout => listView.renderWorkout(workout));

    this._getPosition();
    formView.addFormHandlers(this._newWorkout.bind(this));
    listView.addListClickHandler(
      this._goToWorkout.bind(this),
      this._deleteWorkout.bind(this)
    );
    toolbarView.addShowAllHandler(this._showAll.bind(this));
    toolbarView.addClearHandler(this._clearAll.bind(this));
  }

  _getPosition() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      this._showMap.bind(this),
      function () {
        alert('Could not get your position');
      }
    );
  }

  _showMap(position) {
    const { latitude, longitude } = position.coords;

    mapView.loadMap([latitude, longitude], this._handleMapClick.bind(this));
    this.#workouts.forEach(workout => mapView.renderMarker(workout));
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
    listView.renderWorkout(workout);
    formView.hideForm();
    saveWorkouts(this.#workouts);
  }

  _goToWorkout(id) {
    if (!mapView.isMapReady()) return;

    const workout = this.#workouts.find(work => work.id === id);
    mapView.moveTo(workout.coords);
  }

  _deleteWorkout(id) {
    this.#workouts = this.#workouts.filter(work => work.id !== id);
    mapView.removeMarker(id);
    listView.removeWorkout(id);
    saveWorkouts(this.#workouts);
  }

  _showAll() {
    if (!mapView.isMapReady()) return;
    mapView.showAll(this.#workouts.map(work => work.coords));
  }

  _clearAll() {
    if (!this.#workouts.length) return;
    if (!confirm('Delete all workouts?')) return;

    this.#workouts.forEach(work => mapView.removeMarker(work.id));
    this.#workouts = [];
    listView.clearList();
    saveWorkouts(this.#workouts);
  }
}
