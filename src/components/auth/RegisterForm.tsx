
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormInput from "./FormInput";
import AuthFormError from "./AuthFormError";
import SubmitButton from "./SubmitButton";

const RegisterForm = ({ switchTab }: { switchTab: () => void }) => {
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
        <FormInput
          id="register-first-name"
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          autoComplete="given-name"
        />
        
        <FormInput
          id="register-last-name"
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          autoComplete="family-name"
        />
      </div>
      
      <FormInput
        id="register-st-number"
        label="Student Number (Format: ST12345678)"
        type="text"
        value={stNumber}
        onChange={(e) => {
          const upperValue = e.target.value.toUpperCase();
          setStNumber(upperValue);
          validateStNumber(upperValue);
        }}
        error={stNumberError}
        placeholder="ST12345678"
        autoComplete="username"
      />
      
      <FormInput
        id="register-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        error={emailError}
        placeholder="Your email address"
        autoComplete="email"
      />
      
      <FormInput
        id="register-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value);
        }}
        error={passwordError}
        placeholder="Choose a strong password"
        autoComplete="new-password"
      />
      
      {password && !passwordError && (
        <p className="mt-1 text-sm text-green-600">Password meets all requirements</p>
      )}
      
      <SubmitButton
        loading={loading}
        disabled={!formValid}
        text="Register"
        loadingText="Registering..."
      />
      
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
