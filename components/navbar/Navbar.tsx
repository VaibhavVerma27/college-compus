"use client";

import Categories from "./Categories";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import {useSession} from "next-auth/react";
import AdminNavbar from "@components/navbar/adminNavbar";
import TeacherNavbar from "@components/navbar/teacherNavbar";
import {useRouter} from "next/navigation";

const Navbar = ({}) => {
  const router = useRouter();
  const session= useSession();

  if (session.data && !session.data.user.isStudent) {
    if (session.data.user.isAdmin) {
      return (
        <AdminNavbar />
      )
    } else if (session.data.user.isTeacher) {
      return (
        <TeacherNavbar />
      )
    } else {
      return (
        <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <div className="flex flex-row px-8 items-center gap-3">
              <Logo/>
            </div>
            <UserMenu handleNavigate={() => {}} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-0" >
        <div className="flex flex-row px-8 items-center gap-3">
          <Logo/>
        </div>
        <UserMenu handleNavigate={() => router.push("/dashboard/student")} />
      </div>
      <Categories/>
    </div>
  );
};

export default Navbar;
