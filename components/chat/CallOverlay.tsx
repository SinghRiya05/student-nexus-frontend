"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Maximize2, 
  MoreHorizontal,
  User as UserIcon,
  Volume2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as ParticipantType } from './types';

interface CallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantType[];
  initialType: 'audio' | 'video';
}

export const CallOverlay: React.FC<CallOverlayProps> = ({ 
  isOpen, 
  onClose, 
  participants: initialParticipants,
  initialType 
}) => {
  const [callType, setCallType] = useState<'audio' | 'video' | 'screen-share'>(initialType);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(initialType === 'audio');
  const [duration, setDuration] = useState(0);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);

  // Participant mocks for demonstration (if only one is provided)
  const [allParticipants, setAllParticipants] = useState<ParticipantType[]>(initialParticipants);

  useEffect(() => {
    if (initialParticipants.length === 1 && isOpen) {
        // Add some mock participants to show the group feature
        const mocks: ParticipantType[] = [
            ...initialParticipants,
            {
                id: 'm1',
                name: 'Alex Rivera',
                avatar: 'C:\\Users\\theco\\.gemini\\antigravity\\brain\\e6d0742e-6746-46c1-8cb9-d4c3d034c5fd\\group_participant_1_1775638456922.png',
                status: 'online',
                role: 'Designer'
            },
            {
                id: 'm2',
                name: 'Sarah Chen',
                avatar: 'C:\\Users\\theco\\.gemini\\antigravity\\brain\\e6d0742e-6746-46c1-8cb9-d4c3d034c5fd\\group_participant_2_1775638631444.png',
                status: 'online',
                role: 'Developer'
            }
        ];
        setAllParticipants(mocks);
    } else {
        setAllParticipants(initialParticipants);
    }
  }, [initialParticipants, isOpen]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Active Speaker Rotation Mock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
        interval = setInterval(() => {
            setActiveSpeakerIndex(prev => (prev + 1) % allParticipants.length);
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, allParticipants.length]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 grid-rows-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2";
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/30 blur-[120px] rounded-full" />
      </div>

      {/* Main Participant Grid */}
      <div className={cn(
        "absolute inset-0 z-10 p-4 md:p-8 grid gap-4 transition-all duration-500",
        getGridClass(allParticipants.length)
      )}>
        {allParticipants.map((p, idx) => (
          <motion.div 
            key={p.id}
            layout
            className={cn(
              "relative rounded-3xl overflow-hidden bg-white/5 border transition-all duration-500",
              activeSpeakerIndex === idx ? "border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" : "border-white/10"
            )}
          >
            {/* Background (Video Mock or Screen Share Mock) */}
            <div className="absolute inset-0">
               {callType === 'audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <AnimatePresence>
                            {activeSpeakerIndex === idx && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                                />
                            )}
                        </AnimatePresence>
                        <div className="relative z-10 w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl">
                            <img src={p.avatar} className="w-full h-full object-cover" alt={p.name} />
                        </div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-white font-bold text-lg">{p.name}</h4>
                        <p className="text-white/40 text-xs tracking-wider uppercase">{p.role}</p>
                    </div>
                </div>
               ) : (
                <div className="w-full h-full relative">
                    <img 
                      src={idx === 0 ? "C:\\Users\\theco\\.gemini\\antigravity\\brain\\e6d0742e-6746-46c1-8cb9-d4c3d034c5fd\\video_call_participant_1775638161037.png" : p.avatar} 
                      className="w-full h-full object-cover"
                      alt={p.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
               )}
            </div>

            {/* Speaking Indicator Badge */}
            <AnimatePresence>
              {activeSpeakerIndex === idx && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary/40 backdrop-blur-xl border border-primary/50 rounded-full z-20"
                >
                  <div className="flex gap-0.5 items-end h-3">
                    <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Speaking</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name Overlay */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                    {p.name} {idx === 0 && <span className="opacity-50 ml-1 ml-1">(Host)</span>}
                </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Bar Navigation */}
      <div className="absolute top-0 inset-x-0 p-6 md:p-8 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
             <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none mb-1">Group Session</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white/40 text-[10px] md:text-xs font-black tracking-widest uppercase">{formatDuration(duration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white backdrop-blur-md border border-white/5 font-bold text-xs uppercase tracking-widest">
            <Maximize2 className="w-4 h-4" /> Exit Fullscreen
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white backdrop-blur-md border border-white/5">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Self View (Video/Screen Share Mode) - Repositioned for Grid */}
      <AnimatePresence>
        {(callType === 'video' || callType === 'screen-share') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-24 right-4 md:right-8 w-32 md:w-48 h-44 md:h-64 bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-40 group"
          >
            {isCameraOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                  <UserIcon className="w-6 h-6 text-white/30" />
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">You (Paused)</span>
              </div>
            ) : (
                <div className="w-full h-full bg-zinc-800 relative">
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Video className="w-8 h-8 text-white/10 animate-pulse" />
                     </div>
                     <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 rounded text-[8px] font-black text-white backdrop-blur-sm tracking-tighter">PREVIEW</div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Control Dock */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 md:bottom-8 px-6 md:px-8 py-3 md:py-4 bg-[#1a1a1c]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex items-center gap-4 md:gap-8 shadow-2xl z-50 transition-all hover:bg-[#1a1a1c]"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                isMuted ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-white/5 hover:bg-white/10 text-white hover:scale-105"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
          
          <button 
             onClick={() => {
                if (callType === 'audio') {
                    setCallType('video');
                    setIsCameraOff(false);
                } else {
                    setIsCameraOff(!isCameraOff);
                }
             }}
             className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                isCameraOff ? "bg-zinc-700 text-white/50" : "bg-white/5 hover:bg-white/10 text-white hover:scale-105"
            )}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
          </button>

          <button 
            onClick={() => setCallType(callType === 'screen-share' ? 'video' : 'screen-share')}
            className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                callType === 'screen-share' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 hover:bg-white/10 text-white hover:scale-105"
            )}
          >
            <Monitor className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        <div className="flex items-center gap-3">
          <button className="w-12 h-12 md:w-14 md:h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all text-white group">
            <Volume2 className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={onClose}
            className="w-12 h-12 md:w-14 md:h-14 bg-red-500 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-red-500/30 text-white hover:scale-110 active:scale-95 duration-300 group"
          >
            <PhoneOff className="w-5 h-5 md:w-6 md:h-6 rotate-[135deg] group-hover:rotate-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
