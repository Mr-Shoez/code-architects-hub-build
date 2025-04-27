
import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavLink = ({ to, currentPath, children }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`py-2 px-3 rounded-md ${
        currentPath === to 
        ? "bg-lime text-navy font-medium" 
        : "text-white hover:bg-navy-700 hover:text-lime"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
