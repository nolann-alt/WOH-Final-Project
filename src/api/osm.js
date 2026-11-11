
// OpenStreetMap URLs
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Search for a place
export async function searchPlace(query) {
  const url = `${NOMINATIM_URL}?q=${query}&format=json&limit=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Place search failed.");
  }

  const data = await response.json();

  // Get the name and coordinates
  return data.map((place) => ({
    name: place.display_name,
    lat: Number(place.lat),
    lon: Number(place.lon),
  }));
}

// Find nearby running or cycling paths
export async function getNearbyPaths(sport, lat, lon) {
  let filters = "";

  // Choose what to search for
  if (sport === "cycle") {
    filters = `way["highway"="cycleway"](around:1500,${lat},${lon});`;
  } else {
    filters = `
      way["leisure"="track"]["sport"="running"](around:1500,${lat},${lon});
      way["leisure"="park"](around:1500,${lat},${lon});
    `;
  }

  const query = `[out:json][timeout:15];(${filters});out geom;`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error("Could not load paths. Try again later.");
  }

  const data = await response.json();

  // Get the coordinates of each path
  return data.elements
    .filter((path) => path.geometry)
    .map((path) => ({
      id: path.id,
      positions: path.geometry.map((point) => [point.lat, point.lon]),
    }));
}
