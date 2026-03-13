"use client";

import Login from "./Login";
import Signup from "./Signup";
import { useSearchParams } from "next/navigation";

const Auth = ({ mode }: { mode: "login" | "signup" }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center light-mesh-bg grid-overlay px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative center orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-h-full flex items-center justify-center">
        {mode === "login" ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default Auth;