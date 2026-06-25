import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import withAuth from '../utils/WithAuth';
import { useHistory } from '../context/HistoryContext';


const Dashboard = () => {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {addToHistory, getHistory, history} = useHistory();
  const [meetingCode, setMeetingCode] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };

  const handleJoinCall = async (e) => {
    e.preventDefault();
    await addToHistory(meetingCode);
    if (meetingCode.trim()) {
      // 🌟 FIX: Add .trim() here so accidental copy-paste spaces are deleted!
      navigate(`/${meetingCode.trim()}`);
    }
  };

  // Generates a random 10-character string for instant meetings
  const handleStartNewMeeting = async () => {
    const randomCode = Math.random().toString(36).substring(2, 12);
    await addToHistory(randomCode);
    navigate(`/${randomCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          {/* Zoom-style Camera Logo */}
          <div className="bg-[#0b5cff] p-2 rounded-xl shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-slate-800">ZOOM</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-slate-500 font-medium">Logged in</span>
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-600 hover:text-white bg-slate-100 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors border border-slate-200 hover:border-red-500"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8 mt-4 md:mt-12">
        
        {/* Left Column: Actions */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          
          {/* Big "New Meeting" Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-200/50">
            <button 
              onClick={handleStartNewMeeting}
              className="bg-[#ff742e] hover:bg-[#ff8547] text-white p-6 rounded-3xl mb-6 shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">New Meeting</h2>
            <p className="text-slate-500 text-sm">Start an instant meeting</p>
          </div>
          {/* Join Meeting Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Join a Meeting</h3>
            <form onSubmit={handleJoinCall} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter meeting link or code"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-[15px] transition-all placeholder-slate-400"
              />
              <button 
                type="submit"
                disabled={!meetingCode.trim()}
                className={`w-full font-bold py-4 rounded-xl text-[15px] transition-all duration-200 shadow-md ${
                  meetingCode.trim()
                    ? 'bg-[#0b5cff] text-white hover:bg-blue-600 cursor-pointer shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Time and Date Banner (Classic Zoom aesthetic) */}
        <div className="w-full md:w-1/2">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 h-full flex flex-col justify-between shadow-lg shadow-slate-200/50 relative overflow-hidden">
            {/* Background glowing orb effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div>
              <h1 className="text-6xl md:text-7xl font-light tracking-tight text-slate-800 mb-4">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h1>
              <p className="text-xl text-slate-500 font-medium tracking-wide">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Meeting History Section */}
            <div className="flex-1 flex flex-col min-h-0 mt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Recent Meetings</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[250px] custom-scrollbar">
                {/* 🌟 FIX 3: Map over 'history' variable and format the date properly */}
                {history && history.length > 0 ? (
                  history.slice().reverse().map((meeting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <h4 className="font-semibold text-slate-700">{meeting.meetingCode}</h4>
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(meeting.date).toLocaleString([], {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No recent meetings. Start one to see it here!
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#0b5cff] animate-pulse"></div>
                <h4 className="font-semibold text-blue-900">System Ready</h4>
              </div>
              <p className="text-sm text-blue-700/80 leading-relaxed">
                Your video and audio devices are connected. You can start a new meeting or enter a code to join an existing one.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(Dashboard);