import React, { useState, useEffect } from "react";
 import { Routes, Route } from "react-router-dom";
 import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FiHome, FiRepeat, FiCheckCircle, FiFileText, FiLink, FiLayers, 
  FiUsers, FiSettings, FiPlus, FiMessageSquare, FiX, FiPaperclip, FiSend, FiDownload, FiEdit2, FiTrash2
} from "react-icons/fi";

const API_BASE = "http://localhost:5001/api/tickets";

function RazorpayStyleDashboard() {
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("open");
  
  // State for Modals
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "medium",
    files: []
  });

  // State for Replies
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTickets();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      const filtered = res.data.tickets.filter(t => 
        t.instructor._id === user._id && 
        (activeTab === "open" ? t.status !== "resolved" : t.status === "resolved")
      );
      setTickets(filtered);
      if (filtered.length > 0 && !selectedTicket) setSelectedTicket(filtered[0]);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("instructor", user._id);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("priority", formData.priority);
    Array.from(formData.files).forEach(file => data.append("attachments", file));

    try {
      await axios.post(API_BASE, data);
      setShowModal(false);
      setFormData({ title: "", description: "", category: "technical", priority: "medium", files: [] });
      fetchTickets();
    } catch (err) {
      alert("Error creating ticket");
    }
  };

  // --- NEW: Handle Edit ---
  const handleEditClick = () => {
    setFormData({
      title: selectedTicket.title,
      description: selectedTicket.description,
      category: selectedTicket.category,
      priority: selectedTicket.priority,
      files: []
    });
    setShowEditModal(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("priority", formData.priority);
    if (formData.files.length > 0) {
      Array.from(formData.files).forEach(file => data.append("attachments", file));
    }

    try {
      await axios.put(`${API_BASE}/${selectedTicket._id}`, data);
      setShowEditModal(false);
      fetchTickets();
      // Update local selected ticket view
      setSelectedTicket(prev => ({...prev, ...formData}));
    } catch (err) {
      alert("Error updating ticket");
    }
  };

  // --- NEW: Handle Delete ---
  const handleDeleteTicket = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`${API_BASE}/${selectedTicket._id}`);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      alert("Error deleting ticket");
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`${API_BASE}/${selectedTicket._id}/messages`, {
        sender: user._id,
        senderRole: user.role || "instructor",
        message: replyText
      });
      setReplyText("");
      setIsReplying(false);
      fetchTickets();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-[#F9FAFC] font-sans text-slate-700">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0B1E3C] text-slate-400 flex flex-col shrink-0">
        <div className="p-6 text-white font-bold text-xl flex items-center gap-2">
          Studly Support
        </div>
        <nav className="flex-1 px-4 space-y-1">
         <Link to="/instructor"> <NavItem icon={<FiHome />} label="Home" />  </Link> 
          <NavItem icon={<FiRepeat />} label="Transactions" />
          <NavItem icon={<FiCheckCircle />} label="Settlements" />
          <NavItem icon={<FiFileText />} label="Invoices" />
          <NavItem icon={<FiUsers />} label="My Account" active />
          <NavItem icon={<FiSettings />} label="Settings" />
        </nav>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
  {/* Left Section: Navigation */}
  <div className="flex gap-8 text-sm font-medium h-full items-center">
    <div className="flex items-center gap-2 mr-2">
      
      <span className="font-bold text-gray-900 hidden md:block">Welcome</span>
    </div>
    <span className="cursor-pointer text-gray-500 hover:text-gray-900 transition-colors">Profile</span>
    <span className="cursor-pointer border-b-2 border-blue-600 text-blue-600 h-full flex items-center px-1">
      Support requests
    </span>
  </div>

{/* Center Section: Premium Search Bar */}
<div className="hidden md:flex flex-1 max-w-md mx-8">
  <div className="relative w-full group">
    {/* Search Icon */}
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
      <svg 
        className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <input
      type="text"
      className="block w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg 
                 leading-5 bg-gray-50/50 placeholder-gray-400 
                 transition-all duration-200 ease-in-out
                 hover:bg-white hover:border-gray-300
                 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 
                 sm:text-sm"
      placeholder="Search anything..."
    />

    {/* Shortcut Key Badge */}
    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 
                     border border-gray-200 rounded-md bg-white 
                     text-gray-400 text-[10px] font-medium shadow-sm">
        <span className="text-xs">Search</span>
        
      </kbd>
    </div>
  </div>
</div>

  {/* Right Section: Actions & Profile */}
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
       
      <button className="text-gray-400 hover:text-gray-600 relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>
    </div>
    
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="text-right hidden sm:block">
        <p className="text-xs font-semibold text-gray-900 leading-tight">{userData?.name}</p>
        <p className="text-[10px] text-gray-500 leading-tight">{userData?.email}</p>
      </div>
       <img
      src={userData?.profilePicture}
      alt="Profile"
      className="w-9 h-11 rounded-full mx-auto mt-2 mb-2 object-cover"
    />
    </div>
  </div>
</header>

        <div className="flex-1 p-6 overflow-hidden bg-[#F5F7F9]">
          <div className="max-w-6xl h-full mx-auto flex bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            
            {/* --- LIST PANE --- */}
            <div className="w-[350px] border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Support requests</h2>
                <button onClick={() => setShowModal(true)} className="text-blue-600 text-sm flex items-center gap-1 font-semibold hover:underline">
                  <FiPlus /> Raise new request
                </button>
              </div>
              
              <div className="flex p-1 bg-gray-100 m-4 rounded">
                <button onClick={() => setActiveTab("open")} className={`flex-1 py-1.5 text-xs rounded ${activeTab === 'open' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}>Open</button>
                <button onClick={() => setActiveTab("closed")} className={`flex-1 py-1.5 text-xs rounded ${activeTab === 'closed' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}>Closed</button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {tickets.map((t) => (
                  <div key={t._id} onClick={() => setSelectedTicket(t)} className={`p-4 border-b border-gray-50 cursor-pointer transition-all flex gap-3 ${selectedTicket?._id === t._id ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50 border-l-4 border-l-transparent"}`}>
                    <div className="shrink-0">
   <img
  src={
    t?.instructor?.profilePicture
      ? t.instructor.profilePicture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(t?.instructor?.name || 'User')}&background=random&rounded=true`
  }
  alt={t?.instructor?.name || "User"}
  className="w-10 h-10 rounded-full border border-gray-100 shadow-sm object-cover"
/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-800 truncate pr-2">{t.title}</span>
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1   shrink-0">{t.status === "open" ? "Seen" : t.status}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mb-1 tracking-tight truncate">#{t._id.slice(-10)}</div>
                      <p className="text-xs text-gray-500 line-clamp-1">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- VIEW PANE --- */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
              
              {selectedTicket ? (
                <>
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{selectedTicket.category} related » <span className="text-gray-500 font-medium">{selectedTicket.title}</span></h3>
                      <div className="text-[11px] text-gray-400 mt-1">{formatDate(selectedTicket.createdAt)} • #{selectedTicket._id}</div>
                    </div>
                    
                    {/* Action Buttons: Only show for Ticket Creator */}
                    {selectedTicket.instructor._id === user._id && (
                      <div className="flex gap-2">
                        <button onClick={handleEditClick} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={handleDeleteTicket} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <MessageRow 
  name={selectedTicket.instructor?.name || "Instructor"} 
  text={selectedTicket.description} 
  time={formatDate(selectedTicket.createdAt)}
  isSupport={false}
  attachments={selectedTicket.attachments}
  profilePic={selectedTicket.instructor?.profilePicture}
/>

                    {selectedTicket.messages.map((m, idx) => (
                      <MessageRow 
                        key={idx}
                        name={m.senderRole === 'admin' ? "Studly support" : (user.name || "Instructor")}
                        text={m.message}
                        time={formatDate(m.createdAt)}
                        isSupport={m.senderRole === 'admin'}
                        attachments={m.attachments}
                      />
                    ))}

                    <div className="text-center pt-4">
                      <p className="text-[11px] text-gray-400 bg-gray-50 inline-block px-4 py-2 rounded-full border border-gray-100">
                        This request is open and our team is working on it.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    {isReplying ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <textarea className="w-full text-sm outline-none resize-none" rows="3" placeholder="Type your message here..." value={replyText} onChange={(e) => setReplyText(e.target.value)}></textarea>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                          <button className="text-gray-400 hover:text-blue-600"><FiPaperclip /></button>
                          <div className="flex gap-2">
                            <button onClick={() => setIsReplying(false)} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleSendReply} className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded flex items-center gap-2"><FiSend /> Send Reply</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button onClick={() => setIsReplying(true)} className="px-8 py-2 border border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:bg-white shadow-sm flex items-center gap-2 transition-all">
                          <FiRepeat className="text-gray-400" /> Send a reply
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                  <FiMessageSquare size={64} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- CREATE/EDIT MODAL --- */}
      {(showModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {showEditModal ? "Edit Support Request" : "Raise New Support Request"}
                 
              </h3>
              <button onClick={() => {setShowModal(false); setShowEditModal(false);}} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={showEditModal ? handleUpdateTicket : handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                <input required type="text" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Short summary of issue" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="technical">Technical</option>
                    <option value="payment">Payment</option>
                    <option value="content">Content</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detailed Description</label>
                <textarea required rows="4" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Describe your problem..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  {showEditModal ? "Add New Attachments" : "Attachments"}
                </label>
                <input type="file" multiple className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setFormData({...formData, files: e.target.files})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                {showEditModal ? "Update Request" : "Submit Request"}
              </button>
            </form>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl shadow-sm">

  <label className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
    Thank You! {userData?.name}
  </label>

  <label className="text-sm font-medium text-blue-500 mb-3">
    Email: {userData?.email}
  </label>

  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
    By submitting this request, you agree to our terms and conditions. 
    Our support team will review your complaint and respond within 24–48 hours. 
    Please ensure that all provided information is accurate to help us resolve your issue efficiently.
  </p>

</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- HELPERS --- */
function NavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${active ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5'}`}>
      <span className="text-lg opacity-70">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MessageRow({ name, text, time,profilePic, isSupport, attachments = [] }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden border border-gray-200">
  {profilePic ? (
    <img
      src={profilePic}
      alt={name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${
      isSupport ? 'bg-[#0B1E3C] text-white' : 'bg-gray-200 text-gray-600'
    }`}>
      {isSupport ? 'S' : name?.charAt(0)}
    </div>
  )}
</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-gray-800">{name}</span>
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{text}</p>
        
        {attachments && attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {attachments.map((file, i) => {
              const isImg = file.fileType?.startsWith("image/");
              return (
                <div key={i} className="group/file relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all min-w-[200px] max-w-[280px]">
                  <div className="shrink-0 w-10 h-10 rounded bg-white flex items-center justify-center border border-gray-100 overflow-hidden text-blue-500">
                    {isImg ? (
                      <img src={file.url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiFileText size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-gray-700 truncate">{file.fileName}</div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">
                      {file.fileType?.split('/')[1] || 'FILE'} • {(file.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <a href={file.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 p-1">
                    <FiDownload size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RazorpayStyleDashboard;