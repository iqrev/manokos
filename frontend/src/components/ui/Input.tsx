'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', containerClassName, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('w-full', containerClassName)}>
        <div className="input-wrapper">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            placeholder=" "
            className={cn(
              'input-field',
              isPassword && 'pr-12',
              error && 'border-red-400',
              className
            )}
            aria-label={label}
            aria-invalid={!!error}
            {...props}
          />
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>

          {/* Eye toggle for password */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-[12px] mt-1 font-500" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
