'use client';

import React, { useEffect, useState } from 'react';
import axios from "axios";
import {useParams, useRouter} from 'next/navigation';
import { FaIdCard, FaGraduationCap, FaSchool } from "react-icons/fa";
import DotsLoader from "../../../components/loading/dotLoader";
import {useModel} from "@/hooks/user-model-store";

export default function OtherUserProfile (){
  const {user, setUser} = useModel();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`/api/user/${params.id}`);
        if (res.status === 200) {
          setUser(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id, router, setUser]);
  
  if (loading) return <DotsLoader />;
  if (!user) return <p className="text-center text-white">User not found</p>;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <img
              src={user.profile}
              width={120}
              height={120}
              className="rounded-full shadow-lg border-4 border-blue-500"
              alt="User Profile"
            />
            <div>
              <h1 className="text-4xl font-bold text-blue-400">{user.name}</h1>
              <div className="mt-2 text-gray-300 space-y-1">
                <div className="flex items-center space-x-2">
                  <FaIdCard className="text-yellow-400" />
                  <p>Student ID: {user.student_id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="text-green-400" />
                  <p>Branch: {user.branch}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaSchool className="text-pink-400" />
                  <p>Semester: {user.semester}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Friends Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">Friends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.friends.map(friend => (
              <div key={friend._id.toString()} className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <img
                  src={friend.profile}
                  width={60}
                  height={60}
                  className="rounded-full"
                  alt="Friend Profile"
                />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">{friend.name}</h3>
                  <p className="text-sm text-gray-400">Student ID: {friend.student_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clubs Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-green-400 mb-6">Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.clubsPartOf.map(club => (
              <div key={club._id.toString()} className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <img src={club.clubLogo} width={60} height={60} className="rounded-full" alt={club.clubName} />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">{club.clubName}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clubs Head Of Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-red-400 mb-6">Clubs Head Of</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.clubsHeadOf.map(club => (
              <div key={club._id.toString()} className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <img src={club.clubLogo} width={60} height={60} className="rounded-full" alt={club.clubName} />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">{club.clubName}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Interested Events Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">Interested Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.interestedEvents.map(event => (
              <div key={event._id.toString()} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-blue-300">{event.heading}</h3>
                <p className="text-sm text-gray-400">Venue: {event.eventVenue}</p>
                <p className="text-sm text-gray-400">Time: {new Date(event.eventTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}