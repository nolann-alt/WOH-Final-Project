import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getActivities, saveActivities } from "../utils/activitiesStorage";


// ActivityForm component for adding a new activity
export default function ActivityForm() {
    const { id } = useParams();
    const navigate = useNavigate(); // Hook to programmatically navigate to another route
    const isEditing = Boolean(id);

    // State to hold form data
    const [formData, setFormData] = useState({
        name: "",
        type: "Run",
        distance: "",
        moving_time: "",
        start_date: new Date().toISOString().slice(0, 16),
        description: "",
        location: "",
        calories: "",
        heart_rate: "",
        cadence: "",
        power: "",
    });

    // UseEffect to load existing activity data if editing an activity
    // Without the useEffect, the form would not populate with existing data when editing an activity.
    useEffect(() => {
        // If not editing, no need to load existing data
        if (!isEditing) return;

        // Load the existing activity data for editing
        async function loadActivity() {
            const activities = await getActivities(); // Fetch existing activities from localStorage or JSON file

            // Find the activity that matches the ID from the URL
            const activity = activities.find(
                (item) => String(item.id) === String(id)
            );
            
            // If the activity is not found, alert the user and navigate back to the activities list
            if (!activity) {
                alert("Activity not found.");
                navigate("/activities");
                return;
            }
            
            // Populate the formData state with the existing activity data for editing
            setFormData({
                name: activity.name || "",
                type: activity.type || "Run",
                distance: activity.distance ? activity.distance / 1000 : "",
                moving_time: activity.moving_time
                    ? activity.moving_time / 60
                    : "",
                start_date: activity.start_date
                    ? activity.start_date.slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                description: activity.description || "",
                location: activity.location || "",
                calories: activity.calories || "",
                heart_rate: activity.heart_rate || "",
                cadence: activity.cadence || "",
                power: activity.power || "",
            });
        }

        loadActivity(); // Call the funtion to load the activity data
    }, [id, isEditing, navigate]); // Dependencies ensure the effect runs when the ID or editing state changes

    // Handle input changes and update the formData state
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // Handle form submission and save the new activity
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Validate required fields
        if (!formData.name || !formData.distance || !formData.moving_time) {
            alert("Please complete the name, distance, and time.");
            return;
        }

        // Fetch existing activities from localStorage or JSON file
        const activities = await getActivities();

        // Create a new activity object with the form data
        // If optional fields are empty, they will be set to null
        const activityData = {
            name: formData.name,
            type: formData.type,
            distance: Number(formData.distance) * 1000,
            moving_time: Number(formData.moving_time) * 60,
            start_date: new Date(formData.start_date).toISOString(),
            description: formData.description,
            location: formData.location,
            calories: formData.calories ? Number(formData.calories) : null,
            heart_rate: formData.heart_rate
                ? Number(formData.heart_rate)
                : null,
            cadence: formData.cadence
                ? Number(formData.cadence)
                : null,
            power: formData.power ? Number(formData.power) : null,
            };
            
            // If editing, update the existing activity; otherwise, add a new activity
            let updatedActivities;
            if (isEditing) {
                updatedActivities = activities.map((activity) =>
                    String(activity.id) === String(id)
                    ? { ...activity, ...activityData }
                    : activity
                );
            } else {
            const newActivity = {
                id: Date.now(),
                ...activityData,
                route: [],
            };
            updatedActivities = [...activities, newActivity];
        }
        

        // Save the new activity to localStorage and navigate back to the activities page
        saveActivities(updatedActivities);
        navigate("/activities");
    }

    return (
        <div className="mx-auto max-w-xl">

            {/* Back button to navigate back to the activities list */}
            <Link
                to="/activities"
                className="text-sm text-orange-700 hover:underline"
            >
                &larr; Back to activities
            </Link>

            {/* Form for adding a new activity */}
            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow"
            >
                {/* Form title */}
                <h1 className="text-2xl font-bold">
                    {isEditing ? "Edit activity" : "Add activity"}
                </h1>

                {/* Input fields for activity details */}
                <div>
                    <label className="mb-1 block">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Morning run"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                    >
                        <option value="Run">Run</option>
                        <option value="Ride">Ride</option>
                        <option value="Walk">Walk</option>
                    </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block">Distance in km</label>
                        <input
                            type="number"
                            name="distance"
                            min="0"
                            step="0.1"
                            value={formData.distance}
                            onChange={handleChange}
                            placeholder="5.2"
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">Time in minutes</label>
                        <input
                            type="number"
                            name="moving_time"
                            min="0"
                            value={formData.moving_time}
                            onChange={handleChange}
                            placeholder="30"
                            className="w-full rounded border p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block">Date</label>
                    <input
                        type="datetime-local"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block">Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Paris"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block">Calories</label>
                        <input
                            type="number"
                            name="calories"
                            min="0"
                            value={formData.calories}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">Heart rate</label>
                        <input
                            type="number"
                            name="heart_rate"
                            min="0"
                            value={formData.heart_rate}
                            onChange={handleChange}
                            placeholder="bpm"
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">Cadence</label>
                        <input
                            type="number"
                            name="cadence"
                            min="0"
                            value={formData.cadence}
                            onChange={handleChange}
                            placeholder="rpm or steps/min"
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">Power</label>
                        <input
                            type="number"
                            name="power"
                            min="0"
                            value={formData.power}
                            onChange={handleChange}
                            placeholder="watts"
                            className="w-full rounded border p-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-orange-700 py-2 font-semibold text-white hover:bg-orange-800"
                >
                    {isEditing ? "Save changes" : "Add activity"}
                </button>
            </form>
        </div>
    );
}