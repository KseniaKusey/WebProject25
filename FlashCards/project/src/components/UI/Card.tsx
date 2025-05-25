import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent = ({ className, children }: CardContentProps) => {
  return (
    <div
      className={cn(
        'px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-gray-50 border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };