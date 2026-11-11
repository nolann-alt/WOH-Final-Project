const STORAGE_KEY = "activities"; // Key used to store activities in localStorage

// Get activities from localStorage or fetch from JSON file if not present
export async function getActivities() {
    // Check if activities are already saved in localStorage
    const savedActivities = localStorage.getItem(STORAGE_KEY);

    // If activities are found in localStorage, parse and return them
    if (savedActivities) {
        // parse is used to convert the string back into an array of objects
        return JSON.parse(savedActivities);
    }

    // If not found in localStorage, fetch from the JSON file in the public folder
    const response = await fetch(
        `${import.meta.env.BASE_URL}activities.json`
    );

    // If the fetch fails, throw an error
    if (!response.ok) {
        throw new Error("Could not load activities");
    }

    // Parse the JSON response and save it to localStorage for future use
    // because the data is static, we can store it in localStorage to avoid fetching it again
    const activities = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));

    return activities;
}

// Save activities to localStorage
export function saveActivities(activities) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}