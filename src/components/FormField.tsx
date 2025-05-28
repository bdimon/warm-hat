import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, error, required = false, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        {label} {required && "*"}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
