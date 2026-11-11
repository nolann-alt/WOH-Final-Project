import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getActivities,
  saveActivities,
} from "../utils/activitiesStorage";

export default function ActivityDetail() {
  // 1. Get the activity ID from the URL path (/activities/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadActivity() {
      try {
        setLoading(true);
        // Fetch the activity list
        const data = await getActivities();

        // Find the single activity matching the URL id
        const foundActivity = data.find((item) => String(item.id) === String(id));
        if (!foundActivity) {
          throw new Error("Activity not found");
        }

        setActivity(foundActivity);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, [id]);

  // Loading state
  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading activity...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center text-red-500 space-y-4">
        <p>Error: {error}</p>
        <Link to="/activities" className="text-sm font-semibold text-[#c8410c] underline">
          &larr; Back to activities
        </Link>
      </div>
    );
  }

  function deleteActivity() {
    // Confirm deletion with the user
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    // Remove the activity from the list and save the updated list
    getActivities().then((activities) => {
      const updatedActivities = activities.filter(
        (item) => String(item.id) !== String(id)
      );

      // Save the updated activities list to localStorage
      saveActivities(updatedActivities);
      navigate("/activities");
    });
  }

  // Convert stats to readable numbers
  const distanceKm = (activity.distance / 1000).toFixed(1);
  const durationMin = Math.round(activity.moving_time / 60);

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back button */}
        <Link to="/activities" className="text-sm font-semibold text-[#c8410c] hover:underline">
          &larr; Back to activities
        </Link>

        {/* Activity Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{activity.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activity.type} · {activity.start_date.slice(0, 10)}
          </p>
        </div>

        {/* Stat Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-3xl font-bold text-gray-900">{distanceKm} km</h3>
            <p className="text-sm text-gray-500 mt-1">Distance</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-3xl font-bold text-gray-900">{durationMin} min</h3>
            <p className="text-sm text-gray-500 mt-1">Moving time</p>
          </div>
        </div>

        <button
          type="button"
          onClick={deleteActivity}
          className="rounded-lg bg-red-600 mt-2 text-white py-2 px-2 hover:bg-red-700 transition-colors"
        >
          Delete
        </button>

      </div>
    </div>
  );
}