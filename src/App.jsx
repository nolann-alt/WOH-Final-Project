import { Routes, Route } from "react-router-dom";
import Activities from './components/Activities';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Navbar from './components/Navbar';
import ActivityDetail from "./pages/ActivityDetail";

function App() {

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Navbar/>
      <main className="max-w-[1100] mx-auto px-6 py-8">
         {/* Route for the navbar with HashRouter into the main.jsx component, so the page does not have to refresh */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
