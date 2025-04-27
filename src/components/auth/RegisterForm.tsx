
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterForm = ({ switchTab }: { switchTab: () => void }) => {
  const navigate = useNavigate();
  const [stNumber, setStNumber] = useState("");
  const [stNumberError, setStNumberError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Validate form on input changes
  useEffect(() => {
    const isStNumberValid = stNumber ? validateStNumber(stNumber) : false;
    const isEmailValid = email ? validateEmail(email) : false;
    const isPasswordValid = password ? validatePassword(password) : false;
    const isFirstNameValid = firstName.trim().length > 0;
    const isLastNameValid = lastName.trim().length > 0;
    
    setFormValid(isStNumberValid && isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid);
  }, [stNumber, email, password, firstName, lastName]);

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
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
    
    if (formValid) {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              st_number: stNumber,
              full_name: `${firstName} ${lastName}`
            }
          }
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Registration successful! Please check your email for verification.");
        
        // Auto-switch to login after successful registration
        setTimeout(() => {
          switchTab();
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("An unexpected error occurred during registration");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="register-first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</Label>
          <Input 
            type="text" 
            id="register-first-name"
            className="w-full"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="register-last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</Label>
          <Input 
            type="text" 
            id="register-last-name"
            className="w-full"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="register-st-number" className="block text-sm font-medium text-gray-700 mb-1">
          Student Number (Format: ST12345678)
        </Label>
        <Input 
          type="text" 
          id="register-st-number"
          className={`w-full ${stNumberError ? 'border-red-500' : ''}`}
          placeholder="ST12345678"
          value={stNumber}
          onChange={(e) => {
            const upperValue = e.target.value.toUpperCase();
            setStNumber(upperValue);
            validateStNumber(upperValue);
          }}
          autoComplete="username"
          required
        />
        {stNumberError && (
          <p className="mt-1 text-sm text-red-600">{stNumberError}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
        <Input 
          type="email" 
          id="register-email"
          className={`w-full ${emailError ? 'border-red-500' : ''}`}
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          autoComplete="email"
          required
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
        <Input 
          type="password" 
          id="register-password"
          className={`w-full ${passwordError ? 'border-red-500' : ''}`}
          placeholder="Choose a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          autoComplete="new-password"
          required
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
        )}
        
        {password && !passwordError && (
          <p className="mt-1 text-sm text-green-600">Password meets all requirements</p>
        )}
      </div>
      
      <button 
        type="submit"
        className={`w-full font-medium py-2 px-4 rounded-md transition ${
          formValid 
            ? 'bg-lime text-navy hover:bg-lime/90' 
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
        disabled={loading || !formValid}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering...
          </span>
        ) : (
          "Register"
        )}
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
