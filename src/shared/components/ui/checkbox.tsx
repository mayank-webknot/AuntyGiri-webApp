import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/shared/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div className={cn(
          "relative w-5 h-5 border-2 border-slate-300 rounded bg-white transition-colors",
          "peer-checked:bg-blue-600 peer-checked:border-blue-600",
          "peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}>
          {checked && (
            <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white" />
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
