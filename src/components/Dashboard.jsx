import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import StatTile from "../components/StatTile";

// Sample fallback bar chart data matching days Mon-Sun
const weeklyData = [
    { day: "Mon", km: 4 },
    { day: "Tue", km: 8 },
    { day: "Wed", km: 3 },
    { day: "Thu", km: 12 },
    { day: "Fri", km: 5 },
    { day: "Sat", km: 10 },
    { day: "Sun", km: 2 },
];

export default function Dashboard() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UseEffect to load the data from the json in /public
    useEffect(() => {
        // Fetch JSON activity data from public folder
        async function loadData() {
            try {
                setLoading(true); // setLoading allows us to show a loading state while the data is being fetched
                const response = await fetch("/activities.json");
                // Check if the response is ok, if not throw an error
                if (!response.ok) {
                    throw new Error("Failed to load activity data");
                }
                const data = await response.json();
                setActivities(data); // Set the activities state with the fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Display a message when the data are loading
    if (loading) {
        return (
            <div className="p-8 text-center text-gray-600">Loading dashboard...</div>
        );
    }

    // Display an error message if no data is found
    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    // Take the 3 most recent activities for the sidebar list
    const recentActivities = activities.slice(0, 3);

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Top 4 Stat Tiles Grid (the reusable component) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <StatTile title="124" label="km this month" />
                    <StatTile title="18" label="activities" />
                    <StatTile title="11h" label="total time" />
                    <StatTile title="5:23" label="avg pace /km" />
                </div>  

                {/* Main Content Grid: Chart (2/3 width) + Recent Activities (1/3 width) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Weekly Distance Chart */}
                    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">
                            Weekly distance (km)
                        </h2>
                        <div className="h-64 w-full">
                            {/*Responsive Container ensure the chart resizes smoothly whenever the screen size changes */}
                            <ResponsiveContainer width="100%" height="100%">
                                {/* Draws the main bar chart using the weekly data array */}
                                <BarChart data={weeklyData}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                    />
                                    <Bar dataKey="km" fill="#c8410c" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activities Side Panel */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Recent activities
                        </h2>

                        {/* List of Recent Activity Cards */}
                        <div className="space-y-3">
                            {recentActivities.map((act) => {
                                // Calculate distance (meters to km) and duration (seconds to min)
                                const distanceKm = (act.distance / 1000).toFixed(1);
                                const durationMin = Math.round(act.moving_time / 60);

                                return (
                                    <div
                                        key={act.id}
                                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-900">{act.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1"> {distanceKm} km · {durationMin} min</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Link to full Activities screen */}
                        <div>
                            <Link
                                to="/activities"
                                className="text-sm font-semibold text-[#c8410c] hover:underline">
                                See all activities
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
