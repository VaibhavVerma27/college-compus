"use client";

import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";

const NavbarAdmin: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      {/* Top section: Logo and UserMenu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="">
          <UserMenu handleNavigate={() => {}} />
        </div>
      </div>

      {/* Menu Items */}
      <div
        className={`block mt-4 md:flex md:gap-6 md:items-center justify-evenly text-lg font-archivo`}
      >
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/announcements")}
        >
          Announcements
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/announcements/add")}
        >
          Add Announcement
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/clubs")}
        >
          Clubs
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/clubs/add-club")}
        >
          Add Club
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/subjects/students")}
        >
          Student Subjects
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/subjects/teachers")}
        >
          Teacher Subjects
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/user/make-admin")}
        >
          Make Admin
        </button>
        <button
          className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded"
          onClick={() => router.push("/admin/user/make-teacher")}
        >
          Make Teacher
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
