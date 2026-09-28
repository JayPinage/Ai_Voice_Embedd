import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import axios  from "axios";


function Biling({ user,setUser }) {
    const navigate = useNavigate()

  useEffect(()=>{
    if(user && !user.isSetupComplete){
        navigate("/builder")

    }
  },[user,navigate])

    const remainingMessage = Math.max(
    0, (user?.requestLimit || 200) - (user?.totalMessages || 0)
  );

  const handlePay = async()=>{

    try{

        console.log(window.Razorpay);

        const res = await axios.post(ServerUrl +"/api/billing/order",
            {plan:"pro"},{withCredentials:true}
        )

        const order = res.data.order
        
        const options = {
            key:import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount:order.amount,
            currency:order.currency,
            name:"JackAI",
            description:"Pro Plan",
            order_id:order.id,
            handler:async(response)=>{
             const verifyRes =  await axios.post(ServerUrl +"/api/billing/verify",response,{withCredentials:true})

             setUser(verifyRes.data.user)

             
            },
            theme:{
                color:'#7c3aed',
            },

        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
    }catch(error){
        console.log(error)

    }

  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* Top Header Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <p className="text-gray-500 text-sm">
          Manage your AI assistant plan and usage.
        </p>
      </div>

      {/* Top Stat Cards Container */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Current Plan Card */}
      
<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
  <p className="text-xs text-gray-400 font-medium mb-1">
    Current Plan
  </p>

  <h3 className="text-xl font-bold text-gray-900">
    {user?.plan === "pro" ? "Pro" : "Free"}
  </h3>
</div>

        {/* Status Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
  <p className="text-xs text-gray-400 font-medium mb-1">
    AI Status
  </p>

  <h3 className="text-xl font-bold text-emerald-600">
    Active
  </h3>
</div>

        {/* Messages Left Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
  <p className="text-xs text-gray-400 font-medium mb-1">
    Messages Left
  </p>

  <h3 className="text-lg font-bold text-gray-900 mt-1">
    {user?.plan === "pro" ? "Unlimited" : remainingMessage}
  </h3>
</div>
      </div>

      {/* Pricing Cards Container */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Free Plan Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Free Plan</h3>
            <div className="text-4xl font-extrabold text-gray-900 mb-6">₹0</div>
            
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center">200 AI messages</li>
              <li className="flex items-center">Voice assistant</li>
              <li className="flex items-center">Navigation support</li>
              <li className="flex items-center">Basic customization</li>
            </ul>
          </div>
        </div>

        {/* Pro Plan Card (Gradient Background) */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-400 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Pro Plan</h3>
            <div className="text-4xl font-extrabold mb-1">₹699</div>
            <p className="text-xs text-indigo-100 mb-6">3 Months Access</p>

            <ul className="space-y-4 text-sm text-indigo-50">
              <li className="flex items-center">Unlimited AI messages</li>
              <li className="flex items-center">Advanced AI assistant</li>
              <li className="flex items-center">Priority performance</li>
              <li className="flex items-center">Unlimited navigation</li>
              <li className="flex items-center">Premium support</li>
            </ul>
          </div>

          {/* Upgrade Button */}
          <div className="mt-8">
            <button 
            onClick={handlePay}
            
            disabled=   {user?.plan ==="pro"} className="w-full py-3.5 bg-white text-gray-900 font-semibold rounded-2xl shadow-md hover:bg-gray-50 transition duration-200">
              {user?.plan ==="pro" ? "Active Plan" : "Upgrade Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Biling;