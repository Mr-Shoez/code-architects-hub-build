
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NavLink from "./navigation/NavLink";
import MobileNavLink from "./navigation/MobileNavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      if (data.session) {
        setIsAdmin(true);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setIsAdmin(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
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

  if (location.pathname === '/' && !isLoggedIn) {
    return null;
  }

  return (
    <nav className="bg-navy text-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href={isLoggedIn ? "/admin" : "/"} className="flex items-center">
              <i className="fas fa-code text-lime text-xl mr-2"></i>
              <span className="font-bold text-xl">codeArchitects</span>
            </a>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <NavLink to="/members" currentPath={location.pathname}>Members</NavLink>
                  <NavLink to="/events" currentPath={location.pathname}>Events</NavLink>
                  <NavLink to="/announcements" currentPath={location.pathname}>Announcements</NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" currentPath={location.pathname}>Admin</NavLink>
                  )}
                </>
              )}
              {!isLoggedIn ? (
                <NavLink to="/" currentPath={location.pathname}>Login</NavLink>
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
        
        {isOpen && (
          <div className="md:hidden py-3 space-y-2">
            {isLoggedIn && (
              <>
                <MobileNavLink 
                  to="/members" 
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Members
                </MobileNavLink>
                <MobileNavLink 
                  to="/events" 
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Events
                </MobileNavLink>
                <MobileNavLink 
                  to="/announcements" 
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Announcements
                </MobileNavLink>
                {isAdmin && (
                  <MobileNavLink 
                    to="/admin" 
                    currentPath={location.pathname}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </MobileNavLink>
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
              <MobileNavLink 
                to="/" 
                currentPath={location.pathname}
                onClick={() => setIsOpen(false)}
              >
                Login
              </MobileNavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
