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

// import React from "react";

// interface FormFieldProps {
//   label: string;
//   name: string;
//   type?: string;
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   error?: string;
//   textarea?: boolean;
//   required?: boolean;
//   placeholder?: string;
//   children: React.ReactNode; 
// }
 
// export default function FormField({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   error,
//   placeholder,
//   textarea = false,
//   required = false,

// }: FormFieldProps) {
//   const inputClass = `w-full border p-2 rounded ${error ? "border-red-500" : "border-gray-300"}`;

//   return (
//     <div className="mb-4">
//       <label htmlFor={name} className="block font-medium mb-1">
//         {label} {required && "*"}
//       </label>
//       {textarea ? (
//         <textarea
//           id={name}
//           name={name}
//           value={value ?? ""}
//           onChange={onChange}
//           className={inputClass}
//           rows={4}
//         />
//       ) : (<input
//         id={name}
//         name={name}
//         type={type}
//         value={value ?? ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={inputClass}
//       />
//       )}
      
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// }
