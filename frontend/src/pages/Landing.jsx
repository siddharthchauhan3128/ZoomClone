import { useState } from 'react'

const Landing = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
// 2. Define a clear handler function
  const handleSearchClick = () => {
    setIsSearchOpen(true); 
    // Tip: If you want the button to toggle it open/closed, use: setIsSearchOpen(!isSearchOpen);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
    const CARDS = [
  { id: 1, title: 'Virtual Agent', bg: 'bg-slate-900', icon: <MessageIcon /> },
  { id: 2, title: 'Contact Center', bg: 'bg-[#403d39]', icon: <HeadsetIcon /> },
  { id: 3, title: 'Meetings', bg: 'bg-[#0b5cff]', icon: <VideoIcon /> },
  { id: 4, title: 'My Notes', bg: 'bg-blue-600', icon: <NoteIcon /> },
  { id: 5, title: 'ZoomMate', bg: 'bg-[#2a448a]', icon: <SparkleIcon /> },
  { id: 6, title: 'Team Chat', bg: 'bg-indigo-900', icon: <ChatIcon /> },
  { id: 7, title: 'Whiteboard', bg: 'bg-teal-700', icon: <BoardIcon /> },
  { id: 8, title: 'Scheduler', bg: 'bg-purple-800', icon: <CalendarIcon /> },
  ];
  return (
    <div className='overflow-hidden min-h-screen bg-gradient-to-br from-[#0a1638] via-[#2a448a] to-[#6c85d8] text-white flex flex-col h-full'>
        {/* Navbar */} 
        <nav className="w-full flex items-center justify-between px-4 md:px-8 py-4 bg-transparent text-white font-sans">
          
          {/* Left Section: Logo & Main Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="/" className="text-3xl font-bold tracking-tighter lowercase">
              zoom
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium">
              <button className="flex items-center gap-1 hover:text-slate-200 transition">
                Products
                <ChevronDownIcon />
              </button>
              
              <button className="flex items-center gap-1 hover:text-slate-200 transition">
                <SparkleIcon />
                AI
                <ChevronDownIcon />
              </button>
              
              <button className="flex items-center gap-1 hover:text-slate-200 transition">
                Solutions
                <ChevronDownIcon />
              </button>
              
              <a href="/pricing" className="hover:text-slate-200 transition">
                Pricing
              </a>
            </div>
          </div>

          {/* Right Section: Utilities & Actions */}
          <div className="hidden lg:flex items-center gap-5 text-[15px] font-medium">
            {/* Search Icon */}
            <button 
              className="hover:text-slate-200 transition" 
              onClick={handleSearchClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="border p-1 rounded ml-2 text-white"// Add your own styling here
                autoFocus // Automatically puts the cursor in the box when it appears
              />
            )}

            {/* Meet Dropdown */}
            <div className="relative group">
            {/* The Trigger Button */}
            <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/15 transition-all duration-200">
                Meet
                {/* Chevron that flips on hover */}
                <svg 
                className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* FIXED: Invisible Wrapper that maintains hover state */}
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50 min-w-[200px]">
                
                {/* The Visible Menu Card */}
                <div className="flex flex-col bg-white text-slate-900 font-medium rounded-xl shadow-xl py-2 origin-top-left animate-in fade-in zoom-in-95 duration-200">
                <a href="/join" className="px-5 py-2.5 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                    Join a meeting
                </a>
                <a href="/host" className="px-5 py-2.5 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                    Host a meeting
                </a>
                <a href="/download" className="px-5 py-2.5 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                    Download app
                </a>
                </div>
                
            </div>
            </div>

            <a href="/signin" className="hover:text-slate-200 transition">
              Sign In
            </a>

            <a href="/support" className="hover:text-slate-200 transition">
              Support
            </a>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-2">
              <a href="/contact" className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-semibold hover:bg-slate-100 transition">
                Contact Sales
              </a>
              <a href="/signup" className="bg-[#0b5cff] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition">
                Sign Up Free
              </a>
            </div>

            {/* App Grid Icon */}
            <button className="ml-2 hover:text-slate-200 transition">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          </div>

          {/* Mobile Menu Placeholder (Hidden on Desktop) */}
         <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none z-50">
            {isMenuOpen ? (
              /* Cross (X) Icon when open */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger Icon when closed */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        </nav>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#0a1638] z-40 lg:hidden flex flex-col p-6 pt-24 space-y-6 text-xl font-medium animate-in slide-in-from-right duration-200">
            <button className="flex items-center justify-between border-b border-white/10 pb-3">
              Products <ChevronDownIcon />
            </button>
            <button className="flex items-center justify-between border-b border-white/10 pb-3">
              Solutions <ChevronDownIcon />
            </button>
            <a href="/pricing" className="border-b border-white/10 pb-3" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
            <a href="/signin" className="border-b border-white/10 pb-3" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </a>
            
            <div className="flex flex-col gap-4 pt-4">
              <a href="/contact" className="bg-white text-slate-900 text-center py-3 rounded-full font-semibold">
                Contact Sales
              </a>
              <a href="/signup" className="bg-[#0b5cff] text-white text-center py-3 rounded-full font-semibold">
                Sign Up Free
              </a>
            </div>
          </div>
        )}
      
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4 mt-16 lg:mt-24">
            
            <h2 className="text-5xl lg:text-[80px] font-bold tracking-tight leading-[1.1] max-w-5xl mb-6">
                Find out what's possible <br className="hidden md:block"/> when work connects
            </h2>
            
            <p className="text-[17px] md:text-xl font-medium mb-10 max-w-2xl text-slate-100">
                Bridge the gap between talking and doing with the AI-first work platform built for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button className="bg-[#0a1638] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-black transition-colors min-w-[160px]">
                    Explore products
                </button>
                <button className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-100 transition-colors min-w-[160px]">
                    Find your plan
                </button>
            </div>
            
            
            <div className="w-full mt-16 relative mb-12">
                <style>
                {`
                @keyframes infinite-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 40s linear infinite;
                    /* Ensure the track is wide enough for all duplicated items */
                    width: max-content; 
                }
                /* Pauses the animation when the user hovers over the track */
                .animate-infinite-scroll:hover {
                    animation-play-state: paused;
                }
                `}
            </style>

            <div className="w-full mt-16 pb-16 relative">
                <div className="flex gap-4 animate-infinite-scroll px-4">
                    {/* First Set of Cards */}
                    {CARDS.map((card) => (
                        <div key={`first-${card.id}`} className={`${card.bg} w-[280px] h-[300px] rounded-3xl p-6 cursor-pointer hover:-translate-y-4 transition-transform duration-300 flex-shrink-0`}>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            {card.icon} {card.title}
                        </h3>
                        </div>
                    ))}
                    {/* Second Set (Duplicated for infinite scroll) */}
                    {CARDS.map((card) => (
                        <div key={`second-${card.id}`} className={`${card.bg} w-[280px] h-[300px] rounded-3xl p-6 cursor-pointer hover:-translate-y-4 transition-transform duration-300 flex-shrink-0`}>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            {card.icon} {card.title}
                        </h3>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    </main>


        <footer className="bg-[#0b132b] text-white pt-16 pb-12 px-4 md:px-8 font-sans w-full">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-8">
        
        {/* Left Column: Actions & Socials */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          {/* Download Center Card */}
          <div className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition">
             <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0b5cff]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
             </div>
             <div>
                <h4 className="font-bold text-lg leading-tight">Download Center</h4>
                <p className="text-sm text-slate-300">Get the most out of Zoom</p>
             </div>
          </div>

          {/* Dropdowns */}
          <button className="flex items-center justify-between w-full max-w-[280px] bg-[#1a2245] px-4 py-3 rounded-lg text-sm font-medium hover:bg-[#232b4e] transition">
            English
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          <button className="flex items-center justify-between w-full max-w-[280px] bg-[#1a2245] px-4 py-3 rounded-lg text-sm font-medium hover:bg-[#232b4e] transition">
            US Dollar $
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {/* Contact Info */}
          <div className="mt-auto pt-12">
            <p className="text-slate-300 text-sm mb-1">Get in touch</p>
            <p className="font-bold text-2xl mb-6">+1.888.799.9666</p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-blue-400 transition"><span className="text-xl font-bold">in</span></a>
              <a href="#" className="hover:text-blue-400 transition"><span className="text-xl font-bold">X</span></a>
              <a href="#" className="hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Links Grid */}
        <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-8 text-[14px]">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 text-slate-300">
            <a href="#" className="hover:text-white transition">Zoom Blog</a>
            <a href="#" className="hover:text-white transition">Customers</a>
            <a href="#" className="hover:text-white transition">Our Team</a>
            <a href="#" className="hover:text-white transition">Careers</a>
            <a href="#" className="hover:text-white transition">Integrations</a>
            <a href="#" className="hover:text-white transition">Partners</a>
            <a href="#" className="hover:text-white transition">Investors</a>
            <a href="#" className="hover:text-white transition">Press</a>
            <a href="#" className="hover:text-white transition">Sustainability & ESG</a>
            <a href="#" className="hover:text-white transition">Zoom Cares</a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4 text-slate-300">
            <a href="#" className="hover:text-white transition">Zoom Workplace App</a>
            <a href="#" className="hover:text-white transition">Zoom Rooms App</a>
            <a href="#" className="hover:text-white transition">Zoom Rooms Controller</a>
            <a href="#" className="hover:text-white transition">Browser Extension</a>
            <a href="#" className="hover:text-white transition">Outlook Plug-in</a>
            <a href="#" className="hover:text-white transition">iPhone/iPad App</a>
            <a href="#" className="hover:text-white transition">Android App</a>
            <a href="#" className="hover:text-white transition">Zoom Virtual Backgrounds</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 text-slate-300">
            <a href="#" className="hover:text-white transition">+1.888.799.9666</a>
            <a href="#" className="hover:text-white transition">Contact Sales</a>
            <a href="#" className="hover:text-white transition">Plans & Pricing</a>
            <a href="#" className="hover:text-white transition">Request a Demo</a>
            <a href="#" className="hover:text-white transition">Webinars and Events</a>
            <a href="#" className="hover:text-white transition">Zoom Experience Center</a>
            <a href="#" className="hover:text-white transition">Zoom for Startups</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4 text-slate-300">
            <a href="#" className="hover:text-white transition">Test Zoom</a>
            <a href="#" className="hover:text-white transition">Account</a>
            <a href="#" className="hover:text-white transition">Support Center</a>
            <a href="#" className="hover:text-white transition">Learning Center</a>
            <a href="#" className="hover:text-white transition">Zoom Community</a>
            <a href="#" className="hover:text-white transition">Feedback</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
            <a href="#" className="hover:text-white transition">Accessibility</a>
            <a href="#" className="hover:text-white transition leading-snug">Privacy, Security, Legal<br/>Policies, and Modern<br/>Slavery Act Transparency<br/>Statement</a>
          </div>
        </div>

      </div>
    </footer>

    </div>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
  );
}

function MessageIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" /></svg>; }
function HeadsetIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" /></svg>; }
function VideoIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7C17 5.9 16.1 5 15 5H4C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H15C16.1 19 17 18.1 17 17V13.5L21 17.5V6.5L17 10.5Z" /></svg>; }
function NoteIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" /></svg>; }
function ChatIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>; }
function BoardIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function CalendarIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
export default Landing
