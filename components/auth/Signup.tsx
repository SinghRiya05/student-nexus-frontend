"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  University, 
  BookOpen, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Zap,
  Globe,
  Monitor,
  Layers,
  Users
} from "lucide-react";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    university: "",
    course: "",
    semester: "",
    role: "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const InputWrapper = ({ icon: Icon, label, children, rightElement }: any) => (
    <div className="space-y-1 w-full">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {Icon && <Icon size={16} />}
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-4 h-full max-h-[90vh]">
      {/* Left Side: Branding & Features */}
      <div className="flex-1 space-y-6 text-center lg:text-left animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
          <GraduationCap className="text-indigo-600" size={16} />
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">StudentNexus Network</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            CONNECT YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
              ACADEMIC WORLD
            </span>
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            The trusted hub for students, alumni, and faculty to collaborate, 
            share resources, and build professional bridges across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">
          <div className="p-4 bg-white/50 border border-slate-100 rounded-2xl space-y-2 hover:border-indigo-200 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Zap size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Performance</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Real-time resource sharing and peer-to-peer collaboration engine.</p>
          </div>
          
          <div className="p-4 bg-white/50 border border-slate-100 rounded-2xl space-y-2 hover:border-emerald-200 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Security</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Enterprise-grade verification using official college credentials.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
              10k+
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Join 10,000+ Verified Students</p>
        </div>
      </div>

      {/* Right Side: Signup Card */}
      <div className="w-full lg:w-[440px] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-[32px] p-6 md:p-8 relative border-white/40 shadow-xl overflow-y-auto max-h-[85vh]">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase">
              Student Registration
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Sparkles className="text-emerald-500" size={12} />
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Create your academic identity</p>
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="grid grid-cols-2 gap-3">
                  <InputWrapper icon={User} label="First Name">
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-xs text-slate-700"
                    />
                  </InputWrapper>
                  <InputWrapper icon={User} label="Last Name">
                    <input 
                      type="text" 
                      placeholder="e.g. Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-xs text-slate-700"
                    />
                  </InputWrapper>
                </div>
                
                <InputWrapper icon={Mail} label="College Email">
                  <input 
                    type="email" 
                    placeholder="name@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-xs text-slate-700"
                  />
                </InputWrapper>

                <InputWrapper icon={Phone} label="Contact Number">
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-xs text-slate-700"
                  />
                </InputWrapper>

                <InputWrapper icon={Lock} label="Secret Password">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-semibold text-xs text-slate-700"
                  />
                </InputWrapper>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <InputWrapper icon={University} label="Academic Institution">
                  <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-xs text-slate-700 appearance-none">
                    <option value="">Select University</option>
                    <option value="du">University of Delhi</option>
                    <option value="iit">IIT Delhi</option>
                    <option value="mu">Mumbai University</option>
                  </select>
                </InputWrapper>

                <InputWrapper icon={BookOpen} label="Course Name">
                  <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-xs text-slate-700 appearance-none">
                    <option value="">Select Course</option>
                    <option value="btech">B.Tech Computer Science</option>
                    <option value="bca">BCA</option>
                    <option value="mtech">M.Tech AI</option>
                  </select>
                </InputWrapper>

                <div className="grid grid-cols-2 gap-3">
                  <InputWrapper icon={Layers} label="Semester">
                    <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-xs text-slate-700 appearance-none">
                      <option value="">Select Sem</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </InputWrapper>
                  <InputWrapper icon={Users} label="Platform Role">
                    <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-xs text-slate-700 appearance-none">
                      <option value="">Select Role</option>
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </InputWrapper>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={step === 2 ? () => alert("Submitting...") : nextStep}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              {step === 2 ? "Initialize Access" : "Proceed to Academic Details"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={10} />
                Previous Section
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100/50 flex flex-col items-center gap-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
              Academic Hub Terminal V1.0.1 <br />
              <span className="text-emerald-500 tracking-normal text-[10px] normal-case mt-0.5 block font-medium">● Encrypted Connection Active</span>
            </p>
            <div className="flex gap-4 text-slate-300">
              <Monitor size={14} />
              <Globe size={14} />
              <ShieldCheck size={14} />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center gap-4">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Authorized Network Only • Access Logged
          </p>
        </div>
      </div>

      {/* Footer Branding for Split Screen */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none opacity-40 hidden lg:block">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
          © 2026 StudentNexus Technologies Group
        </p>
      </div>
    </div>
  );
};

export default Signup;