import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Component/CourseManagement/FrontPages/HeaderSection/Header";
import Footer from '../Component/CourseManagement/FrontPages/LandingSection/Footer'

/* ── Tiny icon components ── */
const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 20 20" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5"
    className="inline w-5 h-5">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const LevelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/>
  </svg>
);

/* ── Star Rating ── */
function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg text-amber-500">{Number(rating).toFixed(1)}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <StarIcon key={n} filled={n <= Math.round(rating)} />
        ))}
      </div>
      <span className="text-sm text-gray-500">({count?.toLocaleString()} ratings)</span>
    </div>
  );
}

/* ── Skeleton loader ── */
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1c1d1f] py-14 px-8">
        <div className="max-w-5xl mx-auto space-y-5">
          <Skeleton className="h-5 w-60 bg-gray-700" />
          <Skeleton className="h-10 w-3/4 bg-gray-700" />
          <Skeleton className="h-5 w-1/2 bg-gray-700" />
          <Skeleton className="h-5 w-48 bg-gray-700" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-7">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-[26rem] rounded-xl" />
      </div>
    </div>
  );
}

function EnrollCard({ course }) {
  const isFree = course.price === "free" || course.price === 0;
  const seatsLeft = course.enrollmentLimit - course.enrolledStudentsCount;
  const fillPct = Math.min((course.enrolledStudentsCount / course.enrollmentLimit) * 100, 100);

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden sticky top-24 transition-all duration-300 hover:shadow-2xl w-full">
      {course.coverImage && (
        <div className="p-4">
          <div className="relative group rounded-[1.5rem] overflow-hidden aspect-video">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
               <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
                  <svg viewBox="0 0 24 24" fill="#1c1d1f" className="w-7 h-7 translate-x-0.5"><path d="M5 3l14 9-14 9V3z" /></svg>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-8 pb-8 pt-2 space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-slate-900">
            {isFree ? "Free" : `$${Number(course.price).toFixed(2)}`}
          </span>
          {!isFree && course.originalPrice && (
            <span className="text-xl text-slate-400 line-through">${course.originalPrice}</span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
            <span className="text-slate-500 flex items-center gap-2">
              <UsersIcon /> {course.enrolledStudentsCount?.toLocaleString()} Enrolled
            </span>
            <span className={seatsLeft < 20 ? "text-red-500" : "text-slate-600"}>
              {seatsLeft > 0 ? `${seatsLeft} Seats Left` : "Full"}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        <button className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all duration-300 shadow-lg active:scale-[0.98]">
          {isFree ? "Enroll for Free" : "Enroll Now"}
        </button>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 gap-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Includes</p>
          <ul className="space-y-3">
            {[
              `${course.duration} hours on-demand video`,
              "Certificate of completion",
              "Full lifetime access",
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <CheckIcon /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Related course card ── */
function RelatedCard({ course }) {
  const isFree = course.price === "free" || course.price === 0;
  return (
    <Link to={`/courses/${course._id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative overflow-hidden">
        <img src={course.coverImage} alt={course.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-sm font-bold text-gray-800 px-3 py-1 rounded-full shadow-sm">
          {isFree ? "Free" : `$${course.price}`}
        </span>
      </div>
      <div className="p-5 space-y-2">
        <h4 className="text-sm lg:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {course.title}
        </h4>
        <p className="text-sm text-gray-500">{course.instructor?.name || "Instructor"}</p>
        <div className="flex items-center gap-2 pt-1 text-sm">
          <StarIcon filled />
          <span className="text-sm font-bold text-amber-600">{Number(course.averageRating || 0).toFixed(1)}</span>
          <span className="text-sm text-gray-400 ml-1">({course.totalRatings || 0})</span>
          <span className="ml-auto text-sm text-gray-500 flex items-center gap-1">
            <ClockIcon />{course.duration}h
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Main Component ── */
export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/courses/${id}`);
        if (res.data.success) setCourse(res.data.data);
        else setError(res.data.message || "Course not found");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/courses`);
        if (res.data.success)
          setRelatedCourses(res.data.data.filter(c => c._id !== id).slice(0, 5));
      } catch {/* silent */ }
    };

    window.scrollTo(0, 0);
    fetchCourse();
    fetchRelated();
  }, [id]);

  if (loading) return <><Header /><LoadingSkeleton /></>;

  if (error) return (
    <>
      <Header />
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center p-6">
        <div className="text-6xl">🔍</div>
        <h2 className="text-3xl font-bold text-gray-800">Course Not Found</h2>
        <p className="text-gray-500 max-w-md">{error}</p>
        <Link to="/courses" className="mt-3 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Browse Courses
        </Link>
      </div>
    </>
  );

  if (!course) return null;

  const isFree = course.price === "free" || course.price === 0;

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <span>/</span>
              <span className="text-gray-300">{course.subject?.name || "General"}</span>
              <span>/</span>
              <span className="text-white truncate max-w-[250px]">{course.title}</span>
            </nav>

            <h1 className="text-3xl lg:text-4xl font-extrabold leading-snug">{course.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">{course.description}</p>

            <div className="flex flex-wrap items-center gap-5 text-base">
              <StarRating rating={course.averageRating || 0} count={course.totalRatings || 0} />
              <span className="flex items-center gap-2 text-gray-300">
                <UsersIcon />{course.enrolledStudentsCount?.toLocaleString() || 0} students
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <ClockIcon />, label: `${course.duration}h total` },
                { icon: <LevelIcon />, label: course.level || "All Levels" },
              ].map(({ icon, label }) => (
                <span key={label}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gray-200 text-sm font-medium">
                  {icon}{label}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-400">
              Created by{" "}
              <span className="text-blue-400 font-semibold hover:underline cursor-pointer">
                {course.instructor?.name || "N/A"}
              </span>
            </p>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ── Main Layout 50/50 ── */}
      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Course Details */}
        <div className="space-y-10">
          {course.whatYouWillLearn?.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-7">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-5">What you'll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                    <CheckIcon />{item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-white rounded-xl border border-gray-200 p-7 space-y-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Course Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
              {[
                ["Instructor", course.instructor?.name || "N/A"],
                ["Level", course.level || "All Levels"],
                ["Duration", `${course.duration} hours`],
                ["Subject", course.subject?.name || "General"],
                ["Price", isFree ? "Free" : `$${course.price}`],
                ["Enrollment Limit", course.enrollmentLimit],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-400 text-sm uppercase tracking-wide font-medium mb-1">{k}</p>
                  <p className="text-gray-900 font-semibold">{v}</p>
                </div>
              ))}
            </div>

            {course.prerequisites?.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium mb-2">Prerequisites</p>
                <ul className="space-y-1">
                  {course.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {course.tags?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {course.tags.map(tag => (
                  <span key={tag}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 cursor-pointer transition">
                    <TagIcon />{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Enroll Card */}
        <div className="flex flex-col gap-7">
          <EnrollCard course={course} />
        </div>
      </div>

      {/* ── Related Courses ── */}
      {relatedCourses.length > 0 && (
        <section className="bg-[#f8fafc] border-t border-slate-100 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Recommendations</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Students also viewed
                </h2>
              </div>
              <Link 
                to="/courses" 
                className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                View all courses
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedCourses.map(rc => (
                <div key={rc._id} className="hover:-translate-y-1 transition-transform duration-300">
                  <RelatedCard course={rc} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}