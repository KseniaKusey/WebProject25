import React from 'react';
import { cn } from '../../utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, fullWidth = false, ...props }, ref) => {
    return (
      <div className={cn('mb-4', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
            'text-sm min-h-[100px]',
            error && 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;