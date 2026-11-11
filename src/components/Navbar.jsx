import { useState } from 'react';
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false); // is the phone menu open?
 
    // Active link = orange and bold, other links = gray with hover = orange
    const linkClass = ({ isActive }) =>
        isActive
        ? "py-2 text-sm font-bold text-orange-700 border-b-2 border-orange-700"
        : "py-2 text-sm text-stone-600 border-b-2 border-transparent hover:text-orange-700";



  return (
        <header className="bg-white border-b border-stone-200">
            <div className="max-w-[1100] mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                {/* Logo of the application*/}
                <span className="text-xl font-extrabold text-orange-700">SportLog</span>

                {/* Menu button: phones only, otherwise the menu is hidden, onClick the menu will open*/}
                <button
                    type="button"
                    className="md:hidden px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    onClick={() => setOpen(!open)}
                > 
                    {open ? "Close" : "Menu"} {/* If it's open we display close, otherwise menu */}
                </button>

                {/* Links: hidden on phones until the button is clicked, always visible on desktop */}
                <nav
                    className={`${open ? "flex" : "hidden"}
                    md:flex flex-col md:flex-row gap-1 md:gap-7 absolute md:static top-16 left-0 right-0 bg-white px-6 pb-3 md:p-0 border-b md:border-0 border-stone-200`}
                    onClick={() => setOpen(false)}
                >   
                    {/* Navbar link with the NavLink dunction so the only the url will refresh and not the entire website */}
                    <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
                    <NavLink to="/activities" className={linkClass}>Activities</NavLink>
                    <NavLink to="/explore" className={linkClass}>Explore</NavLink>
                </nav>
                </div>
            </div>
        </header>
  )
}

export default Navbar;