import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowRight, 
  Clock, 
  BarChart3, 
  Search,
  Plus,
  Bookmark,
  Star
} from 'lucide-react';
import Header from '../Component/CourseManagement/FrontPages/HeaderSection/Header';
import Footer from '../Component/CourseManagement/FrontPages/LandingSection/Footer';

const DataScience = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/courses');
        let extractedArray = response.data.courses || response.data.data || (Array.isArray(response.data) ? response.data : []);
        setCourses(extractedArray);
      } catch (err) {
        console.error("API Error");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#1a1a1a]">
      <Header />

    {/* --- DEEP BLUE CINEMATIC BANNER --- */}
<section className="relative h-[85vh] flex items-center pt-20 overflow-hidden bg-[#002244]">
  {/* Sophisticated Glow Elements */}
   

  <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
    <div className="max-w-4xl">
      {/* Faculty Tag */}
      <div className="flex items-center gap-3 mb-8">
        <span className="h-[2px] w-12 bg-white"></span>
        <span className="text-white text-xs font-black tracking-[0.4em] uppercase opacity-90">
          Faculty of Data Science
        </span>
      </div>
      
      {/* Heading: White with Black/Serif Contrast */}
      <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8">
        Master the <br />
        <span className="bg-black text-white px-4 py-2 inline-block transform -skew-x-6 mr-2">Architecture</span>
        <span className="text-blue-200 font-serif italic font-light">of Data.</span>
      </h1>
      
      {/* Subtext: White with light opacity */}
      <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl border-l border-white/20 pl-8">
        Advanced specialization in Machine Learning, Deep Learning, and Predictive Analytics. 
        Engineered for the next generation of technical leaders.
      </p>

      {/* Action Buttons: Black & Glass Contrast */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Primary Black Button */}
        <button className="bg-black text-white px-10 py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 shadow-2xl">
          View Curriculum <ArrowRight size={20} />
        </button>
        
        {/* Secondary Glass/White Button */}
        <div className="flex items-center gap-4 px-8 py-5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white hover:text-[#002244] transition-all duration-300 group">
          <Search size={18} className="text-white group-hover:text-[#002244]" />
          <span className="text-sm font-bold uppercase tracking-widest">Search Modules</span>
        </div>
      </div>
    </div>
  </div>

  {/* Technical Grid Overlay - Adjusted for Blue bg */}
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
  
  {/* Right Side Decorative Element (Optional: Data viz silhouette) */}
  <div className="absolute right-0 bottom-0 opacity-10 hidden lg:block translate-y-20 translate-x-10">
     <BarChart3 size={600} className="text-white" strokeWidth={0.5} />
  </div>
</section>

      {/* --- COURSE GRID SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="text-[#FF5722] font-black text-[10px] uppercase tracking-[0.2em] mb-4">The Collection</p>
            <h2 className="text-5xl font-bold tracking-tight">Professional Certification</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <ArrowRight className="rotate-180" size={20} />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] animate-pulse" />
                <div className="h-6 bg-gray-100 w-3/4 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {courses.map((course) => (
              <div key={course._id} className="group cursor-pointer">
                {/* Course Card Cover */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-100 mb-8 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  <img
                    src={course.coverImage || "https://images.unsplash.com/photo-1518186239124-4277ec3839c9?auto=format&fit=crop&q=80&w=800"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {course.level}
                    </span>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#FF5722] transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full py-4 bg-[#FF5722] text-white rounded-2xl font-bold text-sm">
                      Enroll Course
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="px-2">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><Clock size={12}/> {course.duration}h</span>
                    <span className="flex items-center gap-1.5"><Star size={12} className="text-yellow-500 fill-yellow-500"/> 4.9</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-[#FF5722] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-500 font-light mt-2 line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-black">
                      {course.price === "free" ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `$${course.price}`
                      )}
                    </span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-black text-[8px] text-white flex items-center justify-center font-bold">
                        +2k
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- FACULTY METRICS --- */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Learners", value: "12,000+" },
              { label: "Module Completion", value: "94%" },
              { label: "Industry Partners", value: "85+" },
              { label: "Expert Mentors", value: "300+" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-black mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DataScience;