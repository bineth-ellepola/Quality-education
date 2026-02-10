function ContentCard({ content }) {

  const deleteContent = async () => {
    await fetch(`http://localhost:5000/api/contents/${content._id}`, {
      method: "DELETE"
    });
    window.location.reload();
  };

  return (
    <div className="card">
      <h3>{content.title}</h3>
      <p>{content.subject}</p>
      <p>{content.contentType}</p>
      <a href={content.resourceLink} target="_blank">Open</a>
      <br />
      <button onClick={deleteContent}>Delete</button>
    </div>
  );
}

export default ContentCard;
