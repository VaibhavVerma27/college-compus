"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {useModel} from "@/hooks/user-model-store";
import {useRouter} from "next/navigation";
import DotsLoader from "../../../components/loading/dotLoader";
import mongoose from "mongoose";
import Link from "next/link";
export default function FriendsPage() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<{ _id: mongoose.Types.ObjectId, name: string, student_id: string, profile: string }|null>(null);
  const { friends, setFriends, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`https://college-compus.vercel.app/api/user/friends`);
        if (res.status === 200) {
          setFriends(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching friends", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setFriends, setLoading, router]);

  if (!friends) {
    return <DotsLoader />;
  }

  async function removeFriend (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`https://college-compus.vercel.app/api/user/friends/remove-friend/${to}/${from}`)

      if (res.status === 200 && friends) {
        setFriends({
          _id: friends._id,
          friends: friends.friends.filter(friend => friend._id.toString() !== from),
        });
      }
    } catch (error) {
      console.error("Failed to remove friend", error);
    } finally {
      setLoading(false);
      setShowPopup(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-auto">
      {/* Page Header */}
      {/* <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Your Friends
        </h1>
      </div> */}

      {/* Friends List */}
      <div className="flex flex-col items-center px-4">
        {friends.friends.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            You have no friends yet. Add some to get started!
          </div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh]">
            {friends.friends.map((friend) => (
              <div
                key={friend._id.toString()}
                className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profile}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <Link href={`/user/${friend._id}`} className="text-lg font-semibold text-white">{friend.name}</Link>
                    <div className="text-sm text-gray-400">{friend.student_id}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {/* Remove Friend Button */}
                  <button
                    className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => {
                      setSelectedFriend(friend);
                      setShowPopup(true);
                    }}
                  >
                    Remove Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Popup */}
      {showPopup && selectedFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-xl font-bold text-white">Confirm Removal</h2>
            <p className="text-gray-400 mt-2">
              Are you sure you want to remove <span className="font-semibold">{selectedFriend.name}</span> as a friend?
            </p>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-lg font-semibold shadow-lg"
                onClick={() => removeFriend(friends._id.toString(), selectedFriend._id.toString())}
              >
                Yes, Remove
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}