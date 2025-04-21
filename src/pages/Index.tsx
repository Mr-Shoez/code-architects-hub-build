
import React from "react";
import WelcomeSection from "@/components/auth/WelcomeSection";
import AuthTabs from "@/components/auth/AuthTabs";

const Index = () => {
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
            <WelcomeSection />
            <AuthTabs />
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
