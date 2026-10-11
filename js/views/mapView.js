import { MAP_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../config.js';

// L is the global object from the Leaflet script in index.html
let map;
const markers = new Map(); // workout id -> marker

export function loadMap(coords, onMapClick) {
  map = L.map('map').setView(coords, MAP_ZOOM);
  L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map);
  map.on('click', onMapClick);
}

export function isMapReady() {
  return Boolean(map);
}

export function renderMarker(workout) {
  const marker = L.marker(workout.coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      })
    )
    .setPopupContent(
      `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
    )
    .openPopup();

  markers.set(workout.id, marker);
}

export function removeMarker(id) {
  markers.get(id)?.remove();
  markers.delete(id);
}

export function moveTo(coords) {
  map.setView(coords, MAP_ZOOM, { animate: true, pan: { duration: 1 } });
}
