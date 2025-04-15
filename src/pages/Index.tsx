
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [stNumber, setStNumber] = useState("");
  const [stNumberError, setStNumberError] = useState("");
  
  const validateStNumber = (value: string) => {
    const regex = /^ST\d{8}$/;
    if (!regex.test(value)) {
      setStNumberError("Student Number must be in format ST12345678");
      return false;
    }
    setStNumberError("");
    return true;
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStNumber(stNumber)) {
      console.log("Registration form submitted");
      // This would connect to Supabase in a real application
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted");
    // This would connect to Supabase in a real application
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-navy text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <i className="fas fa-code text-lime text-xl mr-2"></i>
                <span className="font-bold text-xl">codeArchitects</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
            {/* Hero Section */}
            <div className="md:w-1/2 p-12 bg-navy text-white flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to bluePrintHub</h1>
              <p className="text-xl mb-6">The official platform for the <span className="text-lime font-bold">codeArchitects</span> coding club at Rosebank College.</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-lime text-navy flex items-center justify-center mr-3">
                    <i className="fas fa-users"></i>
                  </div>
                  <p>Connect with fellow coding enthusiasts</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-lime text-navy flex items-center justify-center mr-3">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <p>Stay updated on upcoming events & workshops</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-lime text-navy flex items-center justify-center mr-3">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <p>Collaborate on exciting coding projects</p>
                </div>
              </div>
            </div>
            
            {/* Auth Forms */}
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
              
              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                    <input 
                      type="email" 
                      id="login-email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="your.email@rosebank.edu"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      id="login-password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-navy text-white font-medium py-2 px-4 rounded-md hover:bg-navy/90 transition"
                  >
                    Log In
                  </button>
                  
                  <p className="text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      className="text-navy hover:underline"
                      onClick={() => setActiveTab('register')}
                    >
                      Register here
                    </button>
                  </p>
                </form>
              )}
              
              {/* Registration Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="register-name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                    <input 
                      type="email" 
                      id="register-email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="your.email@rosebank.edu"
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
                      onChange={(e) => setStNumber(e.target.value)}
                      required
                    />
                    {stNumberError && (
                      <p className="mt-1 text-sm text-red-600">{stNumberError}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      id="register-password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="Choose a strong password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input 
                      type="password" 
                      id="register-confirm-password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
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
                      onClick={() => setActiveTab('login')}
                    >
                      Log in here
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-navy text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>
            <i className="fas fa-code mr-2 text-lime"></i>
            codeArchitects - Rosebank College
          </p>
          <p className="text-xs mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
