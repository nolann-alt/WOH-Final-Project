import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import StatTile from "../components/StatTile";
import { getActivities } from "../utils/activitiesStorage";

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
                const data = await getActivities();
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

    // Calculate monthly stats for the dashboard
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter activities for the current month and year
    const monthlyActivities = activities.filter((activity) => {
        const date = new Date(activity.start_date);

        // Check if the activity's month and year match the current month and year
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        );
    });

    // Filter running activities for the current month
    const runningActivities = monthlyActivities.filter(
        (activity) => activity.type === "Run"
    );

    // Calculate total distance and time for running activities
    const runningDistance = runningActivities.reduce(
        (total, activity) => total + activity.distance,
        0
    );

    // Calculate total moving time for running activities
    const runningTime = runningActivities.reduce(
        (total, activity) => total + activity.moving_time,
        0
    );

    // Calculate total distance and time for the current month
    const monthlyDistance = monthlyActivities.reduce(
        (total, activity) => total + activity.distance,
        0
    );

    // Calculate total moving time for the current month
    const totalTime = monthlyActivities.reduce(
        (total, activity) => total + activity.moving_time,
        0
    );

    // Convert total distance to kilometers and total time to hours for display
    const totalDistanceKm = (monthlyDistance / 1000).toFixed(1);
    const totalHours = (totalTime / 3600).toFixed(1);

    // Calculate average pace only for running activities
    const averagePace =
        runningDistance > 0
            ? runningTime / 60 / (runningDistance / 1000)
            : 0;

    // Format average pace as minutes and seconds
    const paceMinutes = Math.floor(averagePace);
    const paceSeconds = Math.round((averagePace - paceMinutes) * 60);

    const paceText = `${paceMinutes}:${String(paceSeconds).padStart(2, "0")}`;

    // Prepare weekly data for the bar chart (last 7 days)
    const weeklyData = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));

        // Calculate total distance for each day
        const distance = activities
            .filter((activity) => {
                const activityDate = new Date(activity.start_date);

                // Check if the activity's date matches the current date in the loop
                return activityDate.toDateString() === date.toDateString();
            })
            // Sum the distances of all activities for that day
            // This function takes the total distance and adds the distance of each activity to it
            .reduce((total, activity) => total + activity.distance, 0);

        // Return an object with the day of the week and distance in kilometers
        return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            km: Number((distance / 1000).toFixed(1)),
        };
    });

    // Get the 3 most recent activities for the side panel
    const recentActivities = [...activities]
        .sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
        )
        .slice(0, 3); // Sort by date descending and take the first 3

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Top 4 Stat Tiles Grid (the reusable component) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <StatTile title={totalDistanceKm} label="km this month" />
                    <StatTile
                        title={String(monthlyActivities.length)}
                        label="activities"
                    />
                    <StatTile title={`${totalHours}h`} label="total time" />
                    <StatTile title={paceText} label="avg pace /km" />
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
