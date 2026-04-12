import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Search,
  Bookmark,
  Star,
  Briefcase,
  Globe
} from 'lucide-react';
import Header from '../Component/CourseManagement/FrontPages/HeaderSection/Header';
import Footer from '../Component/CourseManagement/FrontPages/LandingSection/Footer';

const BusinessFaculty = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Ensure this endpoint returns business-related courses or filter them locally
        const response = await axios.get('http://localhost:5001/api/courses');
        let extractedArray = response.data.courses || response.data.data || (Array.isArray(response.data) ? response.data : []);
        
        // Optional: Filter for business faculty if your API supports it
        // const businessCourses = extractedArray.filter(c => c.category === 'Business');
        // setCourses(businessCourses);
        
        setCourses(extractedArray);
      } catch (err) {
        console.error("API Error fetching business courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#1a1a1a]">
      <Header />

      {/* --- ELITE CORPORATE BANNER --- */}
      <section className="relative h-[85vh] flex items-center pt-20 overflow-hidden bg-[#064e3b]">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-4xl">
            {/* Faculty Tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[2px] w-12 bg-emerald-400"></span>
              <span className="text-emerald-400 text-xs font-black tracking-[0.4em] uppercase">
                Faculty of Business & Leadership
              </span>
            </div>
            
            {/* Heading: High-Contrast Business Aesthetic */}
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              Define the <br />
              <span className="bg-white text-[#064e3b] px-4 py-2 inline-block transform -skew-x-6 mr-2">Future</span>
              <span className="text-emerald-100 font-serif italic font-light">of Commerce.</span>
            </h1>
            
            {/* Subtext */}
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl border-l border-emerald-500/40 pl-8">
              From Strategic Management to Global Finance. Master the skills required to 
              lead in a volatile, uncertain, complex, and ambiguous world.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="bg-white text-[#064e3b] px-10 py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-400 hover:text-white transition-all duration-300 shadow-2xl">
                Explore Programs <ArrowRight size={20} />
              </button>
              
              <div className="flex items-center gap-4 px-8 py-5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 group">
                <Search size={18} className="text-emerald-300" />
                <span className="text-sm font-bold uppercase tracking-widest">Find a Major</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Element - Moving Trends */}
        <div className="absolute right-0 bottom-0 opacity-10 hidden lg:block translate-y-20 translate-x-10">
           <TrendingUp size={600} className="text-white" strokeWidth={0.5} />
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      </section>

      {/* --- COURSE GRID SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="text-[#059669] font-black text-[10px] uppercase tracking-[0.2em] mb-4">Executive Education</p>
            <h2 className="text-5xl font-bold tracking-tight">Available Courses</h2>
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
                    src={course.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {course.level || 'Professional'}
                    </span>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#059669] transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full py-4 bg-white text-[#064e3b] rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="px-2">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><Clock size={12}/> {course.duration}h</span>
                    <span className="flex items-center gap-1.5 text-emerald-600"><Briefcase size={12}/> {course.category || 'Business'}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-[#059669] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-500 font-light mt-2 line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-black">
                      {course.price === "free" ? <span className="text-emerald-600">Free</span> : `$${course.price}`}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star size={14} className="text-yellow-500 fill-yellow-500"/>
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- BUSINESS FACULTY METRICS --- */}
      <section className="bg-[#f8fafc] py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Global Alumni", value: "45,000+" },
              { label: "Average Salary Increase", value: "35%" },
              { label: "Fortune 500 Partners", value: "120+" },
              { label: "Business Ventures", value: "500+" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-black mb-1 text-[#064e3b]">{stat.value}</p>
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

export default BusinessFaculty;