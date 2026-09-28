import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom"; // Fix 1: Imported useNavigate

function Navbar({ user, setUser, ServerUrl }) { // Fix 2: Added ServerUrl prop
  const navigate = useNavigate(); // Fix 3: Correct hook initialization (lowercase 'n')

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
      setUser(null);
      navigate("/login"); // Fixed to lowercase 'navigate'
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Shifra AI Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
            ⚡
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Embedd <span className="text-purple-600">AI</span>
          </span>
        </div>

        {/* Right Section: Builder, Billing, and User Profile Pill */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Builder Button */}
          <button onClick={()=>navigate("/builder")} className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-emerald-500 shadow-sm hover:opacity-95 transition-all">
            Builder
          </button>

          {/* Billing Button */}
          <button onClick={()=>navigate("/billing")}  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all">
            Billing
          </button>

          {/* User Profile Pill Container */}
          {user && (
            <div className="flex items-center gap-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl py-1.5 pl-2 pr-3 shadow-sm">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-semibold text-xs flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>

              {/* User Details */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {user.name }
                </span>
                <span className="text-[10px] text-gray-400 leading-tight">
                  {user.email }
                </span>
              </div>

              {/* Logout Button Icon */}
              <button 
                onClick={handleLogout}
                title="Logout"
                className="ml-1 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;