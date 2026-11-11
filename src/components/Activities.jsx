import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getActivities,
  saveActivities,
} from "../utils/activitiesStorage";

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for search, filter, and sort controls
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSport, setSelectedSport] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Fetch JSON data from public folder
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                // Use the getActivities function to fetch activities from localStorage or the JSON file
                const data = await getActivities();
                setActivities(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading activities...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    // 1. Filtering by search and sport
    const filteredActivities = activities.filter((act) => {
        // Check if the activity name matches the search box text
        const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if sport matches the selected option ('All' matches everything)
        const matchesSport = selectedSport === "All" || act.type === selectedSport;

        return matchesSearch && matchesSport;
    });

    // 2. sorting the filtered results
    const sortedActivities = [...filteredActivities].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.start_date) - new Date(a.start_date);
        }
        if (sortBy === "oldest") {
            return new Date(a.start_date) - new Date(b.start_date);
        }
        if (sortBy === "distance") {
            return b.distance - a.distance;
        }
        return 0;
    });

    // 3. Deleting an activity
    function deleteActivity(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) return;
        
        // Filter out the activity with the given id
        const updatedActivities = activities.filter(
            (activity) => activity.id !== id
        );

        // Update the state and save to localStorage
        setActivities(updatedActivities);
        saveActivities(updatedActivities);
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Top Controls: Search Input, Sport Filter, Sort Select */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Box */}
                    <input
                        type="text"
                        placeholder="Search activities"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 shadow-sm"
                    />

                    {/* Sport Filter Dropdown */}
                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 shadow-sm"
                    >
                        <option value="All">All sports</option>
                        <option value="Run">Run</option>
                        <option value="Ride">Ride</option>
                        <option value="Walk">Walk</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 shadow-sm"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="distance">Longest distance</option>
                    </select>
                </div>

                {/* Activity Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedActivities.map((act) => {
                        // Helper conversions
                        const distanceKm = (act.distance / 1000).toFixed(1);
                        const durationMin = Math.round(act.moving_time / 60);

                        // Calculate pace (minutes per km) if type is Run
                        let paceText = "";
                        if (act.type === "Run" && act.distance > 0) {
                            const totalMinutes = act.moving_time / 60;
                            const distanceKmNum = act.distance / 1000;
                            const paceMin = totalMinutes / distanceKmNum;
                            const paceMinutesPart = Math.floor(paceMin);
                            const paceSecondsPart = Math.round((paceMin - paceMinutesPart) * 60);
                            const formattedSec = paceSecondsPart < 10 ? `0${paceSecondsPart}` : paceSecondsPart;
                            paceText = ` · ${paceMinutesPart}:${formattedSec} /km`;
                        }

                        return (
                            // Link on each activities throughout all the activities
                            <Link 
                                key={act.id} 
                                to={`/activities/${act.id}`} 
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 transition-colors block">
                                <h3 className="font-bold text-gray-900 text-lg">{act.name}</h3>
                                <p className="text-sm text-gray-500 mt-2"> {act.type} · {distanceKm} km · {durationMin} min </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <p className="text-xs text-gray-400 mt-4">
                    Click a card to open the activity detail with the route map.
                </p>

            </div>
        </div>
    );
}