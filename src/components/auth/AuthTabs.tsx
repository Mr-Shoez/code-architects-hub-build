
import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Error checking login status");
          return;
        }
        
        if (data.session) {
          console.log("User already logged in, redirecting to admin");
          // User is already logged in, redirect to admin
          navigate('/admin');
        }
      } catch (err) {
        console.error("Session check exception:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="md:w-1/2 p-8 md:p-12 flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-navy mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Checking login status...</p>
        </div>
      </div>
    );
  }

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
