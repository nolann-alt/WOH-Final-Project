import React from 'react';

// Props: title (big text), label -> reusable component
export default function StatTile({ title, label }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}