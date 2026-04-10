"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  fullPage = false,
  size = 40,
  className = "",
  label = "Loading content...",
}: LoadingSpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 animate-pulse" />
        
        {/* Animated Spinner */}
        <Loader2 
          size={size} 
          className="text-indigo-600 animate-spin relative z-10" 
          strokeWidth={2.5}
        />
      </div>
      
      {label && (
        <p className="text-sm font-medium text-slate-500 animate-pulse tracking-wide">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white/80 p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white/50 backdrop-blur-md">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[300px] transition-all duration-300">
      {content}
    </div>
  );
}

export default LoadingSpinner;
