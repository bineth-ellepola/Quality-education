import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/tickets";


function fmt(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}
function fmtShort(iso) {
  const d = new Date(iso), now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const STATUS_STYLES = {
  open:     { bg: "#ec0a0a", color: "#f7f8f9", dot: "#f6f8fb" },
  urgent:   { bg: "#fcebeb", color: "#a32d2d", dot: "#e24b4a" },
  pending:  { bg: "#faeeda", color: "#854f0b", dot: "#ef9f27" },
  resolved: { bg: "#eaf3de", color: "#f6faf2", dot: "#639922" },
};

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

export default function ComplainReply() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const now = useClockInternal();

  const user = JSON.parse(localStorage.getItem("user") || '{"_id":"admin","name":"Admin"}');

  const fetchTickets = async () => {
    try {
      const res = await axios.get(API);
      setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  const handleReply = async () => {
    if (!message && files.length === 0) return alert("Message or file required");
    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("senderRole", "admin");
    formData.append("message", message);
    for (let i = 0; i < files.length; i++) formData.append("attachments", files[i]);
    try {
      setLoading(true);
      await axios.post(`${API}/${selectedTicket._id}/message`, formData);
      setMessage("");
      setFiles([]);
      await fetchTickets();
      // Refresh selected ticket
      const res = await axios.get(API);
      const updated = res.data.tickets.find((t) => t._id === selectedTicket._id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      console.error(err);
      alert("Error sending reply");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      await fetchTickets();
      setSelectedTicket(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`${API}/${selectedTicket._id}`, { status: newStatus });
      await fetchTickets();
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.title?.toLowerCase().includes(q) || t.instructor?.name?.toLowerCase().includes(q);
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open" || t.status === "urgent").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div style={styles.root}>
      {/* ── SIDEBAR ── */}
      <aside style={styles.sidebar}>
        {/* Header */}
        <div style={styles.sidebarHeader}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={styles.brandText}>Support</span>
            <div style={styles.clockWrap}>
              
              <span style={styles.clockTime}>
                {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          </div>
          <div style={styles.dateRow}>
            {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            {[
              { label: "Total", value: stats.total, color: "#185fa5" },
              { label: "Open", value: stats.open, color: "#e24b4a" },
              { label: "Resolved", value: stats.resolved, color: "#639922" },
            ].map((s) => (
              <div key={s.label} style={styles.statCard}>
                <span style={{ ...styles.statNum, color: s.color }}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Search tickets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Ticket list */}
        <div style={styles.ticketList}>
          {filtered.length === 0 && (
            <div style={{ padding: "24px 16px", textAlign: "center", color: "#888", fontSize: 13 }}>No tickets found</div>
          )}
          {filtered.map((ticket) => {
            const active = selectedTicket?._id === ticket._id;
          return (
  <div
    key={ticket._id}
    onClick={() => setSelectedTicket(ticket)}
    style={{ ...styles.ticketItem, ...(active ? styles.ticketItemActive : {}) }}
  >
    <div style={styles.ticketItemTop}>
      <span style={styles.ticketTitle}>{ticket.title}</span>
      <Badge status={ticket.status} />
    </div>
    
    <div style={styles.ticketMeta}>
      {/* Container for Image and Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {ticket.instructor?.profilePicture ? (
          <img 
            src={ticket.instructor.profilePicture} 
            alt="profile" 
            style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} 
          />
        ) : (
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
            {ticket.instructor?.name?.charAt(0) || "?"}
          </div>
        )}
        <span>{ticket.instructor?.name || "Unknown"}</span>
      </div>
      
      <span style={{ marginLeft: "auto" }}>{fmtShort(ticket.createdAt)}</span>
    </div>

    <div style={styles.ticketPreview}>
      {ticket.messages?.[ticket.messages.length - 1]?.message?.slice(0, 60) || "No messages yet"}…
    </div>
  </div>
);
          })}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={styles.main}>
        {!selectedTicket ? (
          <div style={styles.emptyState}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ fontSize: 14, color: "#aaa", marginTop: 12 }}>Select a ticket to view conversation</p>
          </div>
        ) : (
          <>
            {/* Detail header */}
            <div style={styles.detailHeader}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h2 style={styles.detailTitle}>{selectedTicket.title}</h2>
                  <Badge status={selectedTicket.status} />
                </div>
                <p style={styles.detailDesc}>{selectedTicket.description}</p>
                <div style={styles.detailChips}>
                  <span style={styles.chip}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    {selectedTicket.instructor?.name || "Unknown"}
                  </span>
                  <span style={styles.chip}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {fmt(selectedTicket.createdAt)}
                  </span>
                  <span style={styles.chip}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {selectedTicket.messages?.length || 0} messages
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={styles.statusSelect}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button onClick={() => handleDeleteTicket(selectedTicket._id)} style={styles.btnDanger}>
                  Delete
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={styles.messagesArea}>
              {selectedTicket.messages?.map((msg) => {
                const isAdmin = msg.senderRole === "admin";
                return (
                  <div key={msg._id} style={{ ...styles.msgRow, justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                    {!isAdmin && (
                      <div style={{ ...styles.avatar, background: "#faeeda", color: "#854f0b" }}>
                        {initials(msg.sender?.name)}
                      </div>
                    )}
                    <div style={{ maxWidth: "65%" }}>
                      <div style={{ ...styles.msgMeta, justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                        <span>{msg.sender?.name || "Unknown"}</span>
                        <span style={{ color: "#bbb" }}>·</span>
                        <span>{fmt(msg.createdAt || new Date().toISOString())}</span>
                      </div>
                      <div style={{
                        ...styles.msgBubble,
                        background: isAdmin ? "#185fa5" : "#f3f4f6",
                        color: isAdmin ? "#fff" : "#1a1a1a",
                        borderBottomRightRadius: isAdmin ? 4 : 14,
                        borderBottomLeftRadius: isAdmin ? 14 : 4,
                        border: isAdmin ? "none" : "0.5px solid #e5e7eb",
                      }}>
                        <p style={{ margin: 0, lineHeight: 1.6 }}>{msg.message}</p>
                        {msg.attachments?.length > 0 && (
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                            {msg.attachments.map((f, i) => (
                              <a key={i} href={f.url} target="_blank" rel="noreferrer"
                                style={{ fontSize: 11, color: isAdmin ? "#b5d4f4" : "#185fa5", textDecoration: "underline" }}>
                                📎 {f.fileName}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ ...styles.avatar, background: "#e6f1fb", color: "#185fa5" }}>
                        {initials(user.name || "Admin")}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            <div style={styles.replyArea}>
              <div style={styles.replyBox}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply(); }}
                  placeholder="Type your reply… (Ctrl+Enter to send)"
                  style={styles.replyTextarea}
                />
                <div style={styles.replyFooter}>
                  <label style={styles.attachBtn}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    Attach
                    <input type="file" multiple style={{ display: "none" }}
                      onChange={(e) => setFiles(e.target.files)} />
                  </label>
                  {files.length > 0 && (
                    <span style={{ fontSize: 11, color: "#888", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {Array.from(files).map((f) => f.name).join(", ")}
                    </span>
                  )}
                  <button onClick={handleReply} disabled={loading} style={{ ...styles.btnPrimary, marginLeft: "auto" }}>
                    {loading ? "Sending…" : "Send reply"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function useClockInternal() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const styles = {
  root: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    height: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f7f8fa",
    overflow: "hidden",
  },
  sidebar: {
    background: "#0d1117",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRight: "0.5px solid #1e2530",
  },
  sidebarHeader: {
    padding: "18px 16px 14px",
    borderBottom: "0.5px solid #1e2530",
  },
  brandText: {
    fontSize: 17,
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.02em",
  },
  clockWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  clockDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    boxShadow: "0 0 0 2px rgba(34,197,94,0.2)",
  },
  clockTime: {
    fontSize: 12,
    color: "#8b949e",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "monospace",
  },
  dateRow: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 14,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 6,
    marginBottom: 12,
  },
  statCard: {
    background: "#161b22",
    border: "0.5px solid #1e2530",
    borderRadius: 8,
    padding: "8px 6px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statNum: { fontSize: 20, fontWeight: 600 },
  statLabel: { fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".04em" },
  searchWrap: {
    position: "relative",
    marginTop: 4,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#555",
  },
  searchInput: {
    width: "100%",
    padding: "8px 10px 8px 30px",
    fontSize: 12,
    background: "#161b22",
    border: "0.5px solid #2d333b",
    borderRadius: 8,
    color: "#c9d1d9",
    outline: "none",
  },
  ticketList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  ticketItem: {
    padding: "11px 12px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 3,
    border: "0.5px solid transparent",
    transition: "background .15s",
  },
  ticketItemActive: {
    background: "#1c2333",
    border: "0.5px solid #1d4ed8",
  },
  ticketItemTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  ticketTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#e6edf3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  ticketMeta: {
    display: "flex",
    fontSize: 11,
    color: "#8b949e",
    marginBottom: 3,
  },
  ticketPreview: {
    fontSize: 11,
    color: "#6b7280",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeader: {
    padding: "16px 24px",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    background: "#fff",
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  detailDesc: {
    fontSize: 12,
    color: "#6b7280",
    margin: "0 0 8px",
    lineHeight: 1.5,
  },
  detailChips: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#6b7280",
  },
  statusSelect: {
    fontSize: 12,
    padding: "7px 10px",
    border: "0.5px solid #d1d5db",
    borderRadius: 8,
    background: "#f9fafb",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
  },
  btnDanger: {
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 500,
    background: "#fef2f2",
    border: "0.5px solid #fca5a5",
    color: "#b91c1c",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 500,
    background: "#185fa5",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    background: "#f9fafb",
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 600,
    flexShrink: 0,
  },
  msgMeta: {
    display: "flex",
    gap: 6,
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 4,
  },
  msgBubble: {
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 13,
    lineHeight: 1.6,
  },
  replyArea: {
    padding: "14px 24px 18px",
    borderTop: "0.5px solid #e5e7eb",
    background: "#fff",
  },
  replyBox: {
    border: "0.5px solid #d1d5db",
    borderRadius: 12,
    overflow: "hidden",
    background: "#f9fafb",
  },
  replyTextarea: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 13,
    background: "transparent",
    border: "none",
    outline: "none",
    resize: "none",
    color: "#111",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    lineHeight: 1.6,
    minHeight: 72,
  },
  replyFooter: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderTop: "0.5px solid #e5e7eb",
    background: "#f3f4f6",
  },
  attachBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#6b7280",
    cursor: "pointer",
    padding: "4px 10px",
    border: "0.5px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
  },
};