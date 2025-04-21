
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = ({ switchTab }: { switchTab: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Attempting login with:", { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error details:", error);
        toast.error(error.message);
        return;
      }

      console.log("Login successful, user:", data.user);
      toast.success("Login successful! Redirecting to dashboard...");
      navigate('/admin');
    } catch (error) {
      console.error("Login exception:", error);
      toast.error("An unexpected error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">College Email</Label>
        <Input 
          type="email" 
          id="login-email"
          className="w-full mt-1"
          placeholder="Enter your college email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
        <Input 
          type="password" 
          id="login-password"
          className="w-full mt-1"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button 
        type="submit"
        className="w-full bg-navy text-white font-medium py-2 px-4 rounded-md hover:bg-navy/90 transition"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : (
          "Log In"
        )}
      </button>
      
      <p className="text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <button 
          type="button"
          className="text-navy hover:underline"
          onClick={switchTab}
        >
          Register here
        </button>
      </p>
    </form>
  );
};

export default LoginForm;

