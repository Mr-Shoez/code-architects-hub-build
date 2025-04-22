
import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to admin
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="md:w-1/2 p-8 md:p-12">
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'login' ? 'text-navy border-lime' : 'text-gray-500 border-transparent'}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button 
          className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'register' ? 'text-navy border-lime' : 'text-gray-500 border-transparent'}`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
      </div>
      
      {activeTab === 'login' && (
        <LoginForm switchTab={() => setActiveTab('register')} />
      )}
      
      {activeTab === 'register' && (
        <RegisterForm switchTab={() => setActiveTab('login')} />
      )}
    </div>
  );
};

export default AuthTabs;
