import { MAP_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../config.js';

// L is the global object from the Leaflet script in index.html
let map;
const workoutLayers = new Map(); // workout id -> its line and marker

const COLORS = { running: '#0d9488', cycling: '#ea580c' };

let draftLayer; // the route being drawn, before it is saved

export function loadMap(coords, onMapClick) {
  map = L.map('map').setView(coords, MAP_ZOOM);
  L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map);
  map.on('click', onMapClick);
}

// Draws a saved workout: its route as a line, and a marker at the start
export function renderWorkout(workout) {
  const line = L.polyline(workout.route, { color: COLORS[workout.type], weight: 5 });

  const marker = L.marker(workout.route[0])
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `popup--${workout.type}`,
      })
    )
    .setPopupContent(
      `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
    );

  const layer = L.layerGroup([line, marker]).addTo(map);
  marker.openPopup();
  workoutLayers.set(workout.id, layer);
}

export function removeWorkout(id) {
  workoutLayers.get(id)?.remove();
  workoutLayers.delete(id);
}

export function moveTo(coords) {
  map.setView(coords, MAP_ZOOM, { animate: true, pan: { duration: 1 } });
}

// Zooms the map so all the given [lat, lng] points are visible
export function showAll(points) {
  if (!points.length) return;
  if (points.length === 1) return moveTo(points[0]);
  map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
}

// Shows the route being drawn as a dashed line with a dot on each point
export function drawDraft(route) {
  draftLayer ??= L.layerGroup().addTo(map);
  draftLayer.clearLayers();

  L.polyline(route, { color: '#0f172a', weight: 4, dashArray: '6 8' }).addTo(draftLayer);
  route.forEach(point =>
    L.circleMarker(point, { radius: 5, color: '#0f172a' }).addTo(draftLayer)
  );
}

export function clearDraft() {
  draftLayer?.clearLayers();
}
