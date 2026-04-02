import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  Briefcase,
  Target,
  Trophy
} from 'lucide-react';
 import Header from '../Component/CourseManagement/FrontPages/HeaderSection/Header';
 import Footer from '../Component/CourseManagement/FrontPages/LandingSection/Footer';

const Business = () => {
  const solutions = [
    {
      title: "Employee Onboarding",
      desc: "Accelerate time-to-productivity with automated, bespoke training paths.",
      icon: <Zap className="text-amber-500" size={24} />
    },
    {
      title: "Compliance Training",
      desc: "Ensure 100% regulatory adherence with audit-ready reporting and tracking.",
      icon: <ShieldCheck className="text-emerald-500" size={24} />
    },
    {
      title: "Leadership Development",
      desc: "Nurture the next generation of executives with advanced management courses.",
      icon: <Target className="text-blue-500" size={24} />
    }
  ];

  const clients = [
    { name: "Nexus Corp", industry: "Tech & Software", growth: "+40% Productivity" },
    { name: "Aether Bank", industry: "Finance", growth: "98% Compliance" },
    { name: "Global Logistics", industry: "Manufacturing", growth: "Reduced TTP by 30%" }
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans text-white selection:bg-white selection:text-black">
      <Header />

      {/* Corporate Hero */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">LMS for Enterprise</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
              The engine of <br />
              <span className="italic font-serif text-gray-400">high-growth teams.</span>
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-lg mb-10 leading-relaxed">
              Studly for Business centralizes your training, upskilling, and compliance into a single, high-performance ecosystem.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                Get a Demo <ArrowUpRight size={18} />
              </button>
              <button className="px-8 py-4 border border-white/10 rounded-full text-sm font-medium hover:bg-white/5 transition-all">
                Pricing Plans
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-3xl rounded-full"></div>
            <div className="relative bg-[#141414] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <BarChart3 size={18} className="text-gray-600" />
              </div>
              <div className="space-y-6">
                {[85, 45, 70].map((width, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/20 rounded-full" style={{ width: `${width}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                      <span>Module {i + 1}</span>
                      <span>{width}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Solutions */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-light mb-4">Strategic Solutions</h2>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">Designed to integrate seamlessly with your HR stack and drive measurable ROI from day one.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((sol, i) => (
            <div key={i} className="p-10 rounded-3xl bg-[#111111] border border-white/5 hover:border-white/20 transition-all group">
              <div className="mb-8 p-3 w-max rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                {sol.icon}
              </div>
              <h3 className="text-xl font-medium mb-4">{sol.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{sol.desc}</p>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-white transition-colors cursor-pointer">
                Learn More <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="px-6 py-20 bg-white text-black mx-6 rounded-[3rem] mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-light tracking-tight mb-2">Trusted by Industry Leaders</h2>
              <p className="text-gray-500">Driving transformation across diverse sectors.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {clients.map((client, i) => (
                <div key={i} className="border-l border-gray-100 pl-6">
                  <p className="text-2xl font-bold">{client.growth}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{client.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                <div className="aspect-square bg-[#111111] rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <Globe2 className="text-blue-400 mb-4" />
                    <p className="text-sm font-medium">Multi-Language<br/>Deployment</p>
                </div>
                <div className="aspect-square bg-[#111111] rounded-3xl mt-8 flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <Layers className="text-purple-400 mb-4" />
                    <p className="text-sm font-medium">SCORM & xAPI<br/>Compatible</p>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <h2 className="text-4xl font-light mb-8">Enterprise-grade <br/><span className="text-gray-500 italic">infrastructure.</span></h2>
                <ul className="space-y-4">
                    {['Single Sign-On (SSO)', 'White-label Branding', 'Advanced Analytics Dashboard', 'Dedicated Success Manager'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-400">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            <span className="font-light">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-600">
          Studly Corporate © 2026 — Built for the future of work
        </p>
      </footer>
      <Footer />
    </div>
  );
};

export default Business;