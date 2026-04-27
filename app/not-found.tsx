"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="inline-block mb-8"
        >
          <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10">
            <Ghost className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          The page you're looking for seems to have vanished into the academic void. Don't worry, it happens to the best of us!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="h-12 px-8 rounded-xl font-bold gap-2 border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-xs text-muted-foreground/60 font-medium uppercase tracking-[0.2em]"
      >
        Student Nexus • Advanced Learning Network
      </motion.div>
    </div>
  );
}
