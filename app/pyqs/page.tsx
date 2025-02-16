"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DotsLoader from "@components/loading/dotLoader";
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

export default function PyqPage() {
  const [pyqs, setPyqs] = useState<Pyq[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const router = useRouter();

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

  const filteredPyqs = pyqs?.filter((pyq) => {
    return (
      (search === "" || pyq.subjectName.toLowerCase().includes(search.toLowerCase())) &&
      (filterYear === "" || pyq.year.toString().includes(filterYear)) &&
      (filterCode === "" || pyq.subjectCode.toLowerCase().includes(filterCode.toLowerCase()))
    );
  });

  if (loading || !pyqs) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <div className="w-full py-4 bg-gray-950 shadow-md flex justify-center gap-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition"
          onClick={() => router.push("/pyqs/my-pyqs")}
        >
          📜 My PYQS
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold transition"
          onClick={() => router.push("/pyqs/add")}
        >
          ➕ Add PYQ
        </button>
      </div>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Search & Filters</h2>
        <input
          type="text"
          placeholder="Search by Subject Name"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder="Filter by Year"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Subject Code"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
          />
        </div>
      </div>

      {/* PYQ List */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-400">Previous Year Questions</h1>
        {filteredPyqs?.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">No PYQs available.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPyqs?.map((pyq) => (
              <div key={pyq._id.toString()} className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 transition-transform transform hover:scale-105">
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      Paper {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
