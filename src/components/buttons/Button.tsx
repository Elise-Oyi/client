import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // if you're using a utility like `clsx` or `cn` for class merging

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({
  icon,
  children,
  className,
  variant = 'primary',
  ...props
}: IconButtonProps) {
  const baseStyle = 'inline-flex items-center gap-2 px-20 md:py-2 rounded-md text-sm font-normal transition-colors font-bold';

  const variants = {
    primary: 'bg-sky-800 text-white hover:bg-sky-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}
