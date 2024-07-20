import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

interface FormErrorProps{
  message:string | undefined;
}


const FormError = ({ message}: FormErrorProps) => {
  if(!message) return null;
  return (
    <div className="flex items-center justify-center gap-x-2 text-white bg-red-500 p-3 rounded-md">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};


export default FormError;
