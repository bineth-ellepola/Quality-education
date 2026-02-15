import React, { useState } from 'react';
import { LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, MoreVertical, GraduationCap } from 'lucide-react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Advanced React Patterns', subject: 'Web Dev', students: 0, progress: 2 },
    { id: 2, title: 'UI/UX Design Fundamentals', subject: 'Design', students: 0, progress: 3 },
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 text-indigo-600 font-bold text-2xl flex items-center gap-2">
          <GraduationCap size={32} /> Studly
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutGrid size={20}/>} label="Dashboard" active />
          <NavItem icon={<BookOpen size={20}/>} label="My Courses" />
          <NavItem icon={<Users size={20}/>} label="Students" />
          <NavItem icon={<BarChart3 size={20}/>} label="Analytics" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Instructor Dashboard</h1>
            <p className="text-slate-500">Welcome back, Professor Smith.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <Plus size={20} /> Create New Course
          </button>
        </header>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Students" value="0" growth="+12%" />
          <StatCard label="Course Completion" value="76%" growth="+5%" />
          <StatCard label="Active Subjects" value="12" growth="0%" />
        </div>

        {/* SUBJECTS & COURSES GRID */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
          {/* Add New Placeholder */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-all">
             <Plus size={48} className="mb-2" />
             <span className="font-medium">Add New Subject</span>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components for clean code
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
    {icon} <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ label, value, growth }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-sm">{label}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <span className="text-emerald-500 text-sm font-medium">{growth}</span>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-32 bg-indigo-100 flex items-center justify-center text-indigo-400">
        <BookOpen size={40} />
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start">
        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md font-semibold">{course.subject}</span>
        <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
      </div>
      <h4 className="font-bold text-slate-800 mt-2">{course.title}</h4>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Users size={16} /> {course.students} Students
        </div>
        <span>{course.progress}% Active</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
      </div>
    </div>
  </div>
);

export default InstructorDashboard;