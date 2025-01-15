"use client";

import Logo from "./Logo";

import UserMenu from "./UserMenu";

const NavbarAdmin: React.FC = () => {
  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
        <div className="flex flex-row px-8 items-center gap-3">
          <Logo />
        </div>
        <UserMenu />
      </div>
      <div className="mt-4 flex gap-6">
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Announcements
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Add Announcement
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Clubs
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Add Club
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Student Subjects
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Teacher Subjects
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Make Admin
        </button>
        <button className="text-blue-500 font-extrabold hover:text-gray-500 py-2 px-4 rounded">
          Make Teacher
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;