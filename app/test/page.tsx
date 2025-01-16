/* eslint-disable */

"use client";

import dynamic from "next/dynamic";

// Dynamically import the MapComponent with SSR disabled
const DynamicMapComponent = dynamic(
  () => import("../../components/map/mapComponent"),
  {ssr: false}
);


// @ts-ignore
export default function AddEventPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#0B0C10] p-4">

      <DynamicMapComponent />

      <div className="text-gray-300 mt-2">
        Select a location on the map to see coordinates.
      </div>
    </div>
  );
}
