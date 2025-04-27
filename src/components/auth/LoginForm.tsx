
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import AuthFormError from "./AuthFormError";
import SubmitButton from "./SubmitButton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const LoginForm = ({ switchTab }: { switchTab: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error details:", error);
        setFormError(error.message);
        toast.error("Login failed");
        return;
      }

      toast.success("Login successful! Redirecting to dashboard...");
      navigate('/admin');
    } catch (error) {
      console.error("Login exception:", error);
      setFormError("An unexpected error occurred during login");
      toast.error("An unexpected error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
        return;
      }

      toast.success("Password reset email sent. Please check your inbox.");
      setResetPasswordOpen(false);
    } catch (error) {
      console.error("Password reset exception:", error);
      toast.error("An unexpected error occurred during password reset");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <AuthFormError error={formError} />
        
        <FormInput
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />
        
        <div>
          <div className="flex justify-between items-center">
            <FormInput
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button 
              type="button" 
              className="text-xs text-navy hover:underline ml-2" 
              onClick={() => setResetPasswordOpen(true)}
            >
              Forgot Password?
            </button>
          </div>
        </div>
        
        <SubmitButton 
          loading={loading}
          text="Log In"
          loadingText="Logging in..."
        />
        
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

      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="py-4">
              <FormInput
                id="reset-email"
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800 mr-2"
                onClick={() => setResetPasswordOpen(false)}
                disabled={resetLoading}
              >
                Cancel
              </button>
              <SubmitButton
                loading={resetLoading}
                text="Send Reset Link"
                loadingText="Sending..."
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
