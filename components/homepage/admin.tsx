"use client";

import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();
  const adminFeatures = [
    {
      name: "Add Clubs",
      description: "Create and manage student clubs.",
      color: "text-blue-400",
      bgColor: "bg-blue-600",
      hover: "hover:bg-blue-700",
      route: "/admin/clubs/add-club",
    },
    {
      name: "Assign Subjects",
      description: "Assign subjects to teachers and students.",
      color: "text-green-400",
      bgColor: "bg-green-600",
      hover: "hover:bg-green-700",
      route: "/admin/subjects/students",
    },
    {
      name: "Add Announcements",
      description: "Broadcast important updates to everyone.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-600",
      hover: "hover:bg-yellow-700",
      route: "/admin/announcements/add",
    },
    {
      name: "Manage Roles",
      description: "Promote users to Admin, Teacher, or Student roles.",
      color: "text-red-400",
      bgColor: "bg-red-600",
      hover: "hover:bg-red-700",
      route: "/admin/user/make-admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <section className="py-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">
          Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
          {adminFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300"
              onClick={() => router.push(feature.route)}
            >
              <h3 className={`text-xl font-semibold ${feature.color} mb-4`}>
                {feature.name}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
              <button
                className={`mt-4 ${feature.bgColor} ${feature.hover} text-white py-2 px-4 rounded-lg`}
              >
                {feature.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
