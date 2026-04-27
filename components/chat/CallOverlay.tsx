"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Maximize2,
  Users,
  Settings,
  MoreHorizontal,
  Volume2,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as ParticipantType } from './types';
import { 
  getSocket, 
  emitCallUser, 
  emitAnswerCall, 
  emitIceCandidate, 
  emitEndCall, 
  emitScreenShareToggle, 
  onCallAccepted, 
  onReceiveIceCandidate, 
  onCallEnded, 
  onScreenShareStatus 
} from '@/services/socket';
import { toast } from 'react-hot-toast';

interface CallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantType[];
  initialType: 'audio' | 'video';
  incomingSignal?: any;
  callerId?: string;
  isIncoming?: boolean;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    }
  ]
};

export const CallOverlay: React.FC<CallOverlayProps> = ({ 
  isOpen, 
  onClose,
  incomingSignal,
  callerId,
  isIncoming = false,
  participants,
  initialType
}) => {
  const [callType, setCallType] = useState<'audio' | 'video' | 'screen-share'>(initialType);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(initialType === 'audio');
  const [duration, setDuration] = useState(0);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'answering' | 'connected'>('idle');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateBufferRef = useRef<any[]>([]);

  const setLocalVideoRef = useCallback((node: HTMLVideoElement | null) => {
    localVideoRef.current = node;
    if (node) {
      const targetStream = callType === 'screen-share' && screenStreamRef.current ? screenStreamRef.current : localStreamRef.current;
      if (node.srcObject !== targetStream) {
        node.srcObject = targetStream;
      }
    }
  }, [callType]);

  const setRemoteVideoRef = useCallback((node: HTMLVideoElement | null) => {
    remoteVideoRef.current = node;
    if (node && remoteStreamRef.current && node.srcObject !== remoteStreamRef.current) {
      node.srcObject = remoteStreamRef.current;
    }
  }, []);

  const [allParticipants, setAllParticipants] = useState<ParticipantType[]>(participants);

  const targetUserId = participants[0]?.id;
  const socket = getSocket();

  // --- INITIALIZE CALL ---
  useEffect(() => {
    if (!isOpen) return;

    const socket = getSocket();
    const handleIce = (candidate: any) => {
       if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
           peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(()=>{});
       } else {
           iceCandidateBufferRef.current.push(candidate);
       }
    };
    
    if (socket) {
       socket.on("ice_candidate", handleIce);
       socket.on("call_ended", () => { toast("Call ended"); onClose(); });
       socket.on("screen_share_status", ({ isSharing }) => {
          if (isSharing) setCallType('screen-share');
          else setCallType(initialType);
       });
    }

    if (isIncoming && incomingSignal && callerId) {
      setCallStatus('idle'); // Wait for user to accept
    } else {
      handleStartCall();
    }

    return () => {
      if (socket) {
         socket.off("ice_candidate", handleIce);
         socket.off("call_ended");
         socket.off("screen_share_status");
      }
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    setDuration(0);
    setCallStatus('idle');
  };

  const setupPeerConnection = (stream: MediaStream, targetId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const hasVideo = stream.getVideoTracks().length > 0;
    if (!hasVideo) {
      pc.addTransceiver('video', { direction: 'sendrecv' });
    }

    pc.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setCallStatus('connected');
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        emitIceCandidate({ to: targetId, candidate: event.candidate });
      }
    };

    return pc;
  };

  const handleStartCall = async () => {
    try {
      setCallStatus('calling');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: initialType === 'video', 
        audio: true 
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = setupPeerConnection(stream, targetUserId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      emitCallUser({
        userToCall: targetUserId,
        signalData: offer,
        from: socket?.id || '',
        name: 'Me', // Should get from auth state if needed
        type: initialType
      });

      // Listen for acceptance
      onCallAccepted(async (signal) => {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        setCallStatus('connected');
        
        // Process buffered candidates
        iceCandidateBufferRef.current.forEach(c => {
           pc.addIceCandidate(new RTCIceCandidate(c)).catch(()=>{});
        });
        iceCandidateBufferRef.current = [];
      });

    } catch (err) {
      console.error("Error starting call:", err);
      toast.error("Could not access camera/microphone");
      onClose();
    }
  };

  const handleAnswerCall = async () => {
    try {
      setCallStatus('answering');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: initialType === 'video', 
        audio: true 
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = setupPeerConnection(stream, callerId!);

      await pc.setRemoteDescription(new RTCSessionDescription(incomingSignal));
      
      // Process buffered candidates
      iceCandidateBufferRef.current.forEach(c => {
         pc.addIceCandidate(new RTCIceCandidate(c)).catch(()=>{});
      });
      iceCandidateBufferRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      emitAnswerCall({ to: callerId!, signal: answer });
      setCallStatus('connected');

    } catch (err) {
      console.error("Error answering call:", err);
      onClose();
    }
  };

  const handleEndCall = () => {
    emitEndCall({ to: isIncoming ? callerId! : targetUserId });
    onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  const handleScreenShare = async () => {
    if (callType === 'screen-share') {
      // Stop sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current && peerConnectionRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        const videoTransceiver = peerConnectionRef.current.getTransceivers().find(t => t.receiver.track.kind === 'video');
        if (videoTransceiver && videoTransceiver.sender && videoTrack) {
          videoTransceiver.sender.replaceTrack(videoTrack);
        }
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
      setCallType(initialType);
      emitScreenShareToggle({ to: isIncoming ? callerId! : targetUserId, isSharing: false });
    } else {
      // Start sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        const screenTrack = stream.getVideoTracks()[0];

        if (peerConnectionRef.current) {
          const videoTransceiver = peerConnectionRef.current.getTransceivers().find(t => t.receiver.track.kind === 'video');
          if (videoTransceiver && videoTransceiver.sender) {
            videoTransceiver.sender.replaceTrack(screenTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setCallType('screen-share');
        emitScreenShareToggle({ to: isIncoming ? callerId! : targetUserId, isSharing: true });

        screenTrack.onended = () => {
          handleScreenShare(); // Toggle back
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  useEffect(() => {
    setAllParticipants(participants);
  }, [participants, isOpen]);

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

  if (isIncoming && callStatus === 'idle') {
     return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/30 blur-[120px] rounded-full" />
        </div>
        
        <div className="z-10 flex flex-col items-center">
            <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-4 border-primary/50 overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] mb-8 flex items-center justify-center bg-primary/10"
            >
                {participants[0]?.avatar ? (
                    <img src={participants[0].avatar} alt="Caller" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-5xl font-black text-primary uppercase">
                        {participants[0]?.name?.charAt(0) || '?'}
                    </span>
                )}
            </motion.div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">{participants[0]?.name}</h2>
            <p className="text-white/50 uppercase tracking-widest font-bold text-sm mb-12">
               Incoming {initialType} call...
            </p>
            
            <div className="flex gap-8">
               <button 
                 onClick={handleEndCall}
                 className="flex flex-col items-center gap-3 group"
               >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                     <PhoneOff className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/50 uppercase tracking-wider group-hover:text-red-400 transition-colors">Decline</span>
               </button>
               
               <button 
                 onClick={handleAnswerCall}
                 className="flex flex-col items-center gap-3 group"
               >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform animate-bounce">
                     <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/50 uppercase tracking-wider group-hover:text-green-400 transition-colors">Accept</span>
               </button>
            </div>
        </div>
      </motion.div>
     );
  }

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
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-zinc-900">
                    <div className="relative">
                        <AnimatePresence>
                            {(callStatus === 'connected' && activeSpeakerIndex === idx) && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                                />
                            )}
                        </AnimatePresence>
                        <div className="relative z-10 w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center bg-zinc-800">
                            {p.avatar ? (
                                <img src={p.avatar} className="w-full h-full object-cover" alt={p.name} />
                            ) : (
                                <span className="text-4xl md:text-5xl font-black text-white/20 uppercase">{p.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-white font-bold text-lg">{p.name}</h4>
                        <p className="text-white/40 text-xs tracking-wider uppercase">{p.role}</p>
                        <p className="text-primary/60 text-[10px] font-black mt-2">
                          {callStatus === 'calling' ? 'DIALING...' : callStatus === 'connected' ? 'CONNECTED' : 'WAITING...'}
                        </p>
                    </div>
                </div>
               ) : (
                <div className="w-full h-full relative bg-black">
                    <video 
                      ref={setRemoteVideoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
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
            {isCameraOff && callType !== 'screen-share' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                   {participants[0]?.avatar ? (
                       <img src={participants[0].avatar} className="w-full h-full object-cover" alt="me" />
                   ) : (
                       <span className="text-xl font-bold text-white/20 uppercase">
                           {participants[0]?.name?.charAt(0) || '?'}
                       </span>
                   )}
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">You (Paused)</span>
              </div>
            ) : (
                <div className="w-full h-full bg-zinc-800 relative">
                     <video 
                        ref={setLocalVideoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover" 
                      />
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
            onClick={toggleMute}
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
                    toggleCamera();
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
            onClick={handleScreenShare}
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
            onClick={handleEndCall}
            className="w-12 h-12 md:w-14 md:h-14 bg-red-500 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-red-500/30 text-white hover:scale-110 active:scale-95 duration-300 group"
          >
            <PhoneOff className="w-5 h-5 md:w-6 md:h-6 rotate-[135deg] group-hover:rotate-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
