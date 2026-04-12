import React, { useState, useRef, useEffect } from 'react';
import { Globe, ExternalLink, ChevronDown, Check } from 'lucide-react';

function BeforHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English' });
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'si', name: 'සිංහල' }, // Added for local context
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[60] w-full bg-gray-950 text-[12px] font-medium text-gray-300">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <a href="/business" className="flex items-center gap-1.5 hover:text-white transition-colors border-r border-gray-800 pr-6">
            Studly for Business
            <ExternalLink size={12} className="opacity-50" />
          </a>
          <a href="/campus" className="hover:text-white transition-colors">For Universities</a>
        </div>

        {/* Right Side: Language & Support */}
        <div className="flex items-center gap-6">
          
          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1.5 transition-colors ${isOpen ? 'text-white' : 'hover:text-white'}`}
            >
              <Globe size={13} strokeWidth={2.5} />
              <span>{selectedLang.name}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-800 bg-gray-900 p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsOpen(false);
                      // In a real app, you'd call i18n.changeLanguage(lang.code) here
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-gray-800 transition-colors"
                  >
                    <span className={selectedLang.code === lang.code ? 'text-blue-400' : 'text-gray-300'}>
                      {lang.name}
                    </span>
                    {selectedLang.code === lang.code && <Check size={12} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="hidden h-3 w-[1px] bg-gray-800 sm:block"></div>
          <a href="/help" className="hover:text-white transition-colors">Help Center</a>
          <div className="hidden h-3 w-[1px] bg-gray-800 sm:block"></div>
          <a href="/teaching" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
            Become an Instructor
          </a>
        </div>
      </div>
    </div>
  );
}

export default BeforHeader;