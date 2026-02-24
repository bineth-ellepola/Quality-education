import React from "react";

const typeIcon = (type) => {
  const map = {
    video: "🎬",
    lab_sheet: "🔬",
    lecture_note: "📝",
    assignment: "📂",
    quiz: "🧠",
    other: "✨",
  };
  return map[type] || "📄";
};

export default function ContentCrd({ item, onEdit, onDelete }) {
  const isVideo = item.type === "video";

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: "20px 24px",
        display: "grid",
        gap: 16,
        border: "1px solid rgba(255, 255, 255, 0.5)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: isVideo ? "rgba(79, 70, 229, 0.1)" : "rgba(16, 185, 129, 0.1)",
            display: "grid",
            placeItems: "center",
            fontSize: 24
          }}>
            {typeIcon(item.type)}
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text-main)", letterSpacing: -0.3 }}>{item.title}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, color: "var(--primary)" }}>{item.course}</span>
              <span style={{ opacity: 0.3 }}>•</span>
              <span>{item.module}</span>
              {item.week && (
                <>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span>Week {item.week}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge type={item.visibility === "published" ? "success" : "warning"}>
            {item.visibility === "published" ? "Published" : "Draft"}
          </Badge>
          {item.difficulty && (
            <Badge type="info">{item.difficulty}</Badge>
          )}
        </div>
      </div>

      {item.description && (
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.description}</p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 8 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {item.fileUrl && (
            <a
              href={`http://localhost:5001${item.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--success)",
                background: "rgba(16, 185, 129, 0.1)",
                padding: "8px 14px",
                borderRadius: 10
              }}
            >
              📥 Download {isVideo ? "Video" : "PDF"}
            </a>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600
              }}
            >
              🔗 <span style={{ textDecoration: "underline" }}>Visit Resource Link</span>
            </a>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onEdit(item)}
            style={{ ...actionBtn, background: "#fff", border: "1px solid #e2e8f0" }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            style={{ ...actionBtn, background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 8,
        paddingTop: 12,
        borderTop: "1px solid rgba(0,0,0,0.03)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
        color: "var(--text-muted)"
      }}>
        <span>Last updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
        {item.eventDate && !isNaN(new Date(item.eventDate).getTime()) && (
          <span style={{ fontWeight: 700, color: "var(--primary)" }}>
            📅 Event: {new Date(item.eventDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

function Badge({ children, type }) {
  const colors = {
    success: { bg: "rgba(16, 185, 129, 0.12)", text: "#059669", border: "rgba(16, 185, 129, 0.2)" },
    warning: { bg: "rgba(245, 158, 11, 0.15)", text: "#d97706", border: "rgba(245, 158, 11, 0.2)" },
    info: { bg: "rgba(79, 70, 229, 0.08)", text: "var(--primary)", border: "rgba(79, 70, 229, 0.15)" },
  };
  const c = colors[type] || colors.info;
  return (
    <span style={{
      padding: "4px 12px",
      borderRadius: "var(--radius-full)",
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      fontSize: 12,
      fontWeight: 800,
      textTransform: "capitalize"
    }}>
      {children}
    </span>
  );
}

const actionBtn = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  transition: "all 0.2s"
};
