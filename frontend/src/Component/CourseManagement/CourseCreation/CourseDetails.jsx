import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, BookOpen, User, ShieldCheck, Tag } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
                <Badge icon={<Tag size={14} />} text={course.subject?.name} color="bg-blue-50 text-blue-600" />
                <Badge icon={<ShieldCheck size={14} />} text={`ID: ${course.courseId}`} color="bg-slate-100 text-slate-600" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
                {course.title}
              </h1>

              <div className="flex flex-wrap gap-8 py-6 border-y border-slate-50">
                <Stat icon={<Clock size={20} />} label="Duration" value={course.duration} />
                <Stat icon={<BookOpen size={20} />} label="Subject" value={course.subject?.name} />
                <Stat icon={<User size={20} />} label="Instructor" value={course.instructor?.name} />
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
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Subject Deep-Dive</h4>
                <p className="text-slate-800 font-medium mb-2">{course.subject?.description || "Master the core concepts of this field."}</p>
                <p className="text-sm text-slate-400 font-mono">Internal Ref: {course._id}</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Instructor</h4>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
                    {course.instructor?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{course.instructor?.name}</p>
                    <p className="text-sm text-slate-500">{course.instructor?.role}</p>
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
              
              <button className="w-full bg-[#ff5b04] text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300">
                make a notice
              </button>
              
              <div className="mt-8 space-y-4">
                <Benefit text="Full lifetime access" />
                <Benefit text="Access on mobile and TV" />
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