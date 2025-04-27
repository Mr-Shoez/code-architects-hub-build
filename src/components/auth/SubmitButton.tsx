
import React from 'react';
import { Loader } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  loadingText?: string;
  text: string;
}

const SubmitButton = ({ loading, disabled, loadingText = 'Processing...', text }: SubmitButtonProps) => {
  return (
    <button 
      type="submit"
      className={`w-full font-medium py-2 px-4 rounded-md transition ${
        !disabled 
          ? 'bg-lime text-navy hover:bg-lime/90' 
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
