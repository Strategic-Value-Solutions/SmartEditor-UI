import { cn } from '@/lib/utils'
import * as React from 'react'

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { pressed = false, onPressedChange, className, children, ...props },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(pressed)

    const handleClick = () => {
      const newPressedState = !isPressed
      setIsPressed(newPressedState)
      if (onPressedChange) {
        onPressedChange(newPressedState)
      }
    }

    return (
      <button
        ref={ref}
        aria-pressed={isPressed}
        onClick={handleClick}
        className={cn(
          'px-3 py-1 rounded-full border transition-colors',
          isPressed ? 'bg-blue-500 text-white' : 'bg-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle }
