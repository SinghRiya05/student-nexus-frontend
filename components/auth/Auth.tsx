"use client";

import Login from "./Login";
import Signup from "./Signup";

const Auth = ({ mode }: { mode: "login" | "signup" }) => {
  return (
    <div className="h-screen w-full overflow-hidden">
      {mode === "login" ? <Login /> : <Signup />}
    </div>
  );
}

export default Auth;