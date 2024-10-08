import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState)
    }

    return (
      <div className='relative w-full'>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
