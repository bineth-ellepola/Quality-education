import { useState } from "react";

function AddContent() {
  const [content, setContent] = useState({
    title: "",
    subject: "",
    description: "",
    contentType: "video",
    resourceLink: ""
  });

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/api/contents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    alert("Learning content added");
  };

  return (
    <div>
      <h2>Add Learning Content</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="subject" placeholder="Subject" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />

      <select name="contentType" onChange={handleChange}>
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
        <option value="article">Article</option>
      </select>

      <input name="resourceLink" placeholder="Resource Link" onChange={handleChange} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default AddContent;
