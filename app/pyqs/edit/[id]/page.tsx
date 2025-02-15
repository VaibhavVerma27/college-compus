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
    setLoading(true);
    try {
      const res = await axios.patch(`/api/pyqs/${id}`, {
        subjectName,
        subjectCode,
        year: Number(year),
        papers,
      });

      if (res.status === 200) {
        router.push("/my-pyqs");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-950 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-yellow-500 mb-6 text-center">Edit PYQ</h1>

        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Subject Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Subject Code</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Year</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Papers</label>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
              onSuccess={handleUpload}
            />
            <div className="flex flex-wrap mt-4 gap-4">
              {papers.map((paper, index) => (
                <div key={index} className="relative">
                  <img
                    src={paper}
                    alt="paper"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700"
                  />
                  <button
                    onClick={() => handleRemovePaper(index)}
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-6 rounded-lg font-semibold shadow-lg text-white transition-all duration-300 ${
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
