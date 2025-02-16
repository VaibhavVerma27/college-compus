"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";

interface Pyq {
  _id: mongoose.Types.ObjectId;
  subjectName: string;
  subjectCode: string;
  year: number;
  papers: string[];
  author: {
    name: string;
    student_id: string;
    profile: string;
  };
}

export default function AdminPyqPage() {
  const [pyqs, setPyqs] = useState<Pyq[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [selectedPyq, setSelectedPyq] = useState<Pyq | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPyqs() {
      setLoading(true);
      try {
        const res = await axios.get("/api/pyqs");
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

  const handleDelete = async () => {
    if (!selectedPyq) return;
    try {
      const res = await axios.delete(`/api/admin/pyqs/${selectedPyq._id.toString()}`);
      if (res.status === 200) {
        setPyqs(pyqs?.filter((pyq) => pyq._id.toString() !== selectedPyq._id.toString()) || null);
        setIsOpen(false);
      } else {
        alert("failed to delete pyq");
      }
    } catch (error) {
      console.error("Error deleting PYQ:", error);
    }
  };

  const filteredPyqs = pyqs?.filter((pyq) =>
    search === "" || pyq.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || !pyqs) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Search by Subject Name"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-400">Admin - Manage PYQs</h1>
        {filteredPyqs?.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">No PYQs available.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPyqs?.map((pyq) => (
              <div key={pyq._id.toString()} className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
                <h2 className="text-xl font-semibold text-blue-400">{pyq.subjectName} ({pyq.subjectCode})</h2>
                <p className="text-gray-300">Year: <span className="text-yellow-400">{pyq.year}</span></p>
                <p className="text-gray-300">Author: <span className="font-medium">{pyq.author.name}</span> ({pyq.author.student_id})</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pyq.papers.map((paper, index) => (
                    <a
                      key={index}
                      href={paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Paper {index + 1}
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSelectedPyq(pyq);
                    setIsOpen(true);
                  }}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
            <p className="text-gray-300 mt-2">Are you sure you want to delete this PYQ?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={() => setIsOpen(false)} className="bg-gray-600 px-4 py-2 rounded-lg text-white">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
