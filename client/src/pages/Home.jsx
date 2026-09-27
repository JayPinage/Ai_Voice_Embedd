import React from "react";
import { useNavigate } from "react-router-dom";
import AssistantPreview from "../components/assistantPreview";

function Home({ user }) {

  const navigate=useNavigate()
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-white via-purple-50/20 to-emerald-50/20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Status Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          Voice AI for modern websites
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Add a{" "}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Virtual Assistant
          </span>{" "}
          <br className="hidden sm:inline" />
          to your website
        </h1>

        {/* Subtitle Description */}
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          Create a smart voice-enabled assistant that talks to visitors, answers questions and helps users navigate your website instantly.
        </p>

        {/* Call to Action Button & Plan Info */}
        <div className="pt-2 flex flex-col items-center">
          <button onClick={()=>navigate("/builder")} className="bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all text-sm sm:text-base">
            Build Your Assistant
          </button>
          <p className="text-xs text-gray-400 mt-3">Free plan includes 200 AI responses</p>
        </div>
        <AssistantPreview/>

      </div>
    </div>
  );
}

export default Home;