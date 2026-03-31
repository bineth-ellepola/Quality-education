import React, { useEffect, useState, useMemo } from 'react';

const LEVEL_COLORS = {
  Beginner: '#1D9E75',
  Intermediate: '#BA7517',
  Advanced: '#D85A30',
};

const SUBJECT_BG = {
  Design: '#EAF3DE',
  Engineering: '#E6F1FB',
  Data: '#FAEEDA',
  Product: '#FBEAF0',
  Marketing: '#FAECE7',
  Business: '#EEEDFE',
};

function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getBg(subjectName) {
  return SUBJECT_BG[subjectName] || '#F1EFE8';
}

const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col gap-4 animate-pulse">
    <div className="h-36 rounded-lg bg-slate-100" />
    <div className="h-3 w-1/3 bg-slate-100 rounded" />
    <div className="h-4 w-4/5 bg-slate-100 rounded" />
    <div className="h-3 w-full bg-slate-100 rounded" />
    <div className="h-3 w-2/3 bg-slate-100 rounded" />
    <div className="mt-auto h-px bg-slate-100" />
    <div className="flex justify-between">
      <div className="h-3 w-16 bg-slate-100 rounded" />
      <div className="h-4 w-12 bg-slate-100 rounded" />
    </div>
    <div className="h-9 bg-slate-100 rounded-lg" />
  </div>
);

const CourseCard = ({ course }) => {
  const subjectName = course.subject?.name || '';
  const instructorName = course.instructor?.name || '';
  const bg = getBg(subjectName);

  return (
    <div className="group bg-white border border-slate-100 rounded-xl p-5 flex flex-col gap-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer">
      {course.coverImage ? (
        <div className="h-36 rounded-lg overflow-hidden">
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-36 rounded-lg flex items-center justify-center text-4xl" style={{ background: bg }}>
          {course.emoji || '📘'}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          {subjectName}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium"
          style={{ color: LEVEL_COLORS[course.level] || '#888' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: LEVEL_COLORS[course.level] || '#888' }} />
          {course.level}
        </span>
      </div>

      <div>
        <h2 className="text-[15px] font-semibold text-slate-900 line-clamp-2">
          {course.title}
        </h2>
        <p className="mt-1.5 text-[12.5px] text-slate-400 line-clamp-2">
          {course.description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
          {getInitials(instructorName)}
        </div>
        <span className="text-[12px] text-slate-500 truncate">{instructorName}</span>
        <div className="ml-auto flex items-center gap-1 text-[12px] text-slate-500">
          ★ {course.averageRating}
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between">
        <span className="text-[13px] font-semibold">{course.duration}h</span>
        <span className={`text-[15px] font-semibold ${course.price === 0 ? 'text-emerald-600' : ''}`}>
          {course.price === 0 ? 'Free' : `${course.currency || '$'} ${course.price}`}
        </span>
      </div>

      <button className="w-full h-9 bg-slate-900 text-white text-[12px] rounded-lg">
        Enroll now
      </button>
    </div>
  );
};

const CourseFetch = ({ limit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState('all');
  const [sortMode, setSortMode] = useState('default');

  const isLanding = !!limit;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/courses');
        const result = await res.json();
        setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const filtered = useMemo(() => {
    let list = [...data];

    if (!isLanding) {
      if (activeLevel !== 'all') {
        list = list.filter((c) => c.level === activeLevel);
      }

      if (search.trim()) {
        const s = search.toLowerCase();
        list = list.filter((c) =>
          c.title?.toLowerCase().includes(s) ||
          c.subject?.name?.toLowerCase().includes(s)
        );
      }
    }

    if (sortMode === 'rating') {
      list.sort((a, b) => b.averageRating - a.averageRating);
    }

    return list;
  }, [data, activeLevel, search, sortMode, isLanding]);

  const displayedCourses = useMemo(() => {
    let list = [...filtered];

    if (limit) {
      list = list.slice(0, limit);
    }

    return list;
  }, [filtered, limit]);

  return (
    <div className={`${isLanding ? '' : 'min-h-screen bg-slate-50 py-10'}`}>
      <div className="max-w-5xl mx-auto px-4">

        {!isLanding && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Courses</h1>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="mb-4 border p-2 rounded w-full"
            />
          </>
        )}

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseFetch;