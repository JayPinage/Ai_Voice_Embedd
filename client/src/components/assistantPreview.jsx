import React, { useState } from "react";

function AssistantPreview() {
  // State to hold the current theme styles
  const [theme, setTheme] = useState({
    bg: "bg-gradient-to-b from-gray-900 via-gray-950 to-black",
    border: "border-gray-800",
    textMain: "text-white",
    textSub: "text-gray-400",
    shadow: "shadow-purple-950/40"
  });

  // Predefined theme configurations
  const themes = {
    dark: {
      bg: "bg-gradient-to-b from-gray-900 via-gray-950 to-black",
      border: "border-gray-800",
      textMain: "text-white",
      textSub: "text-gray-400",
      shadow: "shadow-purple-950/40"
    },
    light: {
      bg: "bg-gradient-to-b from-white via-gray-50 to-gray-100",
      border: "border-gray-200",
      textMain: "text-gray-900",
      textSub: "text-gray-600",
      shadow: "shadow-gray-300/50"
    },
    purple: {
      bg: "bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950",
      border: "border-purple-800",
      textMain: "text-purple-100",
      textSub: "text-purple-300",
      shadow: "shadow-purple-900/50"
    },
    emerald: {
      bg: "bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-900",
      border: "border-emerald-800/60",
      textMain: "text-emerald-100",
      textSub: "text-emerald-300/80",
      shadow: "shadow-emerald-950/40"
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-8 px-4">
      {/* Widget Card Container with dynamic theme classes */}
      <div className={`w-full max-w-xs sm:max-w-sm ${theme.bg} border ${theme.border} rounded-3xl p-5 sm:p-6 shadow-2xl ${theme.shadow} relative flex flex-col items-center text-center transition-all duration-300`}>
        
        {/* Top Interactive Theme Selector Dots */}
        <div className="w-full flex justify-end gap-1.5 mb-4">
          {/* Black/Dark Theme Dot */}
          <button 
            onClick={() => setTheme(themes.dark)}
            className="w-3 h-3 rounded-full bg-gray-950 border border-gray-700 hover:scale-110 transition-transform cursor-pointer"
            title="Dark Theme"
          />
          {/* Light Theme Dot */}
          <button 
            onClick={() => setTheme(themes.light)}
            className="w-3 h-3 rounded-full bg-white border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
            title="Light Theme"
          />
          {/* Purple Theme Dot */}
          <button 
            onClick={() => setTheme(themes.purple)}
            className="w-3 h-3 rounded-full bg-purple-600 border border-purple-400 hover:scale-110 transition-transform cursor-pointer"
            title="Purple Theme"
          />
          {/* Emerald Theme Dot */}
          <button 
            onClick={() => setTheme(themes.emerald)}
            className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 hover:scale-110 transition-transform cursor-pointer"
            title="Emerald Theme"
          />
        </div>

        {/* Glowing Voice Orb */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-emerald-400 rounded-full blur-lg opacity-40 animate-pulse"></div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-400 p-0.5 shadow-md">
            <div className={`w-full h-full ${theme === themes.light ? 'bg-white' : 'bg-gray-950'} rounded-full flex items-center justify-center transition-colors`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 opacity-90"></div>
            </div>
          </div>
        </div>

        {/* Heading & Description */}
        <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${theme.textMain} mb-1 transition-colors`}>
          Hello! I'm Shifra AI
        </h2>
        <p className={`text-[11px] sm:text-xs ${theme.textSub} max-w-[240px] leading-relaxed mb-6 transition-colors`}>
          Your smart voice assistant. <br />
          Ask anything about your website.
        </p>

        {/* Listening Status & Audio Wave Animation */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] sm:text-xs font-medium text-emerald-400 tracking-wider uppercase">
            Listening...
          </span>
          <div className="flex items-center justify-center gap-1 h-5">
            <div className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce h-2.5"></div>
            <div className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce h-5 [animation-delay:-0.2s]"></div>
            <div className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce h-3.5 [animation-delay:-0.4s]"></div>
            <div className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce h-4.5 [animation-delay:-0.1s]"></div>
            <div className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce h-2 [animation-delay:-0.3s]"></div>
          </div>
        </div>

        {/* Mic Button */}
        <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-105 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-12 7.5a6 6 0 01-6-6v-1.5m12 7.5v3m-6-3v3m9-10.5v-1.5a9 9 0 10-18 0v1.5m-3 0h24" />
          </svg>
        </button>

      </div>
    </div>
  );
}

export default AssistantPreview;