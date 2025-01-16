"use client";

import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";

const NavbarTeacher: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      {/* Top section: Logo and UserMenu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center px-4">
          <Logo />
        </div>
        <div className="">
          <UserMenu handleNavigate={() => router.push("/dashboard/teacher")} />
        </div>
      </div>

      {/* Menu Items */}
      <div
        className={`block mt-4 md:flex md:gap-6 md:items-center justify-evenly text-lg font-archivo`}
      >
        <button
          className="block md:inline text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/teacher/announcements")}
        >
          Announcements
        </button>
        <button
          className="block md:inline text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/teacher/announcements/add")}
        >
          Add Announcement
        </button>
        <button
          className="block md:inline text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/teacher/marks")}
        >
          Upload Marks
        </button>
        <button
          className="block md:inline text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/teacher/show-marks")}
        >
          Show Marks
        </button>
        <button
          className="block md:inline text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/teacher/subjects")}
        >
          Subjects
        </button>
      </div>
    </div>
  );
};

export default NavbarTeacher;
