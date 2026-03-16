"use client";

import Login from "./Login";
import Signup from "./Signup";
import OtpVerificationPage from "./OtpVerification";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";

type AuthMode = "login" | "signup" | "verify-otp"|"reset-password"|"forgot-password";
type OtpType = "signup" | "reset-password";

const Auth = ({ mode,type }: { mode: AuthMode ,type?:OtpType}) => {
  return (
    <div className="h-screen w-full overflow-hidden">
      {mode === "login" && <Login />}
      {mode === "signup" && <Signup />}
      {mode === "verify-otp" && <OtpVerificationPage type={type||"signup"} />}
      {mode==="reset-password" && <ResetPassword/>}
      {mode==="forgot-password" &&<ForgotPassword/>}
    </div>
  );
};

export default Auth;