import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App.jsx";
import { useNavigate } from "react-router-dom";

function Login({setUser}) {

    const navigate = useNavigate()

    

    const handleLogin= async()=>{
        try{

            const result = await signInWithPopup(auth,provider)
            const {displayName,email} = result.user
            //backend url post req 
            const res = await axios.post(ServerUrl+"/api/auth/google",
        {name:displayName,email},{withCredentials:true}
            )
            setUser(res.data)
            navigate("/")
            console.log(result)            
        }catch(error){

            console.log(error)

        }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-emerald-50/20 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Branding & Google Sign-in */}
        <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 bg-purple-100/60 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
            ✨ AI Voice Assistant Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Build AI <br className="hidden sm:inline" />
            Assistants <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              For Any Website
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">
            Create customizable AI voice assistants that talk, guide users, and integrate into any website instantly.
          </p>

          <div className="pt-2 w-full sm:w-auto">
            <button onClick={handleLogin} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all">
              {/* Google Icon Badge */}
              <div className="bg-white p-1 rounded-full text-xs font-bold text-blue-600">G</div>
              Continue with Google
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center lg:text-left">Free plan includes 200 AI responses</p>
          </div>
        </div>

        {/* Right Side: Features Card Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl shadow-purple-900/5 relative w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Features</h2>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
              ⚡
            </div>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {/* Feature Item 1 */}
            <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gray-50/60 border border-gray-100/80 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm text-sm sm:text-base">
                🎤
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Voice AI</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Natural real-time voice conversations.</p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gray-50/60 border border-gray-100/80 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm text-sm sm:text-base">
                ✨
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Smart Navigation</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Navigate pages using voice commands.</p>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gray-50/60 border border-gray-100/80 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
                &lt;/&gt;
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Easy Embed</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Add assistant using one script tag.</p>
              </div>
            </div>

            {/* Feature Item 4 */}
            <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gray-50/60 border border-gray-100/80 hover:bg-white transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm text-sm sm:text-base">
                ⚡
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Fast Responses</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Optimized Gemini AI responses.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;