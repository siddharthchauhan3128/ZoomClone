import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Authentication = () => {
  const { mode } = useParams(); // 'signup' or 'signin'
  const navigate = useNavigate();
  const { login, register, error } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  // Helper to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // IMPROVEMENT: Check if form is valid to enable the submit button
  const isFormValid = mode === 'signup' 
    ? formData.name && formData.email && formData.username && formData.password
    : formData.email && formData.password;

 const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        console.log("1. Button clicked. Mode is:", mode);

        if (mode === 'signin') {
          console.log("2. Attempting to log in...");
          const result = await login(formData.email, formData.password);
          
          console.log("3. Backend responded! Here is the result:", result);

          if (result.success) {
            console.log("4. Success! Redirecting to:", `/dashboard/${result.userId}`);
            navigate(`/dashboard/${result.userId}`); 
          } else {
            console.log("4. Failed. Showing error:", result.error);
          }
        } else {
          // (Your register code is down here)
          const result = await register(formData);
          if (result.success) {
            navigate(`/dashboard/${result.userId}`); 
          }
        }
        setFormData({
          name: '',
          email: '',
          username: '',
          password: ''
        })
};

 return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#232333]">
      {/* Mini Top Navbar */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-100">
        <div className="text-2xl font-bold tracking-tighter text-[#0b5cff] flex items-center gap-1">
          <span className="lowercase font-black text-3xl">zoom</span>
        </div>

        <div className="flex items-center gap-6 text-[14px] text-gray-600 font-medium">
          {mode === 'signup' && (
            <div>
              Already have an account?{' '}
              <button 
                // IMPROVEMENT: Removed setForm(0), only relying on navigate
                onClick={() => navigate('/auth/signin')} 
                className="text-[#0b5cff] hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          )}
            
          {mode === 'signin' && (
            <div>
              Don't have an account?{' '}
              <button 
                // IMPROVEMENT: Removed setForm(1), only relying on navigate
                onClick={() => navigate('/auth/signup')} 
                className="text-[#0b5cff] hover:underline font-semibold"
              >
                Sign Up Free
              </button>
            </div>
          )}
          <a href="#" className="hover:text-gray-900 hidden sm:inline">Support</a>
          <button className="flex items-center gap-1 hover:text-gray-900 hidden sm:flex">
            English
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Split Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: Perks Feature Panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-[#f7f9fa] flex-col items-center justify-center p-12 relative overflow-hidden">
           {/* ... (Your existing SVG and Perks list remains exactly the same here) ... */}
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-[#232333]">
              Create your free Basic account
            </h2>
            <ul className="space-y-4 text-[14px] text-gray-600 font-medium">
              {[
                "Get up to 40 minutes and 100 participants per meeting",
                "Share AI Docs",
                "Get 3 editable whiteboards",
                "Unlimited instant messaging",
                "Create up to 5 two-minute video messages"
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-[#23d366] text-white rounded-full p-0.5 mt-0.5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Registration Form */}
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-12 lg:p-20">
          <div className="w-full max-w-[380px] flex flex-col">
            
            <h1 className="text-3xl font-bold tracking-tight text-center mb-8 text-[#232333]">
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </h1>
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl mb-6 text-[14px] text-center font-medium">
                    {error}
                  </div>
                )}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* IMPROVEMENT: Only show Name and Username if signing up */}
              {mode === 'signup' && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0b5cff] text-[15px] transition-colors placeholder-gray-400"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0b5cff] text-[15px] transition-colors placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0b5cff] text-[15px] transition-colors placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0b5cff] text-[15px] transition-colors placeholder-gray-400"
                />
              </div>
            
              {/* IMPROVEMENT: Dynamic button styling based on isFormValid */}
              <button 
                disabled={!isFormValid}
                type="submit"
                className={`w-full font-semibold py-3.5 rounded-xl text-[15px] transition-colors mt-2 ${
                  isFormValid 
                    ? 'bg-[#0b5cff] text-white hover:bg-blue-700 cursor-pointer' 
                    : 'bg-[#f0f2f5] text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </form>

            <p className="text-[12px] text-gray-500 text-center leading-relaxed mt-4">
              By proceeding, I agree to Zoom's{' '}
              <Link to="/privacy" className="text-[#0b5cff] hover:underline">Privacy Statement</Link> and{' '}
              <Link to="/terms" className="text-[#0b5cff] hover:underline">Terms of Service</Link>.
            </p>

            <p className="text-[11px] text-gray-400 text-center leading-normal mt-4">
              Zoom is protected by reCAPTCHA and the Google{' '}
              <Link to="/privacy" className="text-[#0b5cff] hover:underline">Privacy Statement</Link> and{' '}
              <Link to="/terms" className="text-[#0b5cff] hover:underline">Terms of Service</Link>.
            </p>

            <div className="w-10 h-1 bg-gray-400 rounded-full mx-auto mt-12 mb-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;