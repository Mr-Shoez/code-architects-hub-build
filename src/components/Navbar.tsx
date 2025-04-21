
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      
      // For simplicity, assuming all authenticated users have admin access in this demo
      if (data.session) {
        setIsAdmin(true);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setIsAdmin(!!session); // For simplicity in this demo
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  // Don't show navbar on landing page
  if (location.pathname === '/' && !isLoggedIn) {
    return null;
  }

  return (
    <nav className="bg-navy text-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isLoggedIn ? "/admin" : "/"} className="flex items-center">
              <i className="fas fa-code text-lime text-xl mr-2"></i>
              <span className="font-bold text-xl">codeArchitects</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <Link 
                    to="/members" 
                    className={`py-2 px-3 rounded-md ${
                      location.pathname === "/members" 
                      ? "bg-lime text-navy font-medium" 
                      : "text-white hover:bg-navy-700 hover:text-lime"
                    }`}
                  >
                    Members
                  </Link>
                  <Link 
                    to="/events" 
                    className={`py-2 px-3 rounded-md ${
                      location.pathname === "/events" 
                      ? "bg-lime text-navy font-medium" 
                      : "text-white hover:bg-navy-700 hover:text-lime"
                    }`}
                  >
                    Events
                  </Link>
                  <Link 
                    to="/announcements" 
                    className={`py-2 px-3 rounded-md ${
                      location.pathname === "/announcements" 
                      ? "bg-lime text-navy font-medium" 
                      : "text-white hover:bg-navy-700 hover:text-lime"
                    }`}
                  >
                    Announcements
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className={`py-2 px-3 rounded-md ${
                        location.pathname === "/admin" 
                        ? "bg-lime text-navy font-medium" 
                        : "text-white hover:bg-navy-700 hover:text-lime"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
              {!isLoggedIn ? (
                <Link 
                  to="/" 
                  className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition"
                >
                  Login
                </Link>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-lime"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-3 space-y-2">
            {isLoggedIn && (
              <>
                <Link 
                  to="/members" 
                  className={`block py-2 px-3 rounded-md ${
                    location.pathname === "/members" 
                    ? "bg-lime text-navy font-medium" 
                    : "text-white hover:bg-navy-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Members
                </Link>
                <Link 
                  to="/events" 
                  className={`block py-2 px-3 rounded-md ${
                    location.pathname === "/events" 
                    ? "bg-lime text-navy font-medium" 
                    : "text-white hover:bg-navy-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Events
                </Link>
                <Link 
                  to="/announcements" 
                  className={`block py-2 px-3 rounded-md ${
                    location.pathname === "/announcements" 
                    ? "bg-lime text-navy font-medium" 
                    : "text-white hover:bg-navy-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Announcements
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`block py-2 px-3 rounded-md ${
                      location.pathname === "/admin" 
                      ? "bg-lime text-navy font-medium" 
                      : "text-white hover:bg-navy-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 text-white hover:bg-navy-700 rounded-md"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <Link 
                to="/" 
                className="block py-2 px-3 bg-lime text-navy font-medium rounded-md hover:bg-lime/90 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
