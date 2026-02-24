import React, { useEffect, useMemo, useState } from "react";
import AddContent from "./AddContent";
import ContentCrd from "./ContentCrd";
import EditContent from "./EditContent";
import CalendarView from "./CalendarView";

const API_URL = "http://localhost:5001/api/content";

function transformItem(item) {
  return { ...item, id: item._id };
}

export default function ContentList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [vis, setVis] = useState("all");
  const [sort, setSort] = useState("updated_desc");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [view, setView] = useState("list"); // "list" or "calendar"

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.data) {
        setItems(json.data.map(transformItem));
      }
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = items;

    if (query) {
      out = out.filter((i) => {
        const hay = [
          i.title,
          i.course,
          i.module,
          i.week,
          i.description,
          i.url,
          (i.tags || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    if (type !== "all") out = out.filter((i) => i.type === type);
    if (vis !== "all") out = out.filter((i) => i.visibility === vis);

    const byUpdated = (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt);
    const byTitle = (a, b) => a.title.localeCompare(b.title);

    if (sort === "updated_desc") out = out.slice().sort((a, b) => byUpdated(b, a));
    if (sort === "updated_asc") out = out.slice().sort(byUpdated);
    if (sort === "title_asc") out = out.slice().sort(byTitle);
    if (sort === "title_desc") out = out.slice().sort((a, b) => byTitle(b, a));

    return out;
  }, [items, q, type, vis, sort]);

  const stats = useMemo(() => {
    const published = items.filter((i) => i.visibility === "published").length;
    const draft = items.filter((i) => i.visibility === "draft").length;
    return { total: items.length, published, draft };
  }, [items]);

  const createItem = async (formData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setItems((prev) => [transformItem(json.data), ...prev]);
        return true;
      } else {
        alert(json.message || "Failed to create content");
        return false;
      }
    } catch (err) {
      console.error("Failed to create item:", err);
      alert("Network error: Failed to reach backend");
      return false;
    }
  };

  const updateItem = async (id, formData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setItems((prev) =>
          prev.map((x) => (x.id === id ? transformItem(json.data) : x))
        );
        return true;
      } else {
        alert(json.message || "Failed to update content");
        return false;
      }
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Network error: Failed to reach backend");
      return false;
    }
  };

  const deleteItem = async (item) => {
    const ok = window.confirm(`Delete this content?\n\n${item.title}\n\nThis cannot be undone.`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== item.id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const resetDemo = () => {
    alert("Reset Demo is disabled in API mode.");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* Sidebar navigation */}
      <aside className="glass" style={{ width: 260, padding: 24, display: "flex", flexDirection: "column", gap: 32, zIndex: 10, position: "fixed", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 20 }}>Q</div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>QualityEdu</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SidebarLink active icon="📚" label="Content Library" />
          <SidebarLink icon="👥" label="Students" />
          <SidebarLink icon="📊" label="Analytics" />
          <SidebarLink icon="⚙️" label="Settings" />
        </nav>

        <div style={{ marginTop: "auto" }} className="glass-card">
          <div style={{ padding: 12, display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Storage Usage</div>
            <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "var(--primary)" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: 260, flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Top Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28 }}>Learning Management</h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 14 }}>Manage your courses, modules, and learning materials here.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="glass" style={{ ...btnStyle("secondary"), border: "1px solid rgba(0,0,0,0.05)" }}>🔔</button>
            <button style={btnStyle("primary")} onClick={() => setAddOpen(true)}>＋ New Material</button>
          </div>
        </header>

        {/* Stats Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <StatCard title="Total Materials" value={stats.total} icon="📂" trend="+12% from last wk" />
          <StatCard title="Published Content" value={stats.published} icon="✅" trend="+5% from last wk" />
          <StatCard title="Drafts" value={stats.draft} icon="📝" trend="-2% from last wk" />
        </section>

        {/* Filters & Content Area */}
        <section className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 300 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search across courses, materials, and tags..."
                style={{ ...inputStyle, width: "100%", paddingLeft: 40, border: "1px solid #e2e8f0" }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
                <option value="all">All Types</option>
                {/* Content types handled by data */}
                <option value="video">Videos</option>
                <option value="lab_sheet">Lab Sheets</option>
                <option value="lecture_note">Lecture Notes</option>
              </select>

              <div className="glass" style={{ padding: 4, borderRadius: 12, display: "flex", gap: 4 }}>
                <ViewBtn icon="📱" active={view === "list"} onClick={() => setView("list")} />
                <ViewBtn icon="📅" active={view === "calendar"} onClick={() => setView("calendar")} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="animate-fade-in" style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>Loading materials...</div>
              </div>
            ) : view === "calendar" ? (
              <CalendarView items={items} />
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                <h3>No materials found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {filtered.map((item) => (
                  <ContentCrd
                    key={item.id}
                    item={item}
                    onEdit={(it) => {
                      setEditingItem(it);
                      setEditOpen(true);
                    }}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      <AddContent open={addOpen} onClose={() => setAddOpen(false)} onCreate={createItem} />
      <EditContent open={editOpen} onClose={() => { setEditOpen(false); setEditingItem(null); }} item={editingItem} onUpdate={updateItem} />
    </div>
  );
}

function SidebarLink({ icon, label, active }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 12,
      cursor: "pointer",
      background: active ? "var(--primary)" : "transparent",
      color: active ? "#fff" : "var(--text-muted)",
      fontWeight: active ? 700 : 600
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="glass-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 12, color: trend.includes("+") ? "var(--success)" : "var(--danger)", fontWeight: 700, marginTop: 8 }}>{trend}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--primary-light)", display: "grid", placeItems: "center", fontSize: 24 }}>{icon}</div>
    </div>
  );
}

function ViewBtn({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: active ? "#fff" : "transparent",
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 16,
        boxShadow: active ? "var(--shadow-sm)" : "none"
      }}
    >
      {icon}
    </button>
  );
}

const inputStyle = {
  borderRadius: 12,
  padding: "12px 16px",
  border: "1px solid var(--glass-border)",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};

const selectStyle = {
  ...inputStyle,
  background: "#fff",
  paddingRight: 32,
  cursor: "pointer"
};

function btnStyle(variant) {
  const base = {
    borderRadius: 12,
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
  if (variant === "secondary") return { ...base, background: "#fff", color: "var(--text-main)", boxShadow: "0 0 0 1px rgba(0,0,0,0.05)" };
  return { ...base, background: "var(--primary)", color: "#fff", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" };
}
