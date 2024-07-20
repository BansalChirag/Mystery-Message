import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";

interface FormSuccessProps{
  message:string | undefined;
}


const FormSuccess = ({ message}: FormSuccessProps) => {
  if(!message) return null;
  return (
    <div className="flex items-center justify-center gap-x-2 text-emerald-500 bg-emerald-500/15 p-3 rounded-md">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};


export default FormSuccess;
