"use client";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { FaPlane} from "react-icons/fa";

export function SignInForm() {
    const router = useRouter();
  
    useEffect(() => {
        if (typeof window !== "undefined") {
          window.initializeGoogleLogin = async (response: any) => {
            const supabase = await createClient();
            console.log("Initializing Google Login");
    
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error("Error getting session", sessionError);
            }
    
            try {
              const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
              });
    
              if (signInError) {
                console.error("Error signing in with Google", signInError);
              }

              if (signInData?.session?.access_token) {
                await fetch('/api/auth/loginGoogle', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: signInData.session.access_token }),
                });
                localStorage.setItem("user_id", signInData.user.id);
                router.push("/dashboard");
              }
            } catch (error) {
              console.error("Error signing in with Google", error);
            }
          };
        }
      }, [router]);

      const handleLogin = async (formData: FormData) => {
        console.log("Logging in with email and password");
        const res = await fetch("/api/auth/login", {
          method: "POST",
          body: formData,
        });
        
        console.log("Response from login API:", res);
        if (res.ok) {
          const data = await res.json();
          const userId = res.headers.get("X-user-id");
          localStorage.setItem("user_id", userId || "");
          window.location.href = "/dashboard";
        } else {
          alert("Błędne dane logowania");
        }
      };
      
  
    return (
              <div className="max-w-md w-full p-8">
                <Script src="https://accounts.google.com/gsi/client"/>
                <div className="flex items-center flex-col mb-4">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaPlane aria-hidden="true" className="size-6 text-[#FFA500]" />
                  </motion.div>
                </div>
                  <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Log In</h2>
                  <p className="text-[#51605D]">Please provide your email and password.</p>
                </div>
          
                <div
                  id="g_id_onload"
                  data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                  data-context="signin"
                  data-ux_mode="popup"
                  data-callback="initializeGoogleLogin"
                  data-auto_select="false"
                  data-itp_support="true"
                  data-use_fedcm_for_prompt="true"
                ></div>
  
                <div
                  className="g_id_signin mb-4 flex justify-center"
                  data-type="standard"
                  data-shape="pill"
                  data-theme="outline"
                  data-text="signin_with"
                  data-size="large"
                  data-logo_alignment="left"
                ></div>
  
          
                <div className="flex items-center mb-4">
                  <div className="border-t flex-grow border-[#C6D7C6]"></div>
                  <span className="mx-2 text-[#51605D] text-sm">OR</span>
                  <div className="border-t flex-grow border-[#C6D7C6]"></div>
                </div>
          
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(new FormData(e.currentTarget)); }} className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#142F32] mb-1">Email*</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      id="email"
                      name="email"
                      pattern="^[\w-\.]+@([\w-]+\\.)+[\w-]{2,4}$"
                      className="w-full p-2 border rounded-md focus:outline-none invalid:focus:ring-0 focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6] valid:border-green-500 focus:invalid:border-red-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#142F32] mb-1">Password*</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      id="password"
                      name="password"
                      pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                      className="w-full p-2 border rounded-md focus:outline-none invalid:focus:ring-0 focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6] valid:border-green-500 focus:invalid:border-red-500"
                      required
                    />
                  </div>
          
                  <button
                    type="submit"
                    className="w-full bg-[#FF7F50] text-white py-2 px-4 rounded-md shadow-lg hover:bg-[#FF6347]"
                  >
                    Continue
                  </button>
                  <div className="mt-3">
                    <span className="text-[#777C90]">
                      You don&apos;t have an account?{" "}
                      <Link href="/auth/register" className="text-[#142F32] hover:text-[#0F2528]">
                        Register
                      </Link>
                      {" "}or{" "}
                      <a href="/auth/reset-password/verify-email" className="text-[#142F32] hover:text-[#0F2528]">
                        Reset password
                      </a>
                    </span>
                  </div>
                </form>
              </div>
    );
  }