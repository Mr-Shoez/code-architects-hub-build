
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    
    console.log("Attempting login with:", { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error details:", error);
        
        // More user-friendly error messages based on error type
        if (error.message === "Invalid login credentials") {
          setFormError("The email or password you entered is incorrect. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setFormError("Please verify your email address before logging in.");
        } else {
          setFormError(error.message);
        }
        
        toast.error("Login failed");
        setLoading(false);
        return;
      }

      console.log("Login successful, user:", data.user);
      
      // Check if user exists in club_members
      const { data: memberData, error: memberError } = await supabase
        .from('club_members')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
        
      if (memberError && memberError.code !== 'PGRST116') {
        console.error("Error checking member status:", memberError);
      }
      
      if (!memberData) {
        console.log("User not found in club_members table");
        // User is authenticated but not in club_members table
        const { data: requestData } = await supabase
          .from('membership_requests')
          .select('*')
          .eq('email', data.user.email)
          .single();
          
        if (requestData && requestData.status === 'pending') {
          toast.info("Your membership request is pending approval. Please check back later.");
        } else if (requestData && requestData.status === 'rejected') {
          toast.error("Your membership request was rejected. Please contact an administrator.");
        } else {
          toast.info("Your account has been created but requires approval. An administrator will review your request.");
          
          // Create a membership request if it doesn't exist
          await supabase.from('membership_requests').insert({
            name: `${data.user.user_metadata.first_name || ''} ${data.user.user_metadata.last_name || ''}`.trim() || email,
            email: data.user.email,
            st_number: data.user.user_metadata.st_number || 'Unknown',
            status: 'pending'
          }).select();
        }
        
        // Sign out since the user is not approved yet
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      // Successful login and user is a member
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
        {formError && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
            {formError}
          </div>
        )}
        
        <div>
          <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input 
            type="email" 
            id="login-email"
            className="w-full mt-1"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
            <button 
              type="button" 
              className="text-xs text-navy hover:underline" 
              onClick={() => setResetPasswordOpen(true)}
            >
              Forgot Password?
            </button>
          </div>
          <Input 
            type="password" 
            id="login-password"
            className="w-full mt-1"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
              <Label htmlFor="reset-email" className="mb-2 block">Email</Label>
              <Input
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                autoComplete="email"
                required
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
              <button
                type="submit"
                className="bg-navy text-white font-medium py-2 px-4 rounded-md hover:bg-navy/90 transition"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
