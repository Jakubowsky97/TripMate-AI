"use client";
import { FaLock, FaMap, FaRegFlag } from "react-icons/fa";
import PreferenceCard from "./PreferenceCard";
import { supabase } from "../../../../server/src/config";
import { useEffect } from "react";

// Extend the Window interface to include initializeGoogleLogin
declare global {
  interface Window {
    initializeGoogleLogin: (response: any) => void;
  }
}
import { useRouter } from "next/navigation";
import Script from "next/script";

interface SignUpFormInterface{
    onClick: ()=>void;
}

export function SignUpForm({onClick}: SignUpFormInterface) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
    window.initializeGoogleLogin = (response:any) => {
      console.log('Initializing Google Login')
      window.addEventListener('load', async () => {

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Error getting session', sessionError)
        }

        /* global google */
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential
          });
          
          console.log(signInData);

          if (signInError) {
            console.error('Error signing in with Google', signInError);
          } else {
            router.push('/');
            // add user to session
          }
        } catch (error) {
          console.error('Error signing in with Google', error);
        }
      })
    }
  }
  }, [])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        sessionStorage.setItem('fName', (document.getElementById('fNameField') as HTMLInputElement).value);
        sessionStorage.setItem('lName', (document.getElementById('lNameField') as HTMLInputElement).value);
        sessionStorage.setItem('email', (document.getElementById('emailField') as HTMLInputElement).value);
        onClick();  
      };

      

  return (
            <div className="max-w-md w-full p-8">
              <Script src="https://accounts.google.com/gsi/client"/>
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaRegFlag aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Your details</h2>
                <p className="text-[#51605D]">Please provide your name and email.</p>
              </div>
        
              <div
                id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                data-context="signin"
                data-ux_mode="popup"
                data-callback="initializeGoogleLogin"
                data-auto_select="true"
                data-itp_support="true"
                data-use_fedcm_for_prompt="true"
              ></div>

              <div
                className="g_id_signin"
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
        
              <form>
                <div className="mb-4">
                  <label className="block text-sm text-[#142F32] font-bold mb-1">First name*</label>
                  <input
                    type="text"
                    id="fNameField"
                    placeholder="Enter your first name"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Last name*</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    id="lNameField"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Email*</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    id="emailField"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <button
                  type="submit"
                  className="w-full bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
                <div className="mt-3">
                  <span className="text-[#777C90]">
                    You have an account?{" "}
                    <a href="/auth/login" className="text-[#142F32] hover:text-[#0F2528]">
                      Log in
                    </a>
                  </span>
                </div>
              </form>
            </div>
  );
}

export function SignUpPasswordForm({onClick} : SignUpFormInterface) {
  async function signUpNewUser(email:string, password:string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: '/',
      },
    })
  }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        signUpNewUser(sessionStorage.getItem('email') as string, (document.getElementById('passwordField') as HTMLInputElement).value);
        onClick();  
      };

    return(
        <div className="max-w-md w-full p-8">
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaLock aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Choose a password</h2>
                <p className="text-[#51605D]">Must be at least 8 characters.</p>
              </div>
        
              <form>
                <div className="mb-4">
                  <label className="block text-sm text-[#142F32] font-bold mb-1">Password*</label>
                  <input
                    type="password"
                    placeholder="Choose a password"
                    id="passwordField"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    pattern="/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/"
                    required
                  />
                </div>
        
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Confirm password*</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
              </form>
            </div>
    );
}

export function SignUpPrefForm({onClick} : SignUpFormInterface) {
    const travelPreferences = [
        {
          category: "Travel Interests",
          options: [
            "Adventure",
            "Cultural Exploration",
            "Food & Culinary",
            "Wildlife & Nature",
            "Relaxation",
            "History & Heritage",
          ],
          icons: [
            ""
          ]
        },
        {
          category: "Travel Style",
          options: [
            "Luxury",
            "Budget",
            "Backpacking",
            "Solo Travel",
            "Family Travel",
            "Group Travel",
          ],
        },
        {
          category: "Preferred Transport",
          options: [
            "Airplane",
            "Train",
            "Car Rental",
            "Bus",
            "Bicycle",
            "Walking",
          ],
        },
        {
          category: "Preferred Accommodation",
          options: [
            "Hotels",
            "Hostels",
            "Airbnb",
            "Resorts",
            "Camping",
            "Guesthouses",
          ],
        },
        {
          category: "Favorite Types of Attractions",
          options: [
            "Beaches",
            "Mountains",
            "Historical Sites",
            "Theme Parks",
            "Museums",
            "Nightlife",
          ],
        },
      ];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        onClick();  
      };

    return(
        <div className="max-w-lg w-full p-8">
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaMap aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Set your preferences</h2>
                <p className="text-[#51605D]">Choose your preferences for AI recommendations.</p>
              </div>
        
              <form>
              {travelPreferences.map((category) => (
                <div key={category.category}>
                    <h3 className="text-xl font-semibold text-[#142F32] mb-2 mt-4">{category.category}</h3>
                    <div className="grid grid-cols-2 gap-4">
                    {category.options.map((option) => (
                        <PreferenceCard
                        key={option}
                        option={option}
                        />
                    ))}
                    </div>
                </div>
                ))}

                <button
                  type="submit"
                  className="w-full mt-4 bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
              </form>
            </div>
    );
}