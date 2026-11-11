# SportLog
SportLog is a React web application for tracking running, cycling, and walking activities.

Users can:

- View activity statistics on the dashboard
- See recent activities
- Search, filter, and sort activities
- Add new activities
- Edit and delete activities
- Add extra information such as location, calories, heart rate, cadence, and power
- Draw an activity route by clicking points on a map
- Search for places and nearby running or cycling paths

## Technologies
- React
- Vite
- React Router
- Tailwind CSS
- React Leaflet
- Recharts
- OpenStreetMap
- Nominatim API
- Overpass API

## APIs
The Explore page uses the Nominatim API to search for cities and places.

It uses the Overpass API to find nearby running tracks, cycling paths, parks, and other paths stored in OpenStreetMap.

The results are displayed on an interactive map using React Leaflet.

## Installation
Clone the repository:
```bash
git clone https://github.com/nolann-alt/WOH-Final-Project.git
```
Open the project folder
```bash
cd WOH-Final-Project
```

Intall the project depedencies
```bash
npm install
```

Launch the project to access it from your web browser
```bash
npm run dev
```