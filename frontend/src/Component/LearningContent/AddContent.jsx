import React, { useMemo, useState } from "react";

const CONTENT_TYPES = [
  { value: "video", label: "Video" },
  { value: "lab_sheet", label: "Lab Sheet" },
  { value: "lecture_note", label: "Lecture Note" },
  { value: "assignment", label: "Assignment" },
  { value: "quiz", label: "Quiz" },
  { value: "other", label: "Other" },
];

const DIFFICULTY = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const emptyForm = {
  title: "",
  type: "video",
  course: "",
  module: "",
  week: "",
  difficulty: "beginner",
  url: "",
  file: null,
  eventDate: "",
  description: "",
  tags: "", // comma-separated
  visibility: "published",
};

export default function AddContent({ open, onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const title = useMemo(() => "Add New Content", []);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.course.trim()) e.course = "Course is required.";
    if (!form.module.trim()) e.module = "Module is required.";
    if (!form.url.trim() && !form.file) e.url = "Either URL or File is required.";
    if (form.url.trim() && !/^https?:\/\//i.test(form.url.trim())) {
      e.url = "URL must start with http:// or https://";
    }
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("type", form.type);
    formData.append("course", form.course.trim());
    formData.append("module", form.module.trim());
    formData.append("week", form.week.trim());
    formData.append("difficulty", form.difficulty);
    formData.append("url", form.url.trim());
    if (form.file) formData.append("file", form.file);
    formData.append("eventDate", form.eventDate);
    formData.append("description", form.description.trim());
    normalizeTags(form.tags).forEach(tag => formData.append("tags[]", tag));
    formData.append("visibility", form.visibility);

    const success = await onCreate(formData);

    if (success) {
      setForm(emptyForm);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <Row cols={2}>
          <Field label="Title *" error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g., Week 01 • Intro (Lecture Notes)"
              style={inputStyle}
            />
          </Field>

          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              style={inputStyle}
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </Row>

        <Row cols={2}>
          <Field label="Course *" error={errors.course}>
            <input
              value={form.course}
              onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
              placeholder="e.g., Computer Networks"
              style={inputStyle}
            />
          </Field>

          <Field label="Module *" error={errors.module}>
            <input
              value={form.module}
              onChange={(e) => setForm((p) => ({ ...p, module: e.target.value }))}
              placeholder="e.g., Basics"
              style={inputStyle}
            />
          </Field>
        </Row>

        <Row cols={3}>
          <Field label="Week (optional)">
            <input
              value={form.week}
              onChange={(e) => setForm((p) => ({ ...p, week: e.target.value }))}
              placeholder="01"
              style={inputStyle}
            />
          </Field>

          <Field label="Difficulty">
            <select
              value={form.difficulty}
              onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
              style={inputStyle}
            >
              {DIFFICULTY.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Visibility">
            <select
              value={form.visibility}
              onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}
              style={inputStyle}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
        </Row>

        <Row cols={2}>
          <Field label="Content URL" error={errors.url}>
            <input
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://... (Youtube / Drive / etc.)"
              style={inputStyle}
            />
          </Field>

          <Field label="OR Upload File (Video/PDF)">
            <input
              type="file"
              accept="video/*,application/pdf"
              onChange={(e) => setForm((p) => ({ ...p, file: e.target.files[0] }))}
              style={{ ...inputStyle, padding: "8px" }}
            />
          </Field>
        </Row>

        <Field label="Event Date (for Calendar)">
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
            style={inputStyle}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Short summary (optional)"
            style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="Week-01, Notes, Lab"
            style={inputStyle}
          />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={btnStyle("secondary")}>
            Cancel
          </button>
          <button type="submit" style={btnStyle("primary")}>
            Add Content
          </button>
        </div>
      </form>
    </Modal>
  );
}

function normalizeTags(input) {
  if (!input) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

/* ------- Small UI helpers (no external libs) ------- */

function Modal({ title, onClose, children }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "min(860px, 100%)",
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(15,23,42,.12)",
          boxShadow: "0 20px 60px rgba(15,23,42,.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(15,23,42,.10)",
            background: "linear-gradient(180deg, rgba(99,102,241,.10), transparent)",
          }}
        >
          <div style={{ fontWeight: 900 }}>{title}</div>
          <button onClick={onClose} style={btnStyle("secondary")} type="button">
            ✕ Close
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

function Row({ cols = 2, children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{label}</span>
      {children}
      {error ? <span style={{ fontSize: 12, fontWeight: 800, color: "#b91c1c" }}>{error}</span> : null}
    </label>
  );
}

const inputStyle = {
  borderRadius: 12,
  padding: "10px 12px",
  border: "1px solid rgba(15,23,42,.14)",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};

function btnStyle(variant) {
  const base = {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 13,
  };
  if (variant === "secondary") return { ...base, background: "#fff", borderColor: "rgba(15,23,42,.14)" };
  if (variant === "primary") return { ...base, background: "#4f46e5", color: "#fff" };
  return base;
}