
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // For demo purposes only - in real app this would come from auth state
  const isLoggedIn = location.pathname !== "/";
  const isAdmin = true; // For demonstration
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-navy text-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
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
                  onClick={() => console.log("Logout clicked")}
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
                    console.log("Logout clicked");
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
