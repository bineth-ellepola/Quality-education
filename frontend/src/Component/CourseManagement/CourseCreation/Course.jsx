import React, { useEffect, useState } from "react";
import axios from "axios";

function Course() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:5001/api/subjects/", {
          headers: {
            // add token if your API requires auth
            // Authorization: `Bearer ${token}`
          },
        });

        console.log("Fetched subjects:", response.data.subjects);

        // update state
        setSubjects(response.data.subjects || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Available Subjects</h1>

      {loading && <p>Loading subjects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <select className="border p-2 w-full">
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Course;