import { useEffect, useState } from "react";
import ContentCard from "./ContentCard";

function ContentList() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/contents")
      .then(res => res.json())
      .then(data => setContents(data));
  }, []);

  return (
    <div>
      <h2>Learning Contents</h2>
      {contents.map(content => (
        <ContentCard key={content._id} content={content} />
      ))}
    </div>
  );
}

export default ContentList;
