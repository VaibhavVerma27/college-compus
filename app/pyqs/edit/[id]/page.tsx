"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";

export default function EditPyqPage() {
  const { id } = useParams();
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [papers, setPapers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchPyq() {
      try {
        const res = await axios.get(`/api/pyqs/${id}`);
        if (res.status === 200) {
          const { subjectName, subjectCode, year, papers } = res.data;
          setSubjectName(subjectName);
          setSubjectCode(subjectCode);
          setYear(year);
          setPapers(papers);
        }
      } catch (error) {
        console.error("Error fetching PYQ:", error);
      }
    }
    fetchPyq();
  }, [id]);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      setPapers((prev) => [...prev, result.info.secure_url]);
    }
  };

  const handleRemovePaper = (index: number) => {
    setPapers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectName || !subjectCode || !year || isNaN(year) || !papers.length) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`/api/pyqs/${id}`, {
        subjectName,
        subjectCode,
        year,
        papers,
      });

      if (res.status === 200) {
        router.push("/pyqs/my-pyqs");
      } else {
        alert("Failed to update PYQ. Please try again.");
      }
    } catch (error) {
      console.error("Error updating PYQ:", error);
      alert("An error occurred while updating the PYQ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-16 pb-10 px-4">
      <div className="w-full max-w-2xl bg-gray-950 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-yellow-500 mb-6 text-center">Edit PYQ</h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1">Subject Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Subject Code</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Year</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Papers</label>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
              onSuccess={handleUpload}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              Upload Paper
            </CldUploadButton>

            {papers.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {papers.map((paper, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={paper}
                      alt="paper"
                      className="w-full h-24 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      onClick={() => handleRemovePaper(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update PYQ"}
          </button>
        </form>
      </div>
    </div>
  );
}
