import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Panel 1: Course Builder ─────────────────────────────
function CourseBuilderPanel() {
  return (
    <div className="bg-[#1a2744] rounded-3xl overflow-hidden h-[680px] flex flex-col shadow-2xl transition-all duration-500 hover:shadow-blue-500/10">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <div className="flex gap-4 ml-6">
          <span className="text-[12px] px-4 py-1.5 rounded-md bg-white/15 text-white font-semibold">Design</span>
          <span className="text-[12px] text-white/40 font-semibold">Insights</span>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex flex-col gap-8 px-4 py-8 border-r border-white/10 w-16 items-center">
          {["M", "L", "S", "T", "E", "C"].map((icon) => (
            <div key={icon} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-[10px] text-white/40 font-bold">{icon}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[11px] text-white/50 font-bold uppercase tracking-[0.2em]">Layout</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Section", shape: "rect" },
              { label: "Container", shape: "rect-inner" },
              { label: "Quick Stack", shape: "grid" },
              { label: "V Flex", shape: "vflex" },
              { label: "H Flex", shape: "hflex" },
              { label: "Page Slot", shape: "plus" },
            ].map(({ label, shape }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-full aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                   <div className="w-16 h-10 border border-white/20 rounded-md" />
                </div>
                <span className="text-[11px] text-white/30 text-center font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel 2: Analytics Dashboard ────────────────────────────────────
function AnalyticsPanel() {
  const bars = [40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 50, 40, 90, 55, 75];
  return (
    <div className="bg-[#111317] rounded-3xl overflow-hidden h-[680px] flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-2 font-bold">Total sessions</div>
            <div className="text-4xl font-bold text-white tracking-tighter">30,321</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-2 font-bold">Unique visitors</div>
            <div className="text-4xl font-bold text-white tracking-tighter">22,616</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 border border-white/5 flex-1 flex flex-col">
          <div className="text-[12px] text-white/40 mb-auto font-bold uppercase tracking-widest">Site overview</div>
          <div className="flex items-end gap-2 h-48">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md transition-all duration-700 hover:bg-blue-400" style={{ height: `${h}%`, background: i === 7 ? "#3b82f6" : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel 3: Permissions ────────────────────────────
function PermissionsPanel() {
  const members = [
    { name: "Hannah Everett", email: "hannah.e@ai.com", role: "Site manager" },
    { name: "Ruben Herwitz", email: "ruben.h@ai.com", role: "Site manager" },
    { name: "Marley Dias", email: "marley.d@ai.com", role: "Marketer", active: true },
    { name: "Drew Kozmary", email: "drew.k@ai.com", role: "Designer" },
    { name: "Emily DiRienzo", email: "emily.d@ai.com", role: "Marketer" },
    { name: "Alex Rivera", email: "alex.r@ai.com", role: "Developer" },
  ];
  return (
    <div className="bg-[#f9f9f9] rounded-3xl overflow-hidden h-[680px] flex flex-col shadow-2xl border border-gray-100">
      <div className="px-8 py-8 border-b border-black/5 bg-white">
        <div className="flex gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-black/10" />
          <span className="w-3 h-3 rounded-full bg-black/10" />
          <span className="w-3 h-3 rounded-full bg-black/10" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Site access</h3>
        <p className="text-[13px] text-gray-400 mt-1">Manage your team and set site roles.</p>
      </div>

      <div className="p-6 flex flex-col gap-2 flex-1">
        {members.map((m) => (
          <div key={m.name} className="flex justify-between items-center py-5 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <div className="text-[13px] font-bold text-gray-800">{m.name}</div>
                <div className="text-[12px] text-gray-400">{m.email}</div>
              </div>
            </div>
            <span className={`text-[11px] px-3 py-1.5 rounded-lg border ${m.active ? "bg-white border-gray-200 text-gray-900 font-bold shadow-sm" : "border-transparent text-gray-400"}`}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignSection() {
  const [titleRef, titleInView] = useInView(0.2);
  const [cardsRef, cardsInView] = useInView(0.1);

  const animationStyle = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(40px)",
    transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  });

  return (
    <section className="py-32 bg-white antialiased">
      <div className="max-w-[1440px] mx-auto px-10">
        
        {/* Header Section */}
        <div 
          ref={titleRef}
          style={animationStyle(titleInView)}
          className="flex flex-col lg:flex-row justify-between items-baseline mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-[80px] font-bold text-gray-950 leading-[1.0] tracking-tighter mb-6">
             <span className="text-[#615d90]">Learn</span> it in your <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            way
          </span> 
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[19px] text-gray-500 leading-relaxed font-normal">
              Use the full power of HTML5 to build responsive flexbox and grid layouts — with visual control over every detail.
            </p>
          </div>
        </div>

        {/* Cards Grid - Increased Height and Gaps */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16"
        >
          <div style={animationStyle(cardsInView, 0)}>
            <CourseBuilderPanel />
          </div>
          <div style={animationStyle(cardsInView, 100)}>
            <AnalyticsPanel />
          </div>
          <div style={animationStyle(cardsInView, 200)}>
            <PermissionsPanel />
          </div>
        </div>

        {/* Labels Grid */}
        <div 
          style={animationStyle(cardsInView, 400)}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            { label: "Course Builder", desc: "Drag-and-drop modules with full layout control and real-time visual feedback." },
            { label: "Real-time Analytics", desc: "Track sessions, pages, and conversion goals with high-performance dashboards." },
            { label: "Team & Permissions", desc: "Granular role access for every team member to keep your site secure and organized." },
          ].map(({ label, desc }) => (
            <div key={label} className="pr-8">
              <h4 className="text-[18px] font-bold text-gray-900 mb-3 tracking-tight">{label}</h4>
              <p className="text-[16px] text-gray-500 leading-[1.6] font-normal">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}