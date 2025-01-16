"use client";

import {useSession} from "next-auth/react";
import AdminHomePage from "@/components/homepage/admin";
import TeacherHomePage from "@/components/homepage/teacher";
import StudentHomePage from "@/components/homepage/student";

export default function HomePage() {
  const session= useSession();

  if (!session.data?.user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
          <div className="text-blue-500 text-4xl text-center font-bold pt-8">Login to see website</div>
        </div>
      </>
    )
  }

  if (session.data && !session.data.user.isStudent) {
    if (session.data.user.isAdmin) {
      return (
        <AdminHomePage />
      )
    } else if (session.data.user.isTeacher) {
      return (
        <TeacherHomePage />
      )
    } else {
      return (
        <>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="text-blue-500 text-4xl text-center font-bold pt-8">Wait for admin verification</div>
          </div>
        </>
      )
    }
  }


  return <StudentHomePage />
}
