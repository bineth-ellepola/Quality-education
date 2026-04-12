import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";

const TYPE_OPTIONS = ["video", "lab_sheet", "lecture_note", "assignment", "quiz", "other"];
const DIFF_OPTIONS = ["beginner", "intermediate", "advanced"];
const VIS_OPTIONS = ["published", "draft"];

const TYPE_BADGE = {
  video: { bg: "#E6F1FB", color: "#185FA5" },
  lab_sheet: { bg: "#FAEEDA", color: "#854F0B" },
  lecture_note: { bg: "#EEEDFE", color: "#534AB7" },
  assignment: { bg: "#EAF3DE", color: "#3B6D11" },
  quiz: { bg: "#FCEBEB", color: "#A32D2D" },
  other: { bg: "#F1EFE8", color: "#5F5E5A" },
};

const DIFF_BADGE = {
  beginner: { bg: "#EAF3DE", color: "#3B6D11" },
  intermediate: { bg: "#FAEEDA", color: "#854F0B" },
  advanced: { bg: "#FCEBEB", color: "#A32D2D" },
};

const VIS_BADGE = {
  published: { bg: "#EAF3DE", color: "#3B6D11" },
  draft: { bg: "#FAEEDA", color: "#854F0B" },
};

function Badge({ label, style }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

function Chip({ label }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 9px",
        border: "0.5px solid #d1d0c8",
        borderRadius: 20,
        fontSize: 11,
        color: "#888780",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "#3C3489",
        color: "#EEEDFE",
        padding: "10px 18px",
        borderRadius: 8,
        fontSize: 13,
        zIndex: 300,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

function StatCard({ label, value, badgeLabel, badgeBg, badgeColor }) {
  return (
    <div
      style={{
        background: "#f6f5f2",
        borderRadius: 8,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: "#1a1a18" }}>{value}</div>
      <span
        style={{
          display: "inline-block",
          marginTop: 4,
          padding: "2px 9px",
          borderRadius: 20,
          fontSize: 10,
          background: badgeBg,
          color: badgeColor,
        }}
      >
        {badgeLabel}
      </span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: "#5f5e5a",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "0.5px solid #c4c3bb",
  background: "#fff",
  color: "#1a1a18",
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 72,
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
};

function ContentForm({ data, onChange }) {
  const f = data;
  const set = (k, v) => onChange({ ...f, [k]: v });

  return (
    <>
      <Field label="Title">
        <input
          style={inputStyle}
          value={f.title || ""}
          placeholder="e.g. Week 1 — Introduction"
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field label="Description">
        <textarea
          style={textareaStyle}
          value={f.description || ""}
          placeholder="Brief description of this content"
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Type">
          <select style={selectStyle} value={f.type || "video"} onChange={(e) => set("type", e.target.value)}>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select style={selectStyle} value={f.difficulty || "beginner"} onChange={(e) => set("difficulty", e.target.value)}>
            {DIFF_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Module">
          <input
            style={inputStyle}
            value={f.module || ""}
            placeholder="e.g. Module 1"
            onChange={(e) => set("module", e.target.value)}
          />
        </Field>
        <Field label="Week">
          <input
            style={inputStyle}
            value={f.week || ""}
            placeholder="e.g. 3"
            onChange={(e) => set("week", e.target.value)}
          />
        </Field>
      </div>

      <Field label="URL (optional)">
        <input
          style={inputStyle}
          value={f.url || ""}
          placeholder="https://..."
          onChange={(e) => set("url", e.target.value)}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Event date">
          <input
            type="date"
            style={inputStyle}
            value={f.eventDate || ""}
            onChange={(e) => set("eventDate", e.target.value)}
          />
        </Field>
        <Field label="Visibility">
          <select style={selectStyle} value={f.visibility || "published"} onChange={(e) => set("visibility", e.target.value)}>
            {VIS_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tags (comma separated)">
        <input
          style={inputStyle}
          value={f.tags || ""}
          placeholder="react, hooks, frontend"
          onChange={(e) => set("tags", e.target.value)}
        />
      </Field>
    </>
  );
}

function AssessmentForm({ data, onChange }) {
  const f = data;
  const set = (k, v) => onChange({ ...f, [k]: v });

  return (
    <>
      <Field label="Title">
        <input
          style={inputStyle}
          value={f.title || ""}
          placeholder="e.g. Midterm Exam"
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field label="Description">
        <textarea
          style={textareaStyle}
          value={f.description || ""}
          placeholder="What this assessment covers"
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Total marks">
          <input
            type="number"
            style={inputStyle}
            value={f.totalMarks || ""}
            placeholder="100"
            onChange={(e) => set("totalMarks", e.target.value)}
          />
        </Field>
        <Field label="Due date">
          <input
            type="date"
            style={inputStyle}
            value={f.dueDate || ""}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

function Modal({ visible, title, onClose, onSave, children }) {
  if (!visible) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #c4c3bb",
          borderRadius: 12,
          width: 500,
          maxWidth: "95vw",
          maxHeight: "88vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "0.5px solid #e4e3dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18" }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888780",
              fontSize: 16,
              lineHeight: 1,
              padding: "2px 4px",
            }}
          >
            x
          </button>
        </div>

        <div style={{ padding: 20, flex: 1 }}>{children}</div>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "0.5px solid #e4e3dc",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            position: "sticky",
            bottom: 0,
            background: "#fff",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "0.5px solid #c4c3bb",
              background: "#fff",
              color: "#1a1a18",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "0.5px solid #7F77DD",
              background: "#7F77DD",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentItem({ item, onEdit, onDelete }) {
  const typeBadge = TYPE_BADGE[item.type] || TYPE_BADGE.other;
  const diffBadge = DIFF_BADGE[item.difficulty] || DIFF_BADGE.beginner;
  const visBadge = VIS_BADGE[item.visibility] || VIS_BADGE.draft;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "#fff",
        border: "0.5px solid #e4e3dc",
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: typeBadge.bg,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill={typeBadge.color}>
          <rect x="2" y="2" width="12" height="12" rx="2" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#1a1a18",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </div>
        <div style={{ fontSize: 11, color: "#888780", marginTop: 1 }}>{item.description}</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <Badge label={item.type.replace("_", " ")} style={typeBadge} />
        <Badge label={item.difficulty} style={diffBadge} />
        <Badge label={item.visibility} style={visBadge} />
        {item.module && <Chip label={item.module} />}
        {item.week && <Chip label={`Wk ${item.week}`} />}
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(item)}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "0.5px solid #c4c3bb",
            background: "#fff",
            color: "#1a1a18",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "0.5px solid #f0bdbd",
            background: "#FCEBEB",
            color: "#A32D2D",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function AssessmentItem({ item, onEdit, onDelete }) {
  const isPast = item.dueDate && new Date(item.dueDate) < new Date();
  const dueLabel = item.dueDate
    ? new Date(item.dueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No due date";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "#fff",
        border: "0.5px solid #e4e3dc",
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#EAF3DE",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#3B6D11">
          <path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1zm1 4v1h6V6H5zm0 2v1h6V8H5zm0 2v1h4v-1H5z" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#1a1a18",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </div>
        <div style={{ fontSize: 11, color: "#888780", marginTop: 1 }}>{item.description}</div>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
        <Badge label={`${item.totalMarks} marks`} style={{ bg: "#EEEDFE", color: "#534AB7", background: "#EEEDFE" }} />
        <Badge
          label={`Due ${dueLabel}`}
          style={{
            background: isPast ? "#FCEBEB" : "#E6F1FB",
            color: isPast ? "#A32D2D" : "#185FA5",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(item)}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "0.5px solid #c4c3bb",
            background: "#fff",
            color: "#1a1a18",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "0.5px solid #f0bdbd",
            background: "#FCEBEB",
            color: "#A32D2D",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        margin: "1px 8px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        color: active ? "#1a1a18" : "#5f5e5a",
        background: active ? "#fff" : "transparent",
        fontWeight: active ? 500 : 400,
        transition: "background 0.15s",
      }}
    >
      {label}
    </div>
  );
}

export default function ManageContentsAssessments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState("content");
  const [searchQ, setSearchQ] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      const myCourses = res.data.data.filter((c) => c.instructor._id === user._id);
      setCourses(myCourses);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCourseData = async (courseId) => {
    setSelectedCourse(courseId);
    if (!courseId) { setContents([]); setAssessments([]); return; }
    try {
      const [contentRes, assessRes] = await Promise.all([
        axios.get(`${API}/content/courses/${courseId}/contents`),
        axios.get(`${API}/assestment/courses/${courseId}/assessments`),
      ]);
      setContents(contentRes.data.data || []);
      setAssessments(assessRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message: msg });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: "" }), 2400);
  };

  const openAdd = (type) => {
    if (!selectedCourse) { showToast("Select a course first"); return; }
    setEditingItem(null);
    setFormData({});
    setFile(null);
    setModalType(type);
    setModalVisible(true);
  };

  const openEdit = (item, type) => {
    setEditingItem(item);
    setModalType(type);
    setFile(null);
    if (type === "content") {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        type: item.type || "video",
        difficulty: item.difficulty || "beginner",
        module: item.module || "",
        week: item.week || "",
        url: item.url || "",
        eventDate: item.eventDate?.substring(0, 10) || "",
        tags: item.tags?.join(",") || "",
        visibility: item.visibility || "published",
      });
    } else {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        totalMarks: item.totalMarks || "",
        dueDate: item.dueDate?.substring(0, 10) || "",
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setModalType(null);
    setFormData({});
    setFile(null);
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) { showToast("Title is required"); return; }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    if (file) form.append("file", file);

    try {
      if (modalType === "content") {
        if (editingItem) {
          await axios.put(`${API}/content/contents/${editingItem._id}`, form);
        } else {
          await axios.post(`${API}/content/courses/${selectedCourse}/contents`, form);
        }
        showToast(editingItem ? "Content updated" : "Content added");
      } else {
        if (editingItem) {
          await axios.put(`${API}/assestment/assessments/${editingItem._id}`, form);
        } else {
          await axios.post(`${API}/assestment/courses/${selectedCourse}/assessments`, form);
        }
        showToast(editingItem ? "Assessment updated" : "Assessment added");
      }
      closeModal();
      loadCourseData(selectedCourse);
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);
      showToast("Error saving — check console");
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await axios.delete(`${API}/content/contents/${id}`);
      showToast("Content deleted");
      loadCourseData(selectedCourse);
    } catch (err) {
      console.error(err);
      showToast("Error deleting");
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm("Delete this assessment?")) return;
    try {
      await axios.delete(`${API}/assestment/assessments/${id}`);
      showToast("Assessment deleted");
      loadCourseData(selectedCourse);
    } catch (err) {
      console.error(err);
      showToast("Error deleting");
    }
  };

  const selectedCourseObj = courses.find((c) => c._id === selectedCourse);

  const filteredContents = contents.filter(
    (c) =>
      !searchQ ||
      c.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.type?.includes(searchQ.toLowerCase()) ||
      c.module?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const filteredAssessments = assessments.filter(
    (a) =>
      !searchQ ||
      a.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const publishedCount = contents.filter((c) => c.visibility === "published").length;
  const draftCount = contents.filter((c) => c.visibility === "draft").length;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", background: "#fafaf8" }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: 220,
          minHeight: "100vh",
          background: "#f6f5f2",
          borderRight: "0.5px solid #e4e3dc",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "0.5px solid #e4e3dc" }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#1a1a18", letterSpacing: "-0.3px" }}>
            Stud<span style={{ color: "#7F77DD" }}>ly</span>
          </div>
          <div style={{ fontSize: 10, color: "#888780", marginTop: 2 }}>Instructor portal</div>
        </div>

        <div style={{ padding: "12px 12px 4px", fontSize: 10, color: "#b4b2a9", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Manage
        </div>
        <NavItem label="Content manager" active={true} />
        <NavItem label="Schedule" active={false} />
        <NavItem label="Grades" active={false} />
        <NavItem label="Students" active={false} />

        <div style={{ padding: "12px 12px 4px", fontSize: 10, color: "#b4b2a9", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Analytics
        </div>
        <NavItem label="Reports" active={false} />

        <div style={{ marginTop: "auto", padding: 12, borderTop: "0.5px solid #e4e3dc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#EEEDFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 500,
                color: "#534AB7",
                flexShrink: 0,
              }}
            >
              {user?.name ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "IN"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{user?.name || "Instructor"}</div>
              <div style={{ fontSize: 11, color: "#888780" }}>Instructor</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "0.5px solid #e4e3dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18" }}>Content manager</div>
            <div style={{ fontSize: 12, color: "#888780", marginTop: 1 }}>Manage course materials and assessments</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search..."
              style={{
                padding: "7px 12px",
                border: "0.5px solid #c4c3bb",
                borderRadius: 8,
                background: "#f6f5f2",
                color: "#1a1a18",
                fontSize: 13,
                width: 180,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => openAdd("content")}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "0.5px solid #c4c3bb",
                background: "#fff",
                color: "#1a1a18",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Content
            </button>
            <button
              onClick={() => openAdd("assessment")}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "0.5px solid #7F77DD",
                background: "#7F77DD",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              + Assessment
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>

          {/* COURSE SELECT */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: "relative", maxWidth: 340 }}>
              <select
                value={selectedCourse || ""}
                onChange={(e) => loadCourseData(e.target.value || null)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "0.5px solid #c4c3bb",
                  background: "#fff",
                  color: "#1a1a18",
                  fontSize: 13,
                  appearance: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option value="">Select a course...</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NO COURSE SELECTED */}
          {!selectedCourse && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#b4b2a9", fontSize: 13 }}>
              Select a course above to manage its content and assessments
            </div>
          )}

          {/* COURSE PANEL */}
          {selectedCourse && selectedCourseObj && (
            <>
              {/* COURSE INFO */}
              <div
                style={{
                  background: "#f6f5f2",
                  border: "0.5px solid #e4e3dc",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18" }}>{selectedCourseObj.title}</div>
                  <div style={{ fontSize: 12, color: "#5f5e5a", marginTop: 2 }}>{selectedCourseObj.description}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {selectedCourseObj.category && <Chip label={selectedCourseObj.category} />}
                  <Chip label={`${contents.length + assessments.length} items`} />
                </div>
              </div>

              {/* STATS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 20 }}>
                <StatCard label="Total content" value={contents.length} badgeLabel="items" badgeBg="#EEEDFE" badgeColor="#534AB7" />
                <StatCard label="Assessments" value={assessments.length} badgeLabel="items" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
                <StatCard label="Published" value={publishedCount} badgeLabel="active" badgeBg="#E6F1FB" badgeColor="#185FA5" />
                <StatCard label="Drafts" value={draftCount} badgeLabel="pending" badgeBg="#FAEEDA" badgeColor="#854F0B" />
              </div>

              {/* TABS */}
              <div style={{ display: "flex", borderBottom: "0.5px solid #e4e3dc", marginBottom: 16 }}>
                {["content", "assessment"].map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "8px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                      color: activeTab === tab ? "#7F77DD" : "#5f5e5a",
                      borderBottom: activeTab === tab ? "2px solid #7F77DD" : "2px solid transparent",
                      fontWeight: activeTab === tab ? 500 : 400,
                      marginBottom: -0.5,
                      transition: "color 0.15s",
                    }}
                  >
                    {tab === "content" ? `Content (${contents.length})` : `Assessments (${assessments.length})`}
                  </div>
                ))}
              </div>

              {/* CONTENT LIST */}
              {activeTab === "content" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>Course content</span>
                    <button
                      onClick={() => openAdd("content")}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "0.5px solid #c4c3bb",
                        background: "#fff",
                        color: "#1a1a18",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      + Add content
                    </button>
                  </div>
                  {filteredContents.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#b4b2a9", fontSize: 13 }}>
                      {searchQ ? "No content matches your search." : "No content yet. Click '+ Add content' to get started."}
                    </div>
                  ) : (
                    filteredContents.map((c) => (
                      <ContentItem
                        key={c._id}
                        item={c}
                        onEdit={(item) => openEdit(item, "content")}
                        onDelete={handleDeleteContent}
                      />
                    ))
                  )}
                </>
              )}

              {/* ASSESSMENT LIST */}
              {activeTab === "assessment" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>Assessments</span>
                    <button
                      onClick={() => openAdd("assessment")}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "0.5px solid #7F77DD",
                        background: "#7F77DD",
                        color: "#fff",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      + Add assessment
                    </button>
                  </div>
                  {filteredAssessments.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#b4b2a9", fontSize: 13 }}>
                      {searchQ ? "No assessments match your search." : "No assessments yet. Click '+ Add assessment' to create one."}
                    </div>
                  ) : (
                    filteredAssessments.map((a) => (
                      <AssessmentItem
                        key={a._id}
                        item={a}
                        onEdit={(item) => openEdit(item, "assessment")}
                        onDelete={handleDeleteAssessment}
                      />
                    ))
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        title={`${editingItem ? "Edit" : "Add"} ${modalType}`}
        onClose={closeModal}
        onSave={handleSave}
      >
        {modalType === "content" && (
          <>
            <ContentForm data={formData} onChange={setFormData} />
            <Field label="Attach file (optional)">
              <input
                type="file"
                style={{ ...inputStyle, padding: "5px 8px" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Field>
          </>
        )}
        {modalType === "assessment" && (
          <>
            <AssessmentForm data={formData} onChange={setFormData} />
            <Field label="Attach file (optional)">
              <input
                type="file"
                style={{ ...inputStyle, padding: "5px 8px" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Field>
          </>
        )}
      </Modal>

      {/* TOAST */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}