"use client";

import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";

const NavbarTeacher = () => {
  const router = useRouter();

  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      {/* Top section: Logo and UserMenu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center px-4">
          <Logo />
        </div>
        <div>
          <UserMenu handleNavigate={() => router.push("/dashboard/teacher")} />
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-4 overflow-x-auto md:overflow-visible">
        <div
          className={`flex gap-4 text-lg font-archivo whitespace-nowrap md:flex-wrap md:justify-evenly`}
        >
          <button
            className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
            onClick={() => router.push("/teacher/announcements")}
          >
            Announcements
          </button>
          <button
            className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
            onClick={() => router.push("/teacher/announcements/add")}
          >
            Add Announcement
          </button>
          <button
            className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
            onClick={() => router.push("/teacher/marks")}
          >
            Upload Marks
          </button>
          <button
            className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
            onClick={() => router.push("/teacher/show-marks")}
          >
            Show Marks
          </button>
          <button
            className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
            onClick={() => router.push("/teacher/subjects")}
          >
            Subjects
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarTeacher;
