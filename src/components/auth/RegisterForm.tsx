
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ switchTab }: { switchTab: () => void }) => {
  const navigate = useNavigate();
  const [stNumber, setStNumber] = useState("");
  const [stNumberError, setStNumberError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateStNumber = (value: string) => {
    const regex = /^ST\d{8}$/;
    if (!regex.test(value)) {
      setStNumberError("Student Number must be in format ST12345678");
      return false;
    }
    setStNumberError("");
    return true;
  };

  const validateEmail = (value: string) => {
    const stNumberLower = stNumber.toLowerCase();
    const expectedEmail = `${stNumberLower}@rcconnect.edu.za`;
    
    if (value.toLowerCase() !== expectedEmail) {
      setEmailError(`Email must match your student number: ${expectedEmail}`);
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError("Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character");
      return false;
    }
    setPasswordError("");
    return true;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isStNumberValid = validateStNumber(stNumber);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isStNumberValid && isEmailValid && isPasswordValid) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              st_number: stNumber
            }
          }
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Registration successful! Logging in...");
        
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) {
          toast.error(loginError.message);
          return;
        }

        navigate('/admin');
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("An unexpected error occurred during registration");
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          id="register-name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="register-st-number" className="block text-sm font-medium text-gray-700 mb-1">
          Student Number (Format: ST12345678)
        </label>
        <input 
          type="text" 
          id="register-st-number"
          className={`w-full px-4 py-2 rounded-lg border ${stNumberError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent`}
          placeholder="ST12345678"
          value={stNumber}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setStNumber(value);
            if (email) validateEmail(email);
          }}
          required
        />
        {stNumberError && (
          <p className="mt-1 text-sm text-red-600">{stNumberError}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
        <input 
          type="email" 
          id="register-email"
          className={`w-full px-4 py-2 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent`}
          placeholder="ST12345678@rcconnect.edu.za"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          required
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          id="register-password"
          className={`w-full px-4 py-2 rounded-lg border ${passwordError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent`}
          placeholder="Choose a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          required
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
        )}
      </div>
      
      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
        <p><i className="fas fa-info-circle text-navy mr-1"></i> Registration requires manual verification & admin approval.</p>
      </div>
      
      <button 
        type="submit"
        className="w-full bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition"
      >
        Register
      </button>
      
      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button 
          type="button"
          className="text-navy hover:underline"
          onClick={switchTab}
        >
          Log in here
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
