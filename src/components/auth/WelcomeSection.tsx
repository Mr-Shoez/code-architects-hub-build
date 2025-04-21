
import React from "react";

const WelcomeSection = () => {
  return (
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
  );
};

export default WelcomeSection;
