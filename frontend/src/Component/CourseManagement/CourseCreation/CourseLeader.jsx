import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseLeader = () => {
  const { id } = useParams(); // Instructor ID from URL
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${id}`);
        setInstructor(response.data.data); // Assuming API returns { success, data }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch instructor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500">Loading instructor details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">{error}</div>
    );
  }

  if (!instructor) {
    return (
      <div className="text-slate-500 text-center mt-10">Instructor not found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-slate-200">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
          {instructor.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{instructor.name}</h1>
          <p className="text-green-700 font-medium">{instructor.role}</p>
          <p className="text-slate-400 font-mono text-sm mt-1">{instructor.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">About Instructor</h2>
        <p className="text-slate-600 leading-relaxed">
          {instructor.bio || "No bio available for this instructor."}
        </p>
      </div>
    </div>
  );
};

export default CourseLeader;