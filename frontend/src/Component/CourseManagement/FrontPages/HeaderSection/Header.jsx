import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, BookOpen, Code, BarChart, User } from 'lucide-react';

function Header() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/"; // This forces a full page reload to "/"
};

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-3xl font-bold tracking-wide text-[#ff4628]">
            Studly
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/allCourses" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Courses
            </Link>

            {/* Explore Dropdown Section */}
            <div className="group relative py-4">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 tracking-wide group-hover:text-blue-600 transition-colors">
                Explore
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Mega Menu */}
              <div className="absolute left-0 top-full z-50 hidden w-[720px] rounded-2xl border border-gray-100 bg-white p-6 shadow-xl 
                group-hover:block opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 
                transition-all duration-300 ease-out">

                <div className="grid grid-cols-3 gap-8">
                  {/* Column 1 */}
                  <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Popular Categories
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Data Science', icon: <BarChart size={16} />, path: '/datScience' },
                        { name: 'Business', icon: <BookOpen size={16} />, path: '/businessSection' },
                        { name: 'Computer Science', icon: <Code size={16} />, path: '/category/cs' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 
                          hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            {item.icon}
                          </span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Trending Subjects
                    </h3>
                    <div className="space-y-3">
                      {['Python for Beginners', 'AI & Machine Learning', 'UX/UI Design Principles'].map((subject, idx) => (
                        <Link
                          key={idx}
                          to={`/search?q=${subject.toLowerCase().replace(/ /g, '+')}`}
                          className="group/item flex flex-col rounded-lg px-2 py-1 transition"
                        >
                          <span className="text-sm font-medium text-gray-800 group-hover/item:text-blue-600">
                            {subject}
                          </span>
                          <span className="text-[11px] tracking-wide text-gray-400">
                            Professional Certificate
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 3 ( Highlight Card) */}
                  <div className="rounded-xl bg-[#ff4628] p-4 text-white shadow-md">
                    <h4 className="text-sm font-semibold tracking-wide">
                      Start Learning Today 
                    </h4>
                    <p className="mt-2 text-xs text-blue-100">
                      Explore 1000+ courses from top instructors and boost your career.
                    </p>
                    <Link
                      to="/courses"
                      className="mt-4 inline-block rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-gray-100 transition"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="hidden max-w-md flex-1 px-8 lg:block">
          <form onSubmit={(e) => e.preventDefault()} className="relative group flex items-center">
            <input
              type="text"
              placeholder="Search for any course..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-5 pr-12 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4628] text-white shadow-sm hover:bg-blue-700 active:scale-90 transition-all">
              <Search size={16} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        {/* Right Section: Conditional Auth/Profile */}
        <div className="flex items-center gap-4 relative">
          {userData ? (
            <div
              className="flex items-center gap-3 pl-4 border-l border-gray-100 group cursor-pointer"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{userData.name || 'User'}</p>
                <p className="text-[11px] text-gray-500">Student Account</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-white shadow-sm group-hover:border-[#ff4628] transition-all flex items-center justify-center overflow-hidden">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                  <Link
                    to={`/userprofile/${userData._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#ff4628] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
              >
                Join for Free
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}

export default Header;