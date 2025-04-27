
import React from 'react';

interface AuthFormErrorProps {
  error: string;
}

const AuthFormError = ({ error }: AuthFormErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
      {error}
    </div>
  );
};

export default AuthFormError;
