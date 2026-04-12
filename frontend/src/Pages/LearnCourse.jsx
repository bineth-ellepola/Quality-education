import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LearnHeader from '../Component/CourseManagement/FrontPages/HeaderSection/LearnHeader'

/* ─── metadata ─────────────────────────────────────────────────── */
const TYPE_META = {
  video:        { label: "Video",        cls: "badge-blue"   },
  lecture_note: { label: "Lecture note", cls: "badge-violet" },
  lab_sheet:    { label: "Lab sheet",    cls: "badge-teal"   },
  assignment:   { label: "Assignment",   cls: "badge-amber"  },
  quiz:         { label: "Quiz",         cls: "badge-rose"   },
  other:        { label: "Other",        cls: "badge-gray"   },
};

const DIFF_META = {
  beginner:     { label: "Beginner",     cls: "badge-green"  },
  intermediate: { label: "Intermediate", cls: "badge-amber"  },
  advanced:     { label: "Advanced",     cls: "badge-red"    },
};

const SAMPLE_QUESTIONS = [
  { id: "q1", question: "What is the primary purpose of a constructor in object-oriented programming?", options: ["To destroy an object when it is no longer needed", "To initialise an object's state when it is created", "To define the methods an object can use", "To inherit properties from a parent class"], correct: 1 },
  { id: "q2", question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?", options: ["Queue", "Linked List", "Stack", "Tree"], correct: 2 },
  { id: "q3", question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Program", "Hosted Text Transfer Process"], correct: 0 },
  { id: "q4", question: "Which of the following is NOT a primitive data type in most programming languages?", options: ["Integer", "Boolean", "Array", "Float"], correct: 2 },
  { id: "q5", question: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
  { id: "q6", question: "In a relational database, what does a foreign key do?", options: ["Encrypts sensitive column data", "Links a row in one table to a row in another table", "Speeds up queries on large tables", "Prevents duplicate rows in a table"], correct: 1 },
  { id: "q7", question: "Which HTTP method is typically used to update an existing resource?", options: ["GET", "POST", "DELETE", "PUT"], correct: 3 },
  { id: "q8", question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Stylesheet Syntax"], correct: 1 },
  { id: "q9", question: "Which sorting algorithm has an average-case time complexity of O(n log n)?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2 },
  { id: "q10", question: "What is the role of an API gateway in a microservices architecture?", options: ["Stores data for all microservices in one place", "Acts as a single entry point for client requests, routing them to the correct service", "Compiles each microservice into a single deployable binary", "Manages version control for service source code"], correct: 1 },
];

const OPT_LETTERS = ["A", "B", "C", "D"];

/* ─── tiny helpers ──────────────────────────────────────────────── */
function TypeBadge({ type }) {
  const m = TYPE_META[type] || TYPE_META.other;
  return <span className={`lc-badge ${m.cls}`}>{m.label}</span>;
}

function DiffBadge({ difficulty }) {
  if (!difficulty) return null;
  const m = DIFF_META[difficulty];
  return m ? <span className={`lc-badge ${m.cls}`}>{m.label}</span> : null;
}

function DueDateBadge({ dueDate }) {
  if (!dueDate) return null;
  const due  = new Date(dueDate);
  const days = (due - new Date()) / 864e5;
  const fmt  = due.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  if (days < 0)  return <span className="lc-due lc-due--over">Overdue · {fmt}</span>;
  if (days < 7)  return <span className="lc-due lc-due--soon">Due in {Math.ceil(days)}d · {fmt}</span>;
  if (days < 14) return <span className="lc-due lc-due--warn">Due in {Math.ceil(days)}d · {fmt}</span>;
  return <span className="lc-due lc-due--ok">Due {fmt}</span>;
}

/* ─── icons ─────────────────────────────────────────────────────── */
const IconSearch   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX        = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconDownload = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconLink     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconCheck    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconClose    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconUpload   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconChevron  = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─── content card ──────────────────────────────────────────────── */
function ContentCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  return (
    <div className={`lc-citem ${open ? "lc-citem--open" : ""}`}>
       
      <button className="lc-citem__head" onClick={() => setOpen(p => !p)}>
        <div className="lc-citem__num">{String(index + 1).padStart(2, "0")}</div>
        <div className="lc-citem__info">
          <p className="lc-citem__title">{item.title || `Content ${index + 1}`}</p>
          <div className="lc-citem__badges">
            <TypeBadge type={item.type} />
            <DiffBadge difficulty={item.difficulty} />
            {item.week   && <span className="lc-meta-text">{item.week}</span>}
            {item.module && <span className="lc-meta-text">{item.module}</span>}
          </div>
        </div>
        <div className="lc-citem__actions">
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="lc-icon-btn" title="Download">
              <IconDownload />
            </a>
          )}
          {item.url && item.type !== "video" && (
            <a href={item.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="lc-icon-btn" title="Open">
              <IconLink />
            </a>
          )}
          <span className="lc-icon-btn lc-icon-btn--ghost">
            <IconChevron open={open} />
          </span>
        </div>
      </button>

      <div
        ref={bodyRef}
        className="lc-citem__body"
        style={{ maxHeight: open ? bodyRef.current?.scrollHeight + "px" : "0px" }}
      >
        <div className="lc-citem__body-inner">
          {item.description && <p className="lc-citem__desc">{item.description}</p>}
          {item.tags?.length > 0 && (
            <div className="lc-tags">
              {item.tags.map(t => <span key={t} className="lc-tag">{t}</span>)}
            </div>
          )}
          {item.type === "video" && (item.fileUrl || item.url) && (
            <div className="lc-video-wrap">
              <video controls className="lc-video">
                <source src={item.fileUrl || item.url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          )}
          {(item.type === "lecture_note" || item.type === "lab_sheet") && item.fileUrl && (
            <div className="lc-iframe-wrap">
              <iframe src={item.fileUrl} title="Document viewer" className="lc-iframe" />
            </div>
          )}
          <div className="lc-btn-row">
            {item.type === "video" && (item.fileUrl || item.url) && (
              <a href={item.url || item.fileUrl} target="_blank" rel="noreferrer" className="lc-btn lc-btn--dark">Watch video</a>
            )}
            {item.url && item.type !== "video" && (
              <a href={item.url} target="_blank" rel="noreferrer" className="lc-btn lc-btn--dark">Open resource</a>
            )}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="lc-btn lc-btn--outline">Download file</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── assessment card ───────────────────────────────────────────── */
function AssessmentCard({ item, progress, onSubmit }) {
  const currentStatus = progress?.status || "not-started";

  const statusCls = {
    "not-started": "lc-status--none",
    started:      "lc-status--started",
    submitted:    "lc-status--submitted",
    "under-review": "lc-status--review",
    graded:       "lc-status--graded",
    rejected:     "lc-status--rejected",
    resubmit:     "lc-status--resubmit",
  }[currentStatus] ?? "lc-status--none";

  return (
    <div className="lc-acard">
      <div className="lc-acard__head">
        <div className="lc-acard__main">
          <div className="lc-acard__title-row">
            <h3 className="lc-acard__title">{item.title}</h3>
            <span className={`lc-status ${statusCls}`}>
                {currentStatus.replace("-", " ")}
            </span>
            {progress?.review?.marks != null && currentStatus === "graded" && (
              <span className="lc-meta-text" style={{marginLeft: '8px'}}>
                Your Score: {progress.review.marks}
              </span>
              
              
            )}
          </div>
          {item.description && <p className="lc-acard__desc">{item.description}</p>}
        </div>
        
        {item.totalMarks != null && (
          <div className="lc-acard__marks">
            <span className="lc-acard__marks-val">{item.totalMarks}</span>
            <span className="lc-acard__marks-lbl">marks</span>
          </div>
        )}
      </div>

      <div className="lc-acard__foot">
        <DueDateBadge dueDate={item.dueDate} />
        <div style={{ flex: 1 }} />
        
        {item.fileUrl && (
          <a href={item.fileUrl} target="_blank" rel="noreferrer" className="lc-btn lc-btn--outline">
            {item.fileName || "Download brief"}
          </a>
        )}

        <button 
          className="lc-btn lc-btn--dark" 
          onClick={() => onSubmit(item, progress)}
          disabled={currentStatus === "submitted" || currentStatus === "under-review"}
        >
          {currentStatus === "graded" ? "View Feedback" : 
           currentStatus === "submitted" ? "Submitted" : 
           currentStatus === "under-review" ? "Reviewing..." : "Submit work"}
        </button>
      </div>
    </div>
  );
}

/* ─── circular progress ring ────────────────────────────────────── */
function ProgressRing({ pct = 0 }) {
  const R = 30, C = 2 * Math.PI * R;
  const off = C - (C * pct) / 100;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={R} fill="none" stroke="var(--lc-border)" strokeWidth="5" />
      <circle cx="36" cy="36" r={R} fill="none" stroke="#639922" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill="var(--lc-text)">{pct}%</text>
    </svg>
  );
}

/* ─── deadline row ──────────────────────────────────────────────── */
function DeadlineItem({ item }) {
  const d = new Date(item.dueDate);
  return (
    <div className="lc-deadline">
      <div className="lc-deadline__cal">
        <span className="lc-deadline__day">{d.getDate()}</span>
        <span className="lc-deadline__mon">{d.toLocaleString("en-GB", { month: "short" })}</span>
      </div>
      <div className="lc-deadline__info">
        <p className="lc-deadline__title">{item.title}</p>
        {item.totalMarks && <p className="lc-deadline__sub">{item.totalMarks} marks</p>}
      </div>
    </div>
  );
}

/* ─── module row ────────────────────────────────────────────────── */
function ModuleRow({ name, count }) {
  return (
    <div className="lc-module-row">
      <span className="lc-module-row__name">{name}</span>
      <span className="lc-module-row__count">{count}</span>
    </div>
  );
}

/* ─── submit modal ──────────────────────────────────────────────── */
function SubmitModal({ assessment, onClose, onSubmit, submitting }) {
  const [file, setFile]   = useState(null);
  const [text, setText]   = useState("");
  const dropRef           = useRef(null);

  const handleDrop = e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="lc-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lc-modal">
        <div className="lc-modal__head">
          <h2 className="lc-modal__title">Submit work</h2>
          <p className="lc-modal__sub">{assessment.title}</p>
          <button className="lc-modal__close" onClick={onClose}><IconX /></button>
        </div>

        <div className="lc-modal__body">
          <div
            className={`lc-file-drop ${file ? "lc-file-drop--has-file" : ""}`}
            ref={dropRef}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            />
            <div className="lc-file-drop__icon"><IconUpload /></div>
            {file ? (
              <p className="lc-file-drop__name">{file.name}</p>
            ) : (
              <>
                <p className="lc-file-drop__label">Drag & drop or click to upload</p>
                <p className="lc-file-drop__hint">PDF, DOCX, ZIP up to 50 MB</p>
              </>
            )}
          </div>

          <div className="lc-modal__field">
            <label className="lc-modal__label">Written answer <span style={{ color: "var(--lc-text-muted)" }}>(optional)</span></label>
            <textarea
              className="lc-textarea"
              placeholder="Type your answer here…"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="lc-modal__foot">
          <button className="lc-btn lc-btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="lc-btn lc-btn--dark"
            disabled={submitting || (!file && !text.trim())}
            onClick={() => onSubmit(file, text)}
          >
            {submitting ? "Submitting…" : "Submit work"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── quiz panel ────────────────────────────────────────────────── */
function QuizPanel({ quizQuestions }) {
  const questions = quizQuestions?.length >= 5 ? quizQuestions : SAMPLE_QUESTIONS;
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [current,   setCurrent]   = useState(0);

  const totalQ   = questions.length;
  const answered = Object.keys(answers).length;
  const score    = submitted ? questions.filter(q => answers[q.id] === q.correct).length : null;
  const pct      = submitted ? Math.round((score / totalQ) * 100) : null;
  const q        = questions[current];
  const ua       = answers[q.id];
  const isCorrect = submitted && ua === q.correct;
  const isWrong   = submitted && ua !== q.correct;
  const tier = pct >= 70 ? "pass" : pct >= 40 ? "avg" : "fail";

  return (
    <div className="lc-quiz">
      {/* score banner */}
      {submitted && (
        <div className={`lc-score-banner lc-score-banner--${tier}`}>
          <div className={`lc-score-banner__icon lc-score-banner__icon--${tier}`}>{pct}%</div>
          <div className="lc-score-banner__text">
            <p className="lc-score-banner__title">{pct >= 70 ? "Great work!" : pct >= 40 ? "Good effort!" : "Keep practising!"}</p>
            <p className="lc-score-banner__sub">{score} of {totalQ} correct</p>
          </div>
          <button className="lc-btn lc-btn--outline" onClick={() => { setAnswers({}); setSubmitted(false); setCurrent(0); }}>
            Retry quiz
          </button>
        </div>
      )}

      {/* question nav */}
      <div className="lc-card lc-quiz__nav">
        <div className="lc-quiz__nav-header">
          <span className="lc-section-label" style={{ margin: 0 }}>Questions</span>
          {!submitted && <span className="lc-meta-text">{answered} / {totalQ} answered</span>}
        </div>
        <div className="lc-quiz__num-grid">
          {questions.map((item, i) => {
            const ua2 = answers[item.id];
            let cls = "";
            if (i === current)          cls = "lc-qnum--cur";
            else if (submitted) {
              if (ua2 === item.correct)  cls = "lc-qnum--right";
              else if (ua2 !== undefined) cls = "lc-qnum--wrong";
            } else if (ua2 !== undefined) cls = "lc-qnum--ans";
            return (
              <button key={item.id} className={`lc-qnum ${cls}`} onClick={() => setCurrent(i)}>{i + 1}</button>
            );
          })}
        </div>
        {!submitted && (
          <div className="lc-progress-thin">
            <div className="lc-progress-thin__fill" style={{ width: `${(answered / totalQ) * 100}%` }} />
          </div>
        )}
      </div>

      {/* question card */}
      <div className={`lc-qcard ${submitted ? isCorrect ? "lc-qcard--correct" : "lc-qcard--incorrect" : ""}`}>
        <div className="lc-qcard__top">
          <span className="lc-qcard__idx">{current + 1}</span>
          <p className="lc-qcard__question">{q.question}</p>
        </div>
        <div className="lc-qcard__opts">
          {q.options.map((opt, idx) => {
            const sel  = ua === idx;
            const cor  = submitted && q.correct === idx;
            const inc  = submitted && sel && !cor;
            let cls = "";
            if (!submitted && sel) cls = "lc-opt--sel";
            else if (cor)          cls = "lc-opt--correct";
            else if (inc)          cls = "lc-opt--incorrect";
            return (
              <button
                key={idx}
                className={`lc-opt ${cls} ${submitted ? "lc-opt--disabled" : ""}`}
                onClick={() => !submitted && setAnswers(p => ({ ...p, [q.id]: idx }))}
                disabled={submitted}
              >
                <span className="lc-opt__letter">{OPT_LETTERS[idx]}</span>
                <span className="lc-opt__text">{opt}</span>
                {cor && <span className="lc-opt__icon lc-opt__icon--correct"><IconCheck /></span>}
                {inc && <span className="lc-opt__icon lc-opt__icon--incorrect"><IconClose /></span>}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className={`lc-qcard__feedback ${isCorrect ? "lc-qcard__feedback--correct" : "lc-qcard__feedback--incorrect"}`}>
            {isCorrect ? "Correct answer." : `Correct answer: ${q.options[q.correct]}`}
          </div>
        )}
      </div>

      {/* nav buttons */}
      <div className="lc-quiz__btns">
        <button className="lc-btn lc-btn--outline" onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>
          Previous
        </button>
        <span className="lc-meta-text">{current + 1} of {totalQ}</span>
        {current < totalQ - 1 ? (
          <button className="lc-btn lc-btn--outline" onClick={() => setCurrent(p => Math.min(totalQ - 1, p + 1))}>Next</button>
        ) : !submitted ? (
          <button className="lc-btn lc-btn--dark" onClick={() => setSubmitted(true)} disabled={answered < totalQ}>
            Submit quiz
          </button>
        ) : null}
      </div>

      {!submitted && answered < totalQ && current === totalQ - 1 && (
        <div className="lc-quiz__warn">
          {totalQ - answered} unanswered question{totalQ - answered > 1 ? "s" : ""} remaining. Answer all before submitting.
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function LearnCourse() {
  const { courseId } = useParams();

  const [course,      setCourse]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("contents");
  const [typeFilter,  setTypeFilter]  = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressMap, setProgressMap] = useState({});

  // submission modal
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submitting,          setSubmitting]          = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const [courseRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/courses/${courseId}`),
          user?._id
            ? axios.get(`http://localhost:5001/api/progress/student/${user._id}`
                
            ).catch(() => null)
            : Promise.resolve(null),
        ]);

        if (courseRes.data.success) setCourse(courseRes.data.data);

        if (progressRes?.data?.success) {
          const map = {};
          for (const p of progressRes.data.data) {
            if (p.assessmentId) {
                // Robust ID extraction
                const aid = typeof p.assessmentId === "object" ? p.assessmentId._id : p.assessmentId;
                map[aid] = p;
            }
          }
          setProgressMap(map);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

 const handleSubmit = async (file, textAnswer) => {
  try {
    setSubmitting(true);
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ START progress (assignment only)
    const startRes = await axios.post(
      "http://localhost:5001/api/progress/start",
      {
        studentId: user._id,
        courseId,
        assessmentId: selectedAssessment._id,
        type: "assignment",
      }
    );

    const progressId = startRes.data.data._id;

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("textAnswer", textAnswer);

    // ✅ SUBMIT WORK
    const submitRes = await axios.post(
      `http://localhost:5001/api/progress/submit/${progressId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // ✅ UPDATE UI STATE
    setProgressMap((prev) => ({
      ...prev,
      [selectedAssessment._id]: submitRes.data.data,
    }));

    setSelectedAssessment(null);
  } catch (err) {
    console.error(err);
    alert("Submission failed");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="lc-loading">
        <div className="lc-spinner" />
        <p>Loading course…</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="lc-not-found">
        <p className="lc-not-found__title">Course not found</p>
        <p className="lc-not-found__sub">This course doesn't exist or has been removed.</p>
      </div>
    );
  }

  const contents      = course.contents      ?? [];
  const assessments   = course.assessments   ?? [];
  const quizQuestions = course.quizQuestions ?? [];

  const filteredContents = contents.filter(c => {
    const matchType  = typeFilter === "all" || c.type === typeFilter;
    const q          = searchQuery.toLowerCase();
    const matchQuery = !q
      || c.title?.toLowerCase().includes(q)
      || c.description?.toLowerCase().includes(q)
      || c.tags?.some(t => t.toLowerCase().includes(q));
    return matchType && matchQuery;
  });

  const totalMarks        = assessments.reduce((s, a) => s + (a.totalMarks || 0), 0);
  const weekCount         = new Set(contents.map(c => c.week).filter(Boolean)).size;
  const upcomingDeadlines = [...assessments].filter(a => a.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  const moduleMap = contents.reduce((acc, c) => {
    const m = c.module || "General";
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  const TABS = [
    { key: "contents",    label: "Contents",    count: contents.length },
    { key: "assessments", label: "Assessments", count: assessments.length },
    { key: "quiz",        label: "Quiz",        count: quizQuestions?.length || SAMPLE_QUESTIONS.length },
    { key: "overview",    label: "Overview" },
  ];

  const TYPE_FILTERS = [
    { key: "all",          label: "All types"     },
    { key: "video",        label: "Video"         },
    { key: "lecture_note", label: "Lecture notes" },
    { key: "lab_sheet",    label: "Lab sheets"    },
    { key: "assignment",   label: "Assignment"    },
  ];

  const instructorName = course.instructor
    ? typeof course.instructor === "object" ? course.instructor.name : course.instructor
    : null;
    const instructorEmail = course.instructor
    ? typeof course.instructor === "object" ? course.instructor.email : course.instructor
    : null;

  return (
    <div className="lc-root">
      <LearnHeader />
      {/* ── global styles ── */}
      <style>{`
        /* ── reset / base ── */
        .lc-root *, .lc-root *::before, .lc-root *::after { box-sizing: border-box; }
        .lc-root { font-family: 'DM Sans', 'Geist', ui-sans-serif, system-ui, sans-serif; background: #f5f5f4; color: #1c1917; min-height: 100vh; }

        .lc-status--none       { background: #f5f5f4; color: #a8a29e; border: 1px solid #e7e5e4; }
        .lc-status--started    { background: #f5f5f4; color: #78716c; border: 1px solid #e7e5e4; }
        .lc-status--submitted  { background: #E6F1FB; color: #185FA5; border: 1px solid #D0E4F7; }
        .lc-status--review     { background: #FAEEDA; color: #854F0B; border: 1px solid #F5DDB3; }
        .lc-status--graded     { background: #EAF3DE; color: #3B6D11; border: 1px solid #D1E5B7; }
        .lc-status--rejected   { background: #FCEBEB; color: #A32D2D; border: 1px solid #F7C1C1; }
        .lc-status--resubmit   { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }

        .lc-root {
          --lc-bg:       #ffffff;
          --lc-surface:  #fafaf9;
          --lc-border:   #e7e5e4;
          --lc-border-2: #d6d3d1;
          --lc-text:     #1c1917;
          --lc-text-2:   #57534e;
          --lc-text-muted: #a8a29e;
          --lc-radius:   10px;
          --lc-radius-sm: 6px;
          --lc-green:    #639922;
          --lc-green-bg: #EAF3DE;
        }

        .lc-page   { max-width: 100%; margin: 0 auto; padding: 0 0 5rem; }
        .lc-header { background: var(--lc-bg); border-bottom: 1px solid var(--lc-border); padding: 2rem 2rem 0; }
        .lc-body   { padding: 1.5rem 2rem; display: grid; grid-template-columns: 1fr 268px; gap: 1.25rem; align-items: start; }
        @media (max-width: 860px) { .lc-body { grid-template-columns: 1fr; padding: 1rem; } }

        .lc-breadcrumb    { display: flex; gap: 8px; align-items: center; margin-bottom: .75rem; }
        .lc-chip          { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .lc-chip--code    { background: #f5f5f4; color: #78716c; border: 1px solid var(--lc-border); }
        .lc-chip--active  { background: #EAF3DE; color: #3B6D11; }
        .lc-header h1     { font-size: 45px;color:"#ff073a"; font-weight: 700; margin-bottom: .4rem; line-height: 1.3; }
        .lc-header-desc   { font-size: 18px; color: var(--lc-text-2); max-width: 890px; line-height: 1.85; margin-bottom: .9rem; }
        .lc-meta-row      { display: flex; flex-wrap: wrap; gap: 4px 20px; font-size: 12px; color: var(--lc-text-muted); margin-bottom: 1rem; }
        .lc-meta-row b    { color: var(--lc-text-2); font-weight: 500; }
        .lc-progress-line { height: 2px; background: var(--lc-border); margin: 0 -2rem; }
        .lc-progress-line__fill { height: 2px; background: var(--lc-green); transition: width .8s ease; }

        .lc-tabs { display: flex; overflow-x: auto; scrollbar-width: none; }
        .lc-tabs::-webkit-scrollbar { display: none; }
        .lc-tab  { padding: .85rem 1rem; font-size: 13px; font-weight: 500; color: var(--lc-text-muted); background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: color .15s; }
        .lc-tab:hover:not(.lc-tab--active) { color: var(--lc-text-2); }
        .lc-tab--active { color: var(--lc-text); border-bottom-color: var(--lc-text); }
        .lc-tab__count { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 99px; background: #f5f5f4; color: var(--lc-text-muted); }
        .lc-tab--active .lc-tab__count { background: var(--lc-text); color: #fff; }

        .lc-card { background: var(--lc-bg); border: 1px solid var(--lc-border); border-radius: var(--lc-radius); padding: 1.1rem 1.25rem; }

        .lc-section-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--lc-text-muted); display: block; margin-bottom: .75rem; }

        .lc-badge        { display: inline-flex; align-items: center; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
        .badge-blue      { background: #E6F1FB; color: #185FA5; }
        .badge-violet    { background: #EEEDFE; color: #3C3489; }
        .badge-teal      { background: #E1F5EE; color: #0F6E56; }
        .badge-amber     { background: #FAEEDA; color: #854F0B; }
        .badge-rose      { background: #FBEAF0; color: #72243E; }
        .badge-gray      { background: #f5f5f4; color: #78716c; }
        .badge-green     { background: #EAF3DE; color: #3B6D11; }
        .badge-red       { background: #FCEBEB; color: #A32D2D; }

        .lc-due        { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 5px; border: 1px solid; }
        .lc-due--over  { background: #FCEBEB; color: #A32D2D; border-color: #F7C1C1; }
        .lc-due--soon  { background: #FEF3C7; color: #92400E; border-color: #FDE68A; }
        .lc-due--warn  { background: #fef9c3; color: #854f0b; border-color: #fef08a; }
        .lc-due--ok    { background: #f5f5f4; color: #78716c; border-color: #e7e5e4; }

        .lc-status { display: inline-flex; align-items: center; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; height: 20px; }

        .lc-citem { background: var(--lc-bg); border: 1px solid var(--lc-border); border-radius: var(--lc-radius); margin-bottom: .75rem; overflow: hidden; transition: box-shadow .2s; }
        .lc-citem--open { box-shadow: 0 4px 12px rgba(0,0,0,.04); border-color: var(--lc-border-2); }
        .lc-citem__head { width: 100%; display: flex; align-items: center; padding: .85rem 1.25rem; background: none; border: none; cursor: pointer; text-align: left; }
        .lc-citem__num  { width: 28px; font-size: 12px; font-weight: 700; color: var(--lc-text-muted); }
        .lc-citem__info { flex: 1; min-width: 0; }
        .lc-citem__title { font-size: 14px; font-weight: 500; color: var(--lc-text); margin: 0 0 4px; }
        .lc-citem__badges { display: flex; gap: 8px; align-items: center; }
        .lc-meta-text { font-size: 11px; color: var(--lc-text-muted); }
        .lc-citem__actions { display: flex; gap: 4px; padding-left: 1rem; }

        .lc-icon-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: var(--lc-text-2); background: #f5f5f4; border: 1px solid var(--lc-border); transition: all .15s; text-decoration: none; }
        .lc-icon-btn:hover { background: #ececeb; color: var(--lc-text); }
        .lc-icon-btn--ghost { background: none; border-color: transparent; }

        .lc-citem__body { transition: max-height .3s ease-in-out; }
        .lc-citem__body-inner { padding: 0 1.25rem 1.25rem 3.25rem; }
        .lc-citem__desc { font-size: 13px; color: var(--lc-text-2); line-height: 1.6; margin: 0 0 1rem; }
        .lc-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.25rem; }
        .lc-tag  { font-size: 10px; font-weight: 500; color: var(--lc-text-2); background: #f5f5f4; padding: 2px 8px; border-radius: 4px; }

        .lc-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .lc-btn { display: inline-flex; align-items: center; justify-content: center; height: 32px; padding: 0 14px; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all .15s; text-decoration: none; gap: 6px; }
        .lc-btn--dark { background: #1c1917; color: #fff; }
        .lc-btn--dark:hover { background: #000; }
        .lc-btn--dark:disabled { background: #a8a29e; cursor: not-allowed; }
        .lc-btn--outline { background: #fff; border-color: var(--lc-border); color: var(--lc-text-2); }
        .lc-btn--outline:hover { background: #f5f5f4; color: var(--lc-text); }

        .lc-acard { background: var(--lc-bg); border: 1px solid var(--lc-border); border-radius: var(--lc-radius); padding: 1.5rem; margin-bottom: 1rem; }
        .lc-acard__head { display: flex; gap: 1.5rem; margin-bottom: 1.25rem; }
        .lc-acard__main { flex: 1; }
        .lc-acard__title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .lc-acard__title { font-size: 16px; font-weight: 600; margin: 0; }
        .lc-acard__desc { font-size: 13px; color: var(--lc-text-2); line-height: 1.55; margin: 0; }
        .lc-acard__marks { text-align: center; padding: 4px 12px; border: 1px solid var(--lc-border); border-radius: 8px; background: #fafaf9; }
        .lc-acard__marks-val { display: block; font-size: 16px; font-weight: 700; color: var(--lc-text); line-height: 1; }
        .lc-acard__marks-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--lc-text-muted); }
        .lc-acard__foot { display: flex; align-items: center; gap: 1rem; border-top: 1px solid var(--lc-border); padding-top: 1.25rem; }

        .lc-sidebar-card { background: var(--lc-bg); border: 1px solid var(--lc-border); border-radius: var(--lc-radius); padding: 1.25rem; margin-bottom: 1.25rem; }
        .lc-progress-summary { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
        .lc-module-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #fafaf9; }
        .lc-module-row__name { font-size: 12px; font-weight: 500; color: var(--lc-text-2); }
        .lc-module-row__count { font-size: 11px; font-weight: 700; color: var(--lc-text-muted); }

        .lc-deadline { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .lc-deadline__cal { width: 38px; height: 38px; background: #f5f5f4; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .lc-deadline__day { font-size: 13px; font-weight: 700; color: var(--lc-text); line-height: 1; }
        .lc-deadline__mon { font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--lc-text-muted); }
        .lc-deadline__info { flex: 1; }
        .lc-deadline__title { font-size: 13px; font-weight: 600; margin: 0 0 2px; }
        .lc-deadline__sub { font-size: 11px; color: var(--lc-text-muted); margin: 0; }

        .lc-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .lc-modal { background: #fff; width: 100%; max-width: 480px; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .lc-modal__head { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f5f5f4; position: relative; }
        .lc-modal__title { font-size: 17px; font-weight: 600; margin: 0 0 4px; }
        .lc-modal__sub { font-size: 13px; color: var(--lc-text-muted); margin: 0; }
        .lc-modal__close { position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; cursor: pointer; color: var(--lc-text-muted); }
        .lc-modal__body { padding: 1.5rem; }
        .lc-modal__foot { padding: 1.25rem 1.5rem; background: #fafaf9; display: flex; justify-content: flex-end; gap: 10px; }

        .lc-file-drop { height: 120px; border: 2px dashed var(--lc-border); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; transition: all .2s; margin-bottom: 1.5rem; }
        .lc-file-drop--has-file { border-color: var(--lc-green); background: var(--lc-green-bg); }
        .lc-file-drop__icon { margin-bottom: 8px; color: var(--lc-text-muted); }
        .lc-file-drop__label { font-size: 13px; font-weight: 600; margin: 0 0 4px; }
        .lc-file-drop__hint { font-size: 11px; color: var(--lc-text-muted); }
        .lc-file-drop__name { font-size: 13px; font-weight: 600; color: var(--lc-green); }

        .lc-textarea { width: 100%; background: #f5f5f4; border: 1px solid var(--lc-border); border-radius: 8px; padding: .75rem; font-size: 13px; font-family: inherit; resize: vertical; }
        .lc-textarea:focus { outline: none; border-color: var(--lc-border-2); }

        .lc-video-wrap { position: relative; padding-top: 56.25%; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; background: #000; }
        .lc-video { position: absolute; inset: 0; width: 100%; height: 100%; }
        .lc-iframe-wrap { position: relative; height: 500px; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; border: 1px solid var(--lc-border); }
        .lc-iframe { width: 100%; height: 100%; border: none; }

        .lc-quiz { display: grid; grid-template-columns: 240px 1fr; gap: 1.25rem; align-items: start; }
        @media (max-width: 768px) { .lc-quiz { grid-template-columns: 1fr; } }
        .lc-quiz__nav { position: sticky; top: 1.5rem; }
        .lc-quiz__num-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 1rem 0; }
        .lc-qnum { height: 32px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--lc-border); background: #fff; cursor: pointer; transition: all .15s; }
        .lc-qnum--ans   { background: #f5f5f4; color: var(--lc-text-2); }
        .lc-qnum--cur   { border-color: var(--lc-text); background: var(--lc-text); color: #fff; }
        .lc-qnum--right { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
        .lc-qnum--wrong { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }

        .lc-qcard { background: #fff; border: 1px solid var(--lc-border); border-radius: 12px; padding: 2rem; }
        .lc-qcard__top { display: flex; gap: 1.25rem; margin-bottom: 1.5rem; }
        .lc-qcard__idx { font-size: 18px; font-weight: 800; color: var(--lc-text-muted); }
        .lc-qcard__question { font-size: 16px; font-weight: 600; line-height: 1.5; margin: 0; }
        .lc-qcard__opts { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .lc-opt { width: 100%; display: flex; align-items: center; padding: 1rem; background: #fcfcfb; border: 1px solid var(--lc-border); border-radius: 10px; cursor: pointer; transition: all .15s; text-align: left; position: relative; }
        .lc-opt:hover:not(:disabled) { background: #f5f5f4; }
        .lc-opt--sel { border-color: var(--lc-text); background: #fafaf9; }
        .lc-opt--correct { border-color: #22c55e; background: #f0fdf4; }
        .lc-opt--incorrect { border-color: #ef4444; background: #fef2f2; }
        .lc-opt__letter { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--lc-border); border-radius: 5px; font-size: 11px; font-weight: 700; margin-right: 12px; }
        .lc-opt__text { flex: 1; font-size: 14px; font-weight: 500; }
        .lc-opt__icon { position: absolute; right: 1rem; display: flex; }
        .lc-opt__icon--correct { color: #16a34a; }
        .lc-opt__icon--incorrect { color: #dc2626; }
        .lc-qcard__feedback { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; font-size: 13px; font-weight: 600; }
        .lc-qcard__feedback--correct { background: #f0fdf4; color: #16a34a; }
        .lc-qcard__feedback--incorrect { background: #fef2f2; color: #dc2626; }
.lc-header h1 {
  font-size: 45px;
  color: #ff073a;
  font-weight: 700;
  margin-bottom: .4rem;
  line-height: 1.3;
}
        .lc-score-banner { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; grid-column: span 2; }
        .lc-score-banner--pass { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .lc-score-banner--fail { background: #fef2f2; border: 1px solid #fecaca; }
        .lc-score-banner__icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; }
        .lc-score-banner__icon--pass { background: #22c55e; }
        .lc-score-banner__icon--fail { background: #ef4444; }
        .lc-score-banner__title { font-size: 16px; font-weight: 700; margin: 0 0 2px; }
        .lc-score-banner__sub { font-size: 13px; color: var(--lc-text-2); margin: 0; }
        .lc-header img {
  width: 100%;
  max-height: 400px;
  object-fit: cover; /* Prevents stretching */
  border-radius: 12px;
  margin: 20px 0;
}

        .lc-quiz__btns { display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; }
      `}</style>

      <div className="lc-page">
        <header className="lc-header">
          <div className="lc-breadcrumb">
            <span className="lc-chip lc-chip--code">{course.courseCode || "COURSE"}</span>
            <span className="lc-chip lc-chip--active">Active</span>
          </div>
          <h1>{course.title}</h1>
          <p className="lc-header-desc">{course.description}</p>
          <img src={course.coverImage}></img>
          
          <div className="lc-meta-row">
            <span>By <b>{instructorName || "Instructor"}</b></span>
             <span>Email <b>{instructorEmail || "Instructor"}</b></span>
            <span><b>{course.duration || "Self-paced"}</b> duration</span>
            <span><b>{course.level || "Self-paced"}</b> Level</span>
            <span><b>{assessments.length}</b> assessments</span>
            <span><b>{totalMarks}</b> total marks</span>
          </div>

          <div className="lc-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`lc-tab ${activeTab === t.key ? "lc-tab--active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label} {t.count !== undefined && <span className="lc-tab__count">{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="lc-progress-line">
            <div className="lc-progress-line__fill" style={{ width: `35%` }} />
          </div>
        </header>

        <main className="lc-body">
          <div className="lc-main-col">
            {activeTab === "contents" && (
              <>
                <div className="lc-filter-row" style={{ display: "flex", gap: "10px", marginBottom: "1.25rem" }}>
                   {/* Search & Filter logic kept from original */}
                </div>
                {filteredContents.map((c, i) => <ContentCard key={c._id || i} item={c} index={i} />)}
              </>
            )}

            {activeTab === "assessments" && (
              <div className="lc-assessment-grid">
                {assessments.map(a => (
                  <AssessmentCard 
                    key={a._id} 
                    item={a} 
                    progress={progressMap[a._id]} 
                    onSubmit={() => setSelectedAssessment(a)} 
                  />
                ))}
              </div>
            )}

            {activeTab === "quiz" && <QuizPanel quizQuestions={quizQuestions} />}
          </div>

          <aside className="lc-side-col">
            <div className="lc-sidebar-card">
              <span className="lc-section-label">Your progress</span>
              <div className="lc-progress-summary">
                <ProgressRing pct={35} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>Keep going!</p>
                  <p style={{ fontSize: "11px", color: "var(--lc-text-muted)", margin: 0 }}>4 of 12 complete</p>
                </div>
              </div>
              <div className="lc-modules-list">
                {Object.entries(moduleMap).map(([name, count]) => (
                  <ModuleRow key={name} name={name} count={count} />
                ))}
              </div>
            </div>

            <div className="lc-sidebar-card">
              <span className="lc-section-label">Deadlines</span>
              {upcomingDeadlines.map((d, i) => <DeadlineItem key={i} item={d} />)}
            </div>
          </aside>
        </main>
      </div>

      {selectedAssessment && (
        <SubmitModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}