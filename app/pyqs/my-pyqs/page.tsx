"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";
import DotsLoader from "@components/loading/dotLoader";

interface Pyq {
  _id: mongoose.Types.ObjectId;
  subjectName: string;
  subjectCode: string;
  year: number;
  papers: string[];
}

export default function MyPyqPage() {
  const [pyqs, setPyqs] = useState<Pyq[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPyqs() {
      setLoading(true);
      try {
        const res = await axios.get("/api/pyqs/my-pyqs");
        if (res.status === 200) {
          setPyqs(res.data);
        } else {
          console.error("Failed to fetch PYQs");
        }
      } catch (error) {
        console.error("Error fetching PYQs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPyqs();
  }, []);

  async function handleDelete(pyqId: string) {
    try {
      const res = await axios.delete(`/api/pyqs/${pyqId}`);
      if (res.status === 200) {
        setPyqs((prev) => prev?.filter((pyq) => pyq._id.toString() !== pyqId) ?? null);
      }
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting PYQ:", error);
    }
  }

  if (loading || !pyqs) {
    return <DotsLoader />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <div className="w-full py-4 bg-gray-950 shadow-lg flex justify-center gap-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
          onClick={() => router.push("/pyqs")}
        >
          PYQ
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold"
          onClick={() => router.push("/pyqs/add")}
        >
          Add PYQ
        </button>
      </div>

      {/* PYQ List */}
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">My Uploaded PYQs</h1>
        {pyqs.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">No PYQs available.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {pyqs.map((pyq) => (
              <div key={pyq._id.toString()} className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{pyq.subjectName} ({pyq.subjectCode})</h2>
                <p className="text-gray-400">Year: {pyq.year}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pyq.papers.map((paper, index) => (
                    <a
                      key={index}
                      href={paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Paper {index + 1}
                    </a>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    onClick={() => router.push(`/pyqs/edit/${pyq._id.toString()}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => setDeleteId(pyq._id.toString())}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <p className="text-white text-lg">Are you sure you want to delete this PYQ?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(deleteId)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setDeleteId(null)}
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
