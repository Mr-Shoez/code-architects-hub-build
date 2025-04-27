
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}

const FormInput = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = true,
  className = ''
}: FormInputProps) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
      <Input 
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full mt-1 ${error ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
