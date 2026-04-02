import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, BookOpen, User, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to safely parse prerequisites
  const parsePrerequisites = (prereq) => {
    if (!prereq) return [];
    try {
      // If it's already an array, return as-is
      if (Array.isArray(prereq)) {
        // But sometimes elements are still stringified
        return prereq.flatMap(p => {
          if (typeof p === 'string') {
            try {
              const parsed = JSON.parse(p);
              return Array.isArray(parsed) ? parsed : parsed;
            } catch {
              return p;
            }
          }
          return p;
        });
      }
      // If it's a string, try to parse it
      const parsed = JSON.parse(prereq);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return Array.isArray(prereq) ? prereq : [prereq];
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/courses/${id}`);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <LoadingState />;
  const durationInDays = (course.duration / 24).toFixed(1);
  const cleanPrerequisites = parsePrerequisites(course.prerequisites);

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fafafa] pb-20"
    >
      {/* Immersive Header Image */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={course.coverImage} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge icon={<Tag size={14} />} text={course.subject?.name} color="bg-blue-50 text-[#3f7d20]" />
                <Badge icon={<ShieldCheck size={14} />} text={`ID: ${course.courseId}`} color="bg-slate-100 text-slate-600" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
                {course.title}
              </h1>

              <div className="flex flex-wrap gap-8 py-6 border-y border-slate-50">
                <Stat icon={<Clock size={20} />} label="Duration(hrs)" value={course.duration} />
                <Stat icon={<BookOpen size={20} />} label="Subject" value={course.subject?.name} />
                <Stat icon={<User size={20} />} label="Instructor(creator)" value={course.instructor?.name} />
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">About this course</h3>
                <p className="text-slate-500 leading-relaxed text-lg whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Detailed Subject & Instructor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Course Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="text-slate-700 font-bold text-xs uppercase tracking-wider">Course Deep-Dive</h4>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                    {course.status}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-slate-900 font-semibold text-lg mb-4 leading-tight">
                    {course.description || "Master the core concepts of this field."}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: "Internal ID", val: course._id, mono: true },
                      { label: "Limit", val: `${course.enrollmentLimit} Students` },
                      { label: "Level", val: course.level },
                      { label: "Price", val: course.price },
                      { label: "Status", val: course.status },
                      { label: "Duration", val:` ${durationInDays} Days (${course.duration} hrs)` },
                      { label: "Average Ratings", val: course.averageRating },
                      { label: "Total Ratings", val: course.totalRatings },
                      {
                        label: "Prerequisites",
                        val: cleanPrerequisites.length ? cleanPrerequisites.join(" / ") : "None"
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                        <span className={`text-xs ${item.mono ? 'font-mono text-slate-400' : 'text-slate-700 font-semibold'}`}>
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Instructor Profile */}
   <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-all hover:shadow-md hover:border-slate-300">
  {/* Header Section */}
  <div className="flex items-center justify-between mb-6">
    <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em]">
      Course Instructor
    </h4>
    <span className="h-2 w-2 rounded-full bg-[#3f7d20] animate-pulse" />
  </div>

  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
    {/* Avatar with Glow Effect */}
    <div className="relative">
      <div className="h-16 w-16 flex items-center justify-center rounded-4xl bg-slate-100 text-slate-700 font-bold text-xl ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all">
        {course.instructor?.name?.charAt(0)}
      </div>
    </div>

    {/* Info Content */}
    <div className="flex-1 min-w-0">
      <h3 className="text-xl font-bold text-slate-900 truncate">
        {course.instructor?.name}
      </h3>
      <p className="text-[#3f7d20] text-sm font-semibold tracking-wide">
        {course.instructor?.role}
      </p>
      
      <div className="flex items-center gap-2 mt-2 text-slate-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-xs font-medium truncate">{course.instructor?.email}</span>
      </div>
    </div>
  </div>

  {/* Action Section */}
  <div className="mt-6 pt-5 border-t border-slate-100">
    <button
      onClick={() => navigate(`/instructors/${course.instructor?._id}`)}
      className="w-full py-2.5 bg-slate-900 text-white text-sm rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
    >
      View Full Profile
      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  </div>
</div>
            </div>

            {/* Subject Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                  <h4 className="text-slate-900 font-semibold text-sm tracking-tight">Subject Specifications</h4>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-slate-700 text-sm leading-relaxed pb-2 border-b border-slate-50">
                    {course.subject?.description || "Master the core concepts of this field."}
                  </p>
                  <div className="grid grid-cols-1 gap-y-2">
                    {[
                      { label: "Internal ID", value: course.subject?._id },
                      { label: "Status", value: course.subject?.status },
                      { label: "Author", value: course?.subject?.createdBy?.name || "N/A" },
                      { label: "Level", value: course.subject?.level },
                      { label: "Prerequisites", value: cleanPrerequisites.join(" / ") || "None" },
                      { label: "Category Type", value: course.subject?.categoryType },
                      { label: "Subject Code", value: course.subject?.code },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 uppercase">{item.label}</span>
                        <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Card: Instructor */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <h4 className="text-slate-900 font-semibold text-sm mb-6">Lead Instructor</h4>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 ring-1 ring-slate-200 p-1 rounded-full">
                    <div className="h-full w-full bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                      {course.instructor?.name?.charAt(0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-base leading-none">{course.instructor?.name}</p>
                    <p className="text-xs font-medium text-[#3f7d20] uppercase tracking-wider">{course.instructor?.role}</p>
                    <p className="text-sm text-slate-500 italic">{course.instructor?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Course Fee</p>
              <h2 className="text-5xl font-bold text-slate-900 mb-8">${course.price}</h2>
              
              <button onClick={() =>
    navigate("/notice", {
      state: { courseId: course._id },
    })
  } className="w-full bg-[#3f7d20] text-white py-5 rounded-2xl font-bold text-lg hover:bg-black cursor-pointer hover:shadow-lg hover:shadow-black transition-all duration-300">
                
                make a notice
              </button>
              
              <div className="mt-8 space-y-4">
                <Benefit text="Full lifetime access" />
                <Benefit text="Access on mobile and PC" />
                <Benefit text="100% Free access to evryone" />
                <Benefit text="Certificate of completion" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.main>
  );
};

// Sub-components for cleaner code
const Badge = ({ icon, text, color }) => (
  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>
    {icon} {text}
  </span>
);

const Stat = ({ icon, label, value }) => (
  <div>
    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
      {icon} {label}
    </p>
    <p className="font-semibold text-slate-800">{value}</p>
  </div>
);

const Benefit = ({ text }) => (
  <div className="flex items-center gap-3 text-slate-600 text-sm">
    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
    {text}
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#849e15] rounded-full animate-spin" />
    <p className="text-slate-400 font-medium animate-pulse">Setting Up Course...</p>
  </div>
);

export default CourseDetails;