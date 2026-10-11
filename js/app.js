import { Running } from './models/running.js';
import { Cycling } from './models/cycling.js';
import { DEFAULT_COORDS } from './config.js';
import { routeDistanceKm } from './helpers.js';
import { saveWorkouts, loadWorkouts } from './storage.js';
import * as mapView from './views/mapView.js';
import * as formView from './views/formView.js';
import * as listView from './views/listView.js';
import * as toolbarView from './views/toolbarView.js';
import * as summaryView from './views/summaryView.js';

export class App {
  #workouts = [];
  #route = []; // points clicked on the map for the workout being drawn
  #editingId = null; // id of the workout being edited, or null for a new one
  #sortBy = 'newest';

  constructor() {
    this.#workouts = loadWorkouts();
    this._renderList();

    this._showMap();
    this._goToUserLocation();
    formView.addFormHandlers(
      this._saveWorkout.bind(this),
      this._undoPoint.bind(this),
      this._cancelRoute.bind(this),
    );
    listView.addListClickHandler(
      this._goToWorkout.bind(this),
      this._editWorkout.bind(this),
      this._deleteWorkout.bind(this),
    );
    toolbarView.addSortHandler(this._sort.bind(this));
    toolbarView.addShowAllHandler(this._showAll.bind(this));
    toolbarView.addClearHandler(this._clearAll.bind(this));
  }

  _showMap() {
    mapView.loadMap(DEFAULT_COORDS, this._handleMapClick.bind(this));
    this.#workouts.forEach(workout => mapView.renderWorkout(workout));
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

    // ignore a second click on the same spot (for example a double click)
    const last = this.#route.at(-1);
    if (last && last[0] === lat && last[1] === lng) return;

    this.#route.push([lat, lng]);
    this._updateDraft();
    formView.showForm(this.#editingId !== null);
  }

  _updateDraft() {
    mapView.drawDraft(this.#route);
    formView.setDistance(routeDistanceKm(this.#route));
  }

  _undoPoint() {
    this.#route.pop();
    if (!this.#route.length) return this._cancelRoute();
    this._updateDraft();
  }

  _cancelRoute() {
    // when editing, put the original workout back on the map unchanged
    const editing = this.#workouts.find(work => work.id === this.#editingId);
    if (editing) mapView.renderWorkout(editing);

    this.#editingId = null;
    this.#route = [];
    mapView.clearDraft();
    formView.hideForm();
  }

  _editWorkout(id) {
    if (this.#editingId || this.#route.length) this._cancelRoute();

    const workout = this.#workouts.find(work => work.id === id);
    this.#editingId = id;
    this.#route = [...workout.route];

    mapView.removeWorkout(id); // the route is shown as the draft while editing
    this._updateDraft();
    mapView.showAll(this.#route);
    formView.fillForm(workout);
    formView.showForm(true);
  }

  // Returns what is wrong with the new workout (and which field), or nothing
  _findError({ type, distance, duration, cadence }) {
    if (this.#route.length < 2)
      return {
        message: 'Click at least two points on the map to draw your route.',
      };
    if (!(distance > 0))
      return { message: 'Your route is too short. Add a point further away.' };
    if (!(duration > 0))
      return {
        field: 'duration',
        message: 'Enter how long the workout took, in minutes.',
      };
    if (type === 'running' && !(cadence > 0))
      return {
        field: 'cadence',
        message: 'Enter your cadence in steps per minute.',
      };
    // elevation gain is optional and can be 0 or negative (downhill)
  }

  // Saves a new workout, or the changes to the one being edited
  _saveWorkout() {
    const data = formView.getFormData();
    data.distance = +routeDistanceKm(this.#route).toFixed(2);

    const error = this._findError(data);
    if (error) return formView.showError(error.message, error.field);

    const { type, distance, duration, cadence, elevation } = data;
    const workout =
      type === 'running'
        ? new Running(this.#route, distance, duration, cadence)
        : new Cycling(this.#route, distance, duration, elevation);
    workout.description = data.description;

    const index = this.#workouts.findIndex(work => work.id === this.#editingId);
    if (index === -1) {
      this.#workouts.push(workout);
    } else {
      // keep the original id and date, so it stays the same workout
      workout.id = this.#workouts[index].id;
      workout.date = this.#workouts[index].date;
      workout.editedAt = new Date();
      this.#workouts[index] = workout;
    }

    this.#editingId = null; // so cancelling below doesn't redraw the old version
    mapView.renderWorkout(workout);
    this._renderList();
    saveWorkouts(this.#workouts);
    this._cancelRoute(); // clears the drawing and hides the form
  }

  _goToWorkout(id) {
    const workout = this.#workouts.find(work => work.id === id);
    mapView.showAll(workout.route);
  }

  _deleteWorkout(id) {
    if (id === this.#editingId) {
      this.#editingId = null;
      this._cancelRoute();
    }

    this.#workouts = this.#workouts.filter(work => work.id !== id);
    mapView.removeWorkout(id);
    this._renderList();
    saveWorkouts(this.#workouts);
  }

  _renderList() {
    const workouts = [...this.#workouts];

    if (this.#sortBy === 'distance')
      workouts.sort((a, b) => b.distance - a.distance);
    else if (this.#sortBy === 'duration')
      workouts.sort((a, b) => b.duration - a.duration);
    else workouts.reverse(); // newest first

    listView.renderList(workouts);
    summaryView.renderSummary(workouts);
  }

  _sort(sortBy) {
    this.#sortBy = sortBy;
    this._renderList();
  }

  _showAll() {
    mapView.showAll(this.#workouts.flatMap(work => work.route));
  }

  _clearAll() {
    if (!this.#workouts.length) return;
    if (!confirm('Delete all workouts?')) return;

    this.#editingId = null;
    this._cancelRoute();

    this.#workouts.forEach(work => mapView.removeWorkout(work.id));
    this.#workouts = [];
    this._renderList();
    saveWorkouts(this.#workouts);
  }
}
