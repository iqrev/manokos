import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    whatsapp: 'btn-whatsapp',
  }[variant];

  const sizeClass = {
    sm: 'text-[13px] px-3 py-2 min-h-[36px]',
    md: 'text-[15px] px-5 py-2.5 min-h-[44px]',
    lg: 'text-[16px] px-6 py-3 min-h-[52px]',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={cn('btn', variantClass, sizeClass, className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Memproses...
        </span>
      ) : children}
    </button>
  );
}
