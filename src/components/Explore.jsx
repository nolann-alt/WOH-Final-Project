import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    CircleMarker,
    useMap,
} from "react-leaflet"; // React Leaflet components for rendering the map and its elements

import { searchPlace, getNearbyPaths } from "../api/osm";

// Center the map on the selected place
function RecenterMap({ place }) {
    const map = useMap();

    useEffect(() => {
        if (place) {
            map.setView([place.lat, place.lon], 14);
        }
    }, [place]);

    return null;
}

export default function Explore() {
    // Variables for the search and map
    const [query, setQuery] = useState("");
    const [sport, setSport] = useState("run");
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Search for a place
    async function search(event) {
        event.preventDefault();

        if (!query) return;

        setLoading(true);
        setError("");
        setPlaces([]);
        setSelectedPlace(null);
        setPaths([]);

        try {
            const results = await searchPlace(query);
            setPlaces(results);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    // Load paths when a place or sport is selected
    useEffect(() => {
        if (!selectedPlace) return;

        async function loadPaths() {
            setLoading(true);
            setError("");

            try {
                const results = await getNearbyPaths(
                    sport,
                    selectedPlace.lat,
                    selectedPlace.lon,
                );

                setPaths(results);
            } catch (err) {
                setError(err.message);
            }

            setLoading(false);
        }

        loadPaths();
    }, [selectedPlace, sport]);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
            {/* Search and results */}
            <section className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Explore</h1>

                {/* Search bar */}
                <form onSubmit={search} className="flex flex-col gap-3">
                    <label>Search for a place</label>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. Kuopio"
                        className="rounded-lg border px-3 py-2"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-orange-700 py-2 text-white hover:bg-orange-800 transition-colors disabled:bg-orange-300"
                    >
                        Search
                    </button>
                </form>

                {/* Choose a sport */}
                <div className="flex gap-5 text-sm text-stone-700">
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                        type="radio"
                        name="sport"
                        checked={sport === "run"}
                        onChange={() => setSport("run")}
                        className="accent-orange-700"
                        />
                        Run
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                        type="radio"
                        name="sport"
                        checked={sport === "cycling"}
                        onChange={() => setSport("cycling")}
                        className="accent-orange-700"
                        />
                        Cycling
                    </label>
                </div>

                {/* Loading and error messages */}
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {/* Show places */}
                {places.map((place) => (
                    <button
                        key={`${place.lat}-${place.lon}`}
                        onClick={() => {
                            setSelectedPlace(place);
                            setPaths([]);
                        }}
                        className="rounded-lg border bg-white p-3 text-left"
                    >
                        {place.name}
                    </button>
                ))}

                {/* Show the number of paths found */}
                {selectedPlace && !loading && (
                    <p>
                        {paths.length > 0
                            ? `${paths.length} paths found.`
                            : "No paths found nearby."}
                    </p>
                )}
            </section>

            {/* Map */}
            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={12}
                className="h-[650px] rounded-xl border border-stone-300 md:h-[90vh]"
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <RecenterMap place={selectedPlace} />

                {/* Show selected place */}
                {selectedPlace && (
                    <CircleMarker
                        center={[selectedPlace.lat, selectedPlace.lon]}
                        radius={8}
                    />
                )}

                {/* Show paths on the map */}
                {paths.map((path) => (
                    <Polyline
                        key={path.id}
                        positions={path.positions}
                        pathOptions={{ color: "#c2410c", weight: 4 }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
