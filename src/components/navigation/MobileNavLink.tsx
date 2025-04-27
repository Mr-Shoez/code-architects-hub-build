
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileNavLinkProps {
  to: string;
  currentPath: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, currentPath, onClick, children }: MobileNavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`block py-2 px-3 rounded-md ${
        currentPath === to 
        ? "bg-lime text-navy font-medium" 
        : "text-white hover:bg-navy-700"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default MobileNavLink;
