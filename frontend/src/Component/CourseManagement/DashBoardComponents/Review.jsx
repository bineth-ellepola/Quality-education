import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ReviewDashboard = ({ courseId, assessmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [marksError, setMarksError] = useState(false);
  const scoreBarRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/progress/submissions", {
          params: { courseId, assessmentId },
        });
        if (res.data.success) setSubmissions(res.data.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, assessmentId]);

  useEffect(() => {
    if (selected?.status === "graded" && scoreBarRef.current) {
      setTimeout(() => {
        if (scoreBarRef.current)
          scoreBarRef.current.style.width = selected.review.marks + "%";
      }, 80);
    }
  }, [selected]);
   

  const handleGrade = async (progressId) => {
    const m = parseInt(marks);
    if (isNaN(m) || m < 0 || m > 100) {
      setMarksError(true);
      return;
    }
    setMarksError(false);
    try {
      setSubmitting(true);
      const res = await axios.put(
        `http://localhost:5001/api/progress/${progressId}/grade`,
        { marks: m, feedback, instructorId: user._id }
      );
      if (res.data.success) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === progressId ? res.data.data : s))
        );
        setSelected(res.data.data);
        setMarks("");
        setFeedback("");
      }
    } catch (err) {
      console.error("Grading Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = submissions.filter((s) => {
    const matchSearch = s.studentId?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter =
      filterMode === "all" ||
      s.status === filterMode ||
      (filterMode === "pending" && s.status === "submitted");
    return matchSearch && matchFilter;
  });

  const graded = submissions.filter((s) => s.status === "graded").length;
  const pending = submissions.length - graded;

  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  const avatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=e8f0fe&color=185fa5&bold=true&size=104`;

  if (loading)
    return (
      <div style={styles.loadWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadText}>Loading submissions…</p>
      </div>
    );
console.log(courseId);
  return (
    <div style={styles.layout}>
      {/* ── SIDEBAR ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <p style={styles.sidebarTitle}>Review Dashboard</p>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { num: submissions.length, lbl: "Total", color: "#0f1117" },
              { num: graded, lbl: "Graded", color: "#059669" },
              { num: pending, lbl: "Pending", color: "#d97706" },
            ].map(({ num, lbl, color }) => (
              <div key={lbl} style={styles.statChip}>
                <div style={{ ...styles.statNum, color }}>{num}</div>
                <div style={styles.statLbl}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="#8b92a5" strokeWidth="1.5">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 13 13" strokeLinecap="round" />
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Search students…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.filterTabs}>
          {["all", "pending", "graded"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterMode(f)}
              style={{
                ...styles.ftab,
                ...(filterMode === f ? styles.ftabActive : {}),
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={styles.list}>
          {filtered.length === 0 && (
            <p style={styles.emptyList}>No submissions found</p>
          )}
          {filtered.map((s) => {
            console.log(s.courseId);
            const isGraded = s.status === "graded";
            const isActive = selected?._id === s._id;
            return (
              <div
                key={s._id}
                onClick={() => {
                  setSelected(s);
                  setMarks("");
                  setFeedback("");
                  setMarksError(false);
                }}
                style={{
                  ...styles.subCard,
                  ...(isActive ? styles.subCardActive : {}),
                }}
              >
                <div
                  style={{
                    ...styles.avatar,
                    background: isGraded ? "#ecfdf5" : "#f1f3f7",
                    color: isGraded ? "#065f46" : "#4a5166",
                  }}
                >
                  {getInitial(s.studentId?.name)}
                </div>
                <div style={styles.subInfo}>
                    <div style={styles.subMeta}>{s.courseId?.title}</div>
                  <div style={styles.subName}>{s.studentId?.name}</div>
                  <div style={styles.subName}>{s.studentId?.email}</div>
                  
                  
                  
                  
                </div>
                <span
                  style={{
                    ...styles.badge,
                    background: isGraded ? "#ecfdf5" : "#fffbeb",
                    color: isGraded ? "#065f46" : "#92400e",
                  }}
                >
                  {isGraded ? "Graded" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={styles.main}>
        {!selected ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d0d5e0" strokeWidth="1.3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 style={styles.emptyH3}>Select a submission</h3>
            <p style={styles.emptyP}>
              Choose a student from the sidebar to review their work and assign a grade.
            </p>
          </div>
        ) : (
          <div style={styles.detail}>
           {/* Header */}
<div className="flex items-start justify-between gap-6 p-6 border-b border-gray-100">

  {/* Left: Avatar + All Details */}
  <div className="flex items-start gap-5">

    {/* Avatar with status dot */}
    <div className="relative flex-shrink-0">
      <img
        src={selected.studentId?.profilePicture || avatarUrl(selected.studentId?.name)}
        alt={selected.studentId?.name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
      <span
        className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${
          selected.status === "graded" ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
    </div>

    {/* Details */}
    <div className="flex flex-col gap-4">

      {/* Student Info */}
      <div>
        <p className="text-base font-semibold text-gray-900">{selected.studentId?.name}</p>
        <p className="text-sm text-gray-500">{selected.studentId?.email}</p>
        <p className="text-xs text-gray-400 mt-0.5">ID · {selected.studentId?._id.slice(-6)}</p>
      </div>

      {/* Course & Assessment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Course</p>
          <p className="text-sm text-gray-800">{selected.courseId?.title}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Assessment</p>
          <p className="text-sm text-gray-800">{selected.assessmentId?.title}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</p>
          <p className="text-sm text-gray-800">{selected.assessmentId?.description}</p>
        </div>
      </div>

      {/* Marks & Deadline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">Total Marks</p>
          <p className="text-sm font-semibold text-gray-800">{selected.assessmentId?.totalMarks}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">Deadline</p>
          <p className="text-sm font-semibold text-gray-800">{new Date(selected.assessmentId?.dueDate).toDateString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">Submitted At</p>
          <p className="text-sm font-semibold text-gray-800">{new Date(selected.createdAt).toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">Graded At</p>
          <p className="text-sm font-semibold text-gray-800">{new Date(selected.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Lecturer & Submission Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-2">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Lecturer</p>
          <p className="text-sm text-gray-800">{selected.courseId?.instructor?.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Lecturer Email</p>
          <p className="text-sm text-gray-800">{selected.courseId?.instructor?.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Submission Type</p>
          <p className="text-sm text-gray-800 capitalize">{selected.type}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Submission Results</p>
          <p className="text-sm text-gray-800 capitalize">Marks : {selected.review.marks}</p>
           <p className="text-sm text-gray-800 capitalize">Feedback : {selected.review.feedback}</p>
        </div>
      </div>

    </div>
  </div>

  {/* Right: Status Badge */}
  <div
    className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
      selected.status === "graded"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-amber-50 text-amber-700"
    }`}
  >
    {selected.status === "graded" ? (
      <>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Graded
      </>
    ) : (
      <>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M6 4v2.5l1.5 1" strokeLinecap="round" />
        </svg>
        Awaiting Review
      </>
    )}
  </div>

</div>

            {/* Submission */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>
                <span style={styles.sectionLabel}>Submission</span>
                {selected.submission?.fileUrl && (
                  <a
                    href={selected.submission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.attachLink}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M2 12l10-10M7 2h5v5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Attachment
                  </a>
                )}
              </div>
              <div style={styles.sectionBody}>
                <p style={styles.answerText}>
                  {selected.submission?.textAnswer || "No text answer provided."}
                </p>
              </div>
            </div>

            {/* Grading */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>
                <span style={styles.sectionLabel}>
                  {selected.status === "graded" ? "Grade & Feedback" : "Grading"}
                </span>
              </div>
              <div style={styles.sectionBody}>
                {selected.status === "graded" ? (
                  <div style={styles.gradeResult}>
                    <div style={styles.scoreBlock}>
                      <div style={styles.scoreNum}>{selected.review?.marks}</div>
                      <div style={styles.scoreDenom}>out of 100</div>
                      <div style={styles.scoreBarWrap}>
                        <div
                          ref={scoreBarRef}
                          style={{ ...styles.scoreBar, width: "0%" }}
                        />
                      </div>
                    </div>
                    <div style={styles.divider} />
                    <div style={{ flex: 1 }}>
                      <div style={styles.feedbackLabel}>Instructor Feedback</div>
                      <p style={styles.feedbackText}>"{selected.review?.feedback}"</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={styles.fieldLabel}>Score</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0–100"
                          value={marks}
                          onChange={(e) => {
                            setMarks(e.target.value);
                            setMarksError(false);
                          }}
                          style={{
                            ...styles.marksInput,
                            borderColor: marksError ? "#dc2626" : "#e5e8ef",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={styles.fieldLabel}>Feedback</label>
                        <textarea
                          rows={4}
                          placeholder="Write constructive feedback for the student…"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          style={styles.feedbackInput}
                        />
                      </div>
                    </div>
                    <div style={styles.formFooter}>
                      <button
                        onClick={() => handleGrade(selected._id)}
                        disabled={submitting}
                        style={{
                          ...styles.submitBtn,
                          opacity: submitting ? 0.5 : 1,
                          cursor: submitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {submitting ? "Saving…" : "Submit Grade"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  layout: { display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#0f1117", background: "#f8f9fb", overflow: "hidden" },
  loadWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12, background: "#fff" },
  spinner: { width: 28, height: 28, borderRadius: "50%", border: "3px solid #e5e8ef", borderTopColor: "#1a56db", animation: "spin 0.7s linear infinite" },
  loadText: { fontSize: 13, color: "#8b92a5", fontWeight: 500 },
  sidebar: { width: 320, minWidth: 320, background: "#091c66", borderRight: "1px solid #e5e8ef", display: "flex", flexDirection: "column" },
  sidebarHeader: { padding: "20px 20px 0" },
  sidebarTitle: { fontSize: 11, fontWeight: 600, color: "#8b92a5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 },
  statChip: { background: "#f1f3f7", borderRadius: 6, padding: "10px 12px" },
  statNum: { fontSize: 20, fontWeight: 600, lineHeight: 1 },
  statLbl: { fontSize: 11, color: "#8b92a5", marginTop: 2, fontWeight: 500 },
  searchWrap: { position: "relative", marginBottom: 4 },
  searchIcon: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14 },
  searchInput: { width: "100%", padding: "9px 12px 9px 34px", border: "1px solid #e5e8ef", borderRadius: 10, fontFamily: "inherit", fontSize: 13, background: "#f1f3f7", color: "#0f1117", outline: "none", boxSizing: "border-box" },
  filterTabs: { display: "flex", gap: 4, padding: "12px 20px", borderBottom: "1px solid #e5e8ef" },
  ftab: { padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500, color: "#4a5166", cursor: "pointer", border: "1px solid transparent", background: "none", fontFamily: "inherit" },
  ftabActive: { background: "#eff4ff", color: "#1a56db", borderColor: "#c7d8f8" },
  list: { flex: 1, overflowY: "auto", padding: 8 },
  emptyList: { padding: 24, textAlign: "center", color: "#8b92a5", fontSize: 13 },
  subCard: { display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, cursor: "pointer", border: "1px solid transparent", marginBottom: 2, transition: "background 0.12s" },
  subCardActive: { background: "#000000", borderColor: "#c7d8f8" },
  avatar: { width: 38, height: 38, minWidth: 38, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 },
  subInfo: { flex: 1, minWidth: 0 },
  subName: { fontSize: 13, fontWeight: 500, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  subMeta: { fontSize: 11, color: "#bfee14", marginTop: 1 },
  badge: { padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", whiteSpace: "nowrap" },
  main: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#8b92a5", padding: 40 },
  emptyIcon: { width: 60, height: 60, borderRadius: 16, background: "#f1f3f7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyH3: { fontSize: 15, fontWeight: 500, color: "#4a5166", marginBottom: 6 },
  emptyP: { fontSize: 13, color: "#8b92a5", textAlign: "center", maxWidth: 220, lineHeight: 1.6 },
  detail: { padding: "28px 32px", maxWidth: 860, width: "100%" },
  detailHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #e5e8ef" },
  profileAvatar: { width: 52, height: 52, borderRadius: 12, objectFit: "cover", border: "1px solid #e5e8ef" },
  statusDot: { position: "absolute", bottom: -3, right: -3, width: 14, height: 14, borderRadius: "50%", border: "2px solid #f8f9fb" },
  profileName: { fontSize: 18, fontWeight: 600, color: "#0f1117", lineHeight: 1.2 },
  profileEmail: { fontSize: 12, color: "#8b92a5", marginTop: 3 },
  profileId: { fontSize: 11, color: "#8b92a5", marginTop: 2, fontFamily: "'DM Mono', monospace" },
  statusPill: { display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  section: { background: "#fff", border: "1px solid #e5e8ef", borderRadius: 14, marginBottom: 16, overflow: "hidden" },
  sectionHead: { padding: "14px 20px", borderBottom: "1px solid #e5e8ef", display: "flex", alignItems: "center", justifyContent: "space-between" },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b92a5" },
  attachLink: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: "#1a56db", textDecoration: "none", padding: "5px 10px", borderRadius: 6, border: "1px solid #c7d8f8", background: "#eff4ff" },
  sectionBody: { padding: "24px 20px" },
  answerText: { fontSize: 14, color: "#4a5166", lineHeight: 1.75, whiteSpace: "pre-wrap", fontStyle: "italic" },
  gradeResult: { display: "flex", alignItems: "center", gap: 32 },
  scoreBlock: { textAlign: "center" },
  scoreNum: { fontSize: 42, fontWeight: 600, color: "#1a56db", fontFamily: "'DM Mono', monospace", lineHeight: 1 },
  scoreDenom: { fontSize: 14, color: "#8b92a5", marginTop: 2 },
  scoreBarWrap: { width: "100%", height: 6, background: "#f1f3f7", borderRadius: 3, marginTop: 10, overflow: "hidden" },
  scoreBar: { height: 6, borderRadius: 3, background: "#1a56db", transition: "width 0.4s ease" },
  divider: { width: 1, height: 80, background: "#e5e8ef" },
  feedbackLabel: { fontSize: 11, fontWeight: 600, color: "#8b92a5", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 },
  feedbackText: { fontSize: 13, color: "#4a5166", lineHeight: 1.65, fontStyle: "italic" },
  fieldLabel: { fontSize: 11, fontWeight: 600, color: "#8b92a5", letterSpacing: "0.07em", textTransform: "uppercase" },
  marksInput: { width: 110, padding: "10px 14px", border: "1px solid #e5e8ef", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: "#0f1117", background: "#fff", outline: "none" },
  feedbackInput: { width: "100%", padding: "10px 14px", border: "1px solid #e5e8ef", borderRadius: 10, fontFamily: "inherit", fontSize: 13, color: "#0f1117", background: "#fff", resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" },
  formFooter: { display: "flex", justifyContent: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "1px solid #e5e8ef" },
  submitBtn: { padding: "10px 24px", background: "#1a56db", color: "#fff", border: "none", borderRadius: 10, fontFamily: "inherit", fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" },
};

export default ReviewDashboard;