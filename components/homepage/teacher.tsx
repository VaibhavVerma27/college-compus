"use client";

import { useRouter } from "next/navigation";

export default function TeacherHomePage() {
  const router = useRouter();
  const teacherFeatures = [
    {
      name: "Make Announcements",
      description: "Share updates with your class.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-600",
      hover: "hover:bg-emerald-700",
      route: "/teacher/announcements/add",
    },
    {
      name: "Add Resources",
      description: "Upload materials for students.",
      color: "text-purple-400",
      bgColor: "bg-purple-600",
      hover: "hover:bg-purple-700",
      route: "/teacher/subjects",
    },
    {
      name: "Create Attendance Group",
      description: "Organize students into attendance groups.",
      color: "text-orange-400",
      bgColor: "bg-orange-600",
      hover: "hover:bg-orange-700",
      route: "/teacher/subjects",
    },
    {
      name: "Take Attendance",
      description: "Mark student attendance.",
      color: "text-teal-400",
      bgColor: "bg-teal-600",
      hover: "hover:bg-teal-700",
      route: "/teacher/subjects",
    },
    {
      name: "Upload Marks",
      description: "Submit student grades for exams.",
      color: "text-pink-400",
      bgColor: "bg-pink-600",
      hover: "hover:bg-pink-700",
      route: "/teacher/marks",
    },
    {
      name: "View Attendance",
      description: "Review attendance records.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-600",
      hover: "hover:bg-cyan-700",
      route: "/teacher/subjects",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <section className="py-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">
          Teacher Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
          {teacherFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300"
            >
              <h3 className={`text-xl font-semibold ${feature.color} mb-4`}>
                {feature.name}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
              <button
                className={`mt-4 ${feature.bgColor} ${feature.hover} text-white py-2 px-4 rounded-lg`}
                onClick={() => router.push(feature.route)}
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
