import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NoticePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive courseId from the state passed via navigate
  const { courseId } = location.state || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // JWT Token from localStorage
  const token = localStorage.getItem("token");

  // Handle file input change
  const handleFiles = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!title || !description) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Create FormData to send files and other fields
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("courseId", courseId); // match backend
      formData.append("isPublished", isPublished);

      attachments.forEach((file) => {
        formData.append("attachments", file); // backend should parse as array
      });

      const response = await axios.post(
        "http://localhost:5001/api/notice",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Notice created successfully!");
      setTitle("");
      setDescription("");
      setAttachments([]);
      setIsPublished(true);

      // Redirect back to course details after 1.5s
      setTimeout(() => navigate(`/course`), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Create Notice</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3f7d20]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3f7d20]"
              required
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attachments (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFiles}
              className="w-full text-sm"
            />
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
              id="publish"
              className="h-4 w-4 accent-[#3f7d20]"
            />
            <label htmlFor="publish" className="text-sm text-slate-700">
              Publish immediately
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3f7d20] text-white py-3 rounded-xl font-bold text-lg hover:bg-black transition-all"
          >
            {loading ? "Creating..." : "Create Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticePage;