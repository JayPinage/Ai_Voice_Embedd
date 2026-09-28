import axios from "axios";
import React, { useState } from "react";
import { CLIENT_URL, ServerUrl } from "../App";

function Builder({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete);
  const [copied, setCopied] = useState(false);
  
  // Form state tracking
  const [formData, setFormData] = useState({
    assistantName: user?.assistantName || "",
    businessName: user?.businessName || "",
    businessType: user?.businessType || "",
    businessDescription: user?.businessDescription || "",
    theme: user?.theme || "Dark",
    tone: user?.tone || "Friendly",
    geminiApiKey: user?.geminiApiKey || "",
    pages: user?.pages || [{ name: "", path: "", keywords: "" }]
  });

  // Local state for the inputs when adding a new page row
  const [newPage, setNewPage] = useState({ name: "", path: "", keywords: "" });

  const handleAddPage = () => {
    if (!newPage.name && !newPage.path) return;
    setFormData({
      ...formData,
      pages: [...formData.pages, newPage]
    });
    setNewPage({ name: "", path: "", keywords: "" });
  };

  const handleDeletePage = (index) => {
    const updatedPages = formData.pages.filter((_, i) => i !== index);
    setFormData({ ...formData, pages: updatedPages });
  };

  const handlePageChange = (index, field, value) => {
    const updatedPages = [...formData.pages];
    updatedPages[index][field] = value;
    setFormData({ ...formData, pages: updatedPages });
  };

  const saveAssistant = async () => {
    setLoading(true);

    try {
      const {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApiKey,
        pages
      } = formData;

      const data = {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApiKey,
        pages,
      };

      const res = await axios.post(
        ServerUrl + "/api/user/save-assistant",
        data,
        { withCredentials: true }
      );
      
      setEditAssistant(false);
      setUser(res.data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const remainingMessage = Math.max(
    0, (user?.requestLimit || 200) - (user?.totalMessages || 0)
  );

  const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Assistant Builder
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Customize your virtual assistant
          </p>
        </div>

        {user.isSetupComplete && !editAssistant && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-sm text-gray-400">Assistant</p>
                <h2 className="text-3xl font-bold text-[#081028] mt-1">
                  {user.assistantName}
                </h2>
                <p className="text-gray-500 mt-2 leading-7">
                  Your assistant is ready to use on your website.
                </p>
              </div>

              {/* Status Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* Current Plan Card */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-400">Current Plan</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {user?.plan || "Free"}
                  </h3>
                </div>

                {/* Gemini Status Card */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-400">AI Status</p>
                  <h3 className="text-lg font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Active
                  </h3>
                </div>

                {/* Messages Left Card */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-400">Messages Left</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {remainingMessage}
                  </h3>
                </div>

              </div>

              {/* Edit Assistant Button */}
             
            </div>

            {/* Embed Code Card matching image reference */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-6">
              
              {/* Instructions Box */}
              <div className="bg-[#fffdfa] border border-amber-100 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Where to paste this script?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Paste this script before the closing <code className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-mono">&lt;/body&gt;</code> tag of your website HTML file.
                </p>
                <p className="text-xs font-semibold text-gray-700 pt-1">Example:</p>
                
                {/* Example Dark Code Snippet Block */}
                <div className="bg-[#0b1329] text-gray-300 font-mono text-xs p-4 rounded-xl space-y-2 overflow-x-auto">
                  <p className="text-emerald-400">&lt;body&gt;</p>
                  <p className="pl-4 text-gray-400">Your Website Content</p>
                  <p className="pl-4 text-purple-300 break-all">&lt;script src="{CLIENT_URL}/assistant.js" data-user-id="{user?._id}"&gt;&lt;/script&gt;</p>
                  <p className="text-emerald-400">&lt;/body&gt;</p>
                </div>
              </div>

              {/* Embed Code Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Embed Code</label>
                <div className="relative bg-[#0b1329] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <code className="text-xs text-purple-300 font-mono overflow-x-auto whitespace-nowrap scrollbar-none">
                    {embedCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 text-xs font-medium"
                    title="Copy code"
                  >
                    {copied ? (
                      <span className="text-emerald-600 font-semibold px-1">Copied!</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

            </div>
             <button
                onClick={() => setEditAssistant(true)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all"
              >
                Edit Assistant Settings
              </button>
          </div>
         
        )}

        {editAssistant && (
          <div className="space-y-8">

            {/* 1. Basic Information Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Basic Information</h2>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={formData.assistantName}
                  onChange={(e) => setFormData({...formData, assistantName: e.target.value})}
                  placeholder="Assistant Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm transition-all"
                />
                <input 
                  type="text" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Business Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm transition-all"
                />
                <input 
                  type="text" 
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  placeholder="Business Type"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm transition-all"
                />
                <textarea 
                  rows="3"
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                  placeholder="Business Description"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm transition-all resize-none"
                />
              </div>
            </div>

            {/* 2. Appearance & Tone Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Appearance</h2>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Light", "Dark", "Glass", "Neon"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, theme: t})}
                      className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                        formData.theme === t 
                          ? "border-purple-500 text-purple-700 bg-purple-50/50 shadow-sm" 
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assistant Tone</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Friendly", "Professional", "Sales"].map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormData({...formData, tone: tone})}
                      className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                        formData.tone === tone 
                          ? "border-purple-500 text-purple-700 bg-purple-50/50 shadow-sm" 
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Gemini API KEY Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">API KEY</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Add your API key to power your assistant</p>
                </div>
                <button className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-emerald-500 shadow-sm hover:opacity-95 transition-all">
                  Get API KEY
                </button>
              </div>

              <input 
                type="password" 
                value={formData.geminiApiKey}
                onChange={(e) => setFormData({...formData, geminiApiKey: e.target.value})}
                placeholder="AIza..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm transition-all"
              />
              <p className="text-[11px] text-gray-400">Your API key is securely stored and only used for generating AI responses.</p>
            </div>

            {/* 4. Navigation Pages Card with Edit & Delete Operations */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Navigation Pages</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Assistant can redirect users</p>
                </div>
                <button 
                  onClick={handleAddPage}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-emerald-500 shadow-sm hover:opacity-95 transition-all flex items-center gap-1"
                >
                  + Add
                </button>
              </div>

              {/* New Page Input Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  value={newPage.name}
                  onChange={(e) => setNewPage({...newPage, name: e.target.value})}
                  placeholder="Page Name"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
                />
                <input 
                  type="text" 
                  value={newPage.path}
                  onChange={(e) => setNewPage({...newPage, path: e.target.value})}
                  placeholder="/pricing"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
                />
                <input 
                  type="text" 
                  value={newPage.keywords}
                  onChange={(e) => setNewPage({...newPage, keywords: e.target.value})}
                  placeholder="Pricing, Plan"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="space-y-3 pt-2">
                {formData.pages.map((page, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-grow">
                      <input 
                        type="text" 
                        value={page.name}
                        onChange={(e) => handlePageChange(index, "name", e.target.value)}
                        placeholder="Page Name"
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-500 text-sm"
                      />
                      <input 
                        type="text" 
                        value={page.path}
                        onChange={(e) => handlePageChange(index, "path", e.target.value)}
                        placeholder="/pricing"
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-500 text-sm"
                      />
                      <input 
                        type="text" 
                        value={page.keywords}
                        onChange={(e) => handlePageChange(index, "keywords", e.target.value)}
                        placeholder="Pricing, Plan"
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-500 text-sm"
                      />
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDeletePage(index)}
                      title="Delete Page"
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 bg-white transition-all shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={saveAssistant}
              disabled={loading} 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
            >
              {loading ? "Saving..." : user?.isSetupComplete ? "Update Assistant" : "Save Assistant"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default Builder;