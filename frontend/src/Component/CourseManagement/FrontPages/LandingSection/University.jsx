import React from 'react';
import { Landmark, Users, Globe, ShieldCheck, ArrowRight, School, GraduationCap, Award } from 'lucide-react';
 import Header from '../HeaderSection/Header';

const University = () => {
  const universities = [
    {
      name: "Stanford Graduate School",
      location: "California, USA",
      students: "12,000+",
      specialty: "Innovation & Research",
      image: "https://images.unsplash.com/photo-1541339907198-e08756defeec?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "University of Oxford",
      location: "Oxford, UK",
      students: "24,000+",
      specialty: "Classic Humanities",
      image: "https://images.unsplash.com/photo-1590496793907-4e92a8330d04?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "ETH Zürich",
      location: "Zürich, Switzerland",
      students: "22,000+",
      specialty: "Science & Engineering",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "University of Tokyo",
      location: "Tokyo, Japan",
      students: "28,000+",
      specialty: "Advanced Technology",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    }
  ];

  const stats = [
    { icon: <Users size={20} />, label: "Global Students", value: "2.4M" },
    { icon: <Landmark size={20} />, label: "Partner Institutions", value: "150+" },
    { icon: <ShieldCheck size={20} />, label: "Privacy Certified", value: "ISO 27001" },
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans text-[#121212] selection:bg-black selection:text-white">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#F9F9F9]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#121212] clip-path-diagonal hidden lg:block opacity-[0.02]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-6 block">Institutional Excellence</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 leading-[1.1]">
            Empowering the world's <br />
            <span className="italic font-serif">elite institutions.</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 font-light text-lg mb-10 leading-relaxed">
            Studly Enterprise provides a bespoke learning ecosystem designed for scalability, 
            academic integrity, and global prestige.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all">
              Request Partnership
            </button>
            <button className="px-10 py-4 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-all">
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Stat Bar */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-2xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 flex items-center gap-6">
              <div className="text-gray-400">{stat.icon}</div>
              <div>
                <p className="text-2xl font-medium">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-light tracking-tight mb-4 text-gray-900">Our Partner Network</h2>
            <p className="text-gray-500 font-light">Supporting digital transformation for leading universities across six continents.</p>
          </div>
          <button className="group flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:gap-4 transition-all">
            View all 150+ partners <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((uni, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={uni.image} 
                  alt={uni.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-1 truncate">{uni.name}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                  <Globe size={12} /> {uni.location}
                </p>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[11px] font-bold uppercase tracking-tighter text-gray-400">
                  <span>{uni.students} Students</span>
                  <span className="text-black">{uni.specialty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlighting Banner */}
      <section className="bg-[#121212] text-white py-24 mx-6 rounded-[3rem] overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-10 grid md:grid-cols-2 items-center gap-20">
          <div>
            <h2 className="text-4xl font-light leading-tight mb-8">
              Seamlessly integrate with <br />
              <span className="text-gray-500 italic">your existing workflow.</span>
            </h2>
            <ul className="space-y-6">
              {[
                { icon: <School size={20} />, title: "Campus Integration", desc: "Sync with your SIS and ERP systems effortlessly." },
                { icon: <GraduationCap size={20} />, title: "Faculty Autonomy", desc: "Custom tools for instructors to build bespoke curricula." },
                { icon: <Award size={20} />, title: "Verified Credentials", desc: "Blockchain-backed certification for all graduates." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 text-gray-500">{item.icon}</div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-square bg-gradient-to-tr from-[#1A1A1A] to-[#252525] rounded-full flex items-center justify-center border border-white/5">
             <div className="text-center">
                <div className="text-7xl font-thin tracking-tighter mb-2 italic">99.9%</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Uptime Reliability</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4">Studly Enterprise Division</p>
        <div className="flex justify-center gap-8 text-xs text-gray-500 font-light">
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
          <a href="#" className="hover:text-black transition-colors">Compliance</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default University;