import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NoticeDetails = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/notice/${id}`);
        setNotice(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 50);
      }
    };
    fetchNotice();
  }, [id]);

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOC";
    if (["xls", "xlsx"].includes(ext)) return "XLS";
    return "FILE";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) return <div className="s-loading">Loading...</div>;
  if (!notice) return <div className="s-error">Notice not found.</div>;

  return (
    <div className="s-wrapper">
      <style>{css}</style>
      <div className={`s-page ${visible ? "is-visible" : ""}`}>

        {/* Navigation / Header */}
        <header className="s-header">
          <div className="s-breadcrumb">
            <span>Notices</span>
            <span className="s-sep">/</span>
            <span className="s-current">{notice.course?.title || "Details"}</span>
          </div>
          <div className="s-date-badge">{formatDate(notice.createdAt)}</div>
        </header>

        <main className="s-content-box">
          <h1 className="s-h1">{notice.title}</h1>

          <div className="s-meta-row">
            {notice.instructor?.name && (
              <div className="s-chip">
                <span className="s-chip-label">Instructor:</span>
                <span className="s-chip-val">{notice.instructor.name}</span>
              </div>
            )}
            <div className="s-chip">
              <span className="s-chip-label">Category:</span>
              <span className="s-chip-val">General</span>
            </div>
          </div>

          <div className="s-divider" />

          {/* ✅ Render HTML from rich text editor */}
          <section
            className="s-body-text"
            dangerouslySetInnerHTML={{ __html: notice.description }}
          />

          {notice.attachments?.length > 0 && (
            <section className="s-attachments-section">
              <h4 className="s-subheading">Attachments</h4>
              <div className="s-file-list">
                {notice.attachments.map((file, i) => (
                  <a key={i} href={file.url} download={file.filename} className="s-file-item">
                    <div className="s-file-type">{getFileIcon(file.filename)}</div>
                    <span className="s-file-name">{file.filename}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const css = `
:root {
  --s-bg: #ffffff;
  --s-bg-alt: #f7f7f8;
  --s-border: #e2e2e4;
  --s-text: #1a1a1e;
  --s-text-sec: #63636e;
  --s-accent: #0066ff;
}

.s-wrapper {
  background: var(--s-bg-alt);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--s-text);
  display: flex;
  justify-content: center;
}

.s-page {
  width: 100%;
  max-width: 800px;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease-out;
}
.s-page.is-visible { opacity: 1; transform: translateY(0); }

.s-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.s-breadcrumb {
  display: flex;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--s-text-sec);
}
.s-sep { color: #ccc; }
.s-current { color: var(--s-text); }

.s-date-badge {
  font-size: 12px;
  background: #eee;
  padding: 4px 10px;
  border-radius: 100px;
  font-weight: 500;
}

.s-content-box {
  background: var(--s-bg);
  border: 1px solid var(--s-border);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.s-h1 {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.s-meta-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.s-chip {
  display: flex;
  gap: 6px;
  background: var(--s-bg-alt);
  border: 1px solid var(--s-border);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
}
.s-chip-label { color: var(--s-text-sec); }
.s-chip-val { font-weight: 500; }

.s-divider {
  height: 1px;
  background: var(--s-border);
  margin: 32px 0;
}

/* Rich text content styles */
.s-body-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 40px;
}

.s-body-text b,
.s-body-text strong { font-weight: 600; }

.s-body-text i,
.s-body-text em { font-style: italic; }

.s-body-text u { text-decoration: underline; }

.s-body-text s,
.s-body-text strike { text-decoration: line-through; }

.s-body-text h1 { font-size: 26px; font-weight: 600; margin: 16px 0 8px; }
.s-body-text h2 { font-size: 22px; font-weight: 600; margin: 14px 0 8px; }
.s-body-text h3 { font-size: 18px; font-weight: 600; margin: 12px 0 6px; }

.s-body-text blockquote {
  border-left: 3px solid #e2e2e4;
  margin: 12px 0;
  padding: 6px 16px;
  color: #63636e;
  font-style: italic;
}

.s-body-text ul {
  list-style: disc;
  padding-left: 24px;
  margin: 8px 0;
}

.s-body-text ol {
  list-style: decimal;
  padding-left: 24px;
  margin: 8px 0;
}

.s-body-text li { margin: 4px 0; }

.s-body-text a {
  color: #0066ff;
  text-decoration: underline;
}

.s-body-text a:hover { opacity: 0.8; }

.s-subheading {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--s-text-sec);
  margin-bottom: 16px;
}

.s-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.s-file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid var(--s-border);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.s-file-item:hover {
  border-color: var(--s-accent);
  background: #f0f7ff;
}

.s-file-type {
  font-size: 10px;
  font-weight: 700;
  background: #000;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 12px;
}

.s-file-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.s-file-item svg {
  opacity: 0.3;
  transition: opacity 0.2s;
}
.s-file-item:hover svg { opacity: 1; color: var(--s-accent); }

@media (max-width: 600px) {
  .s-content-box { padding: 24px; }
  .s-meta-row { flex-direction: column; }
}
`;

export default NoticeDetails;