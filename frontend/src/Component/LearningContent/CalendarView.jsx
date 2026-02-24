import React, { useState, useMemo } from "react";

export default function CalendarView({ items }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => {
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        // Fill empty spots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Fill days of current month
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const dayEvents = items.filter((it) => {
                if (!it.eventDate) return false;
                const eventDate = new Date(it.eventDate);
                return (
                    !isNaN(eventDate.getTime()) &&
                    eventDate.getFullYear() === year &&
                    eventDate.getMonth() === month &&
                    eventDate.getDate() === d
                );
            });
            days.push({ day: d, dateStr, events: dayEvents });
        }

        return days;
    }, [items, year, month]);

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    return (
        <div style={container}>
            {/* Calendar Header */}
            <div style={header}>
                <button onClick={() => changeMonth(-1)} style={navBtn}>‹</button>
                <span style={monthTitle}>
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </span>
                <button onClick={() => changeMonth(1)} style={navBtn}>›</button>
            </div>

            {/* Weekdays */}
            <div style={grid}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} style={weekdayLabel}>{d}</div>
                ))}
                {calendarDays.map((dayObj, idx) => (
                    <div key={idx} style={dayCell(dayObj !== null)}>
                        {dayObj && (
                            <>
                                <div style={dayNumber}>{dayObj.day}</div>
                                <div style={eventList}>
                                    {dayObj.events.map((ev) => (
                                        <div key={ev.id} style={eventItem(ev.type)}>
                                            {ev.title.substring(0, 15)}...
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const container = {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid rgba(15,23,42,.10)",
    boxShadow: "0 10px 30px rgba(15,23,42,.05)",
};

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
};

const monthTitle = {
    fontSize: 18,
    fontWeight: 900,
    color: "#111827",
};

const navBtn = {
    background: "#f3f4f6",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 20,
    fontWeight: 900,
    color: "#111827",
    display: "grid",
    placeItems: "center",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 1,
    background: "rgba(15,23,42,.05)",
    border: "1px solid rgba(15,23,42,.05)",
};

const weekdayLabel = {
    background: "#f9fafb",
    padding: "10px 4px",
    textAlign: "center",
    fontSize: 12,
    fontWeight: 800,
    color: "#6b7280",
};

const dayCell = (isDay) => ({
    background: isDay ? "#fff" : "#fcfcfd",
    minHeight: 100,
    padding: 6,
    display: "flex",
    flexDirection: "column",
    gap: 4,
});

const dayNumber = {
    fontSize: 13,
    fontWeight: 800,
    color: "#374151",
};

const eventList = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

const eventItem = (type) => ({
    fontSize: 10,
    padding: "2px 4px",
    borderRadius: 4,
    background: type === "video" ? "#eef2ff" : "#ecfdf5",
    color: type === "video" ? "#4f46e5" : "#059669",
    border: `1px solid ${type === "video" ? "#c7d2fe" : "#a7f3d0"}`,
    overflow: "hidden",
    whiteSpace: "nowrap",
});
