import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    icon? : React.ReactNode
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type,icon, ...props }, ref) => {
    return (
        <div className={cn("relative", className)}> {/* Wrap the input in a div */}
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && ( /* Render the icon if it's provided */
            <div  className="absolute right-0 top-0">
              {icon}
            </div>
          )}
        </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
