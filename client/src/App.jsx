import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState } from "react";
import { useEffect } from "react";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";
import Builder from "./pages/Builder";
import Biling from "./pages/Billing";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const ServerUrl = "http://localhost:8000"
export const CLIENT_URL = "http://localhost:5173"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(ServerUrl + "/api/user/current-user",
          { withCredentials: true }
        )
        // console.log(res.data)
        setUser(res.data)
        setLoading(false)

      } catch (error) {
        console.log(error)
        setLoading(false)

      }
    }
    fetchMe()

  }, [])


  return (
    <Routes>

      <Route path="/login" element={<Login setUser={setUser}/>} />
      // protectd routes
      <Route path="/*" element={<ProtectedRoute user={user} loading={loading}>
        <Navbar user={user} setUser={setUser}/>
        <Routes>
          <Route path="/" element={<Home user={user}/>} />
          <Route path="/builder" element={<Builder user={user} setUser={setUser}/>}/>
          <Route path="/biling" element={<Biling user={user}/>}/>

          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>

        
      </ProtectedRoute>} />

    </Routes>
  )
}

export default App