"use client";
import {
  FaLock,
  FaMap,
  FaPlane,
  FaRegEnvelope,
  FaRegFlag,
} from "react-icons/fa";
import PreferenceCard from "./PreferenceCard";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/utils/supabase/client";
import { resendEmailVerification, signup } from "@/app/auth/actions";
import { motion } from "framer-motion";

// Extend the Window interface to include initializeGoogleLogin
declare global {
  interface Window {
    initializeGoogleLogin: (response: any) => void;
  }
}

interface SignUpFormInterface {
  onClick: () => void;
}

export function SignUpForm({ onClick }: SignUpFormInterface) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.initializeGoogleLogin = async (response: any) => {
        const supabase = await createClient();
        console.log("Initializing Google Login");

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting session", sessionError);
        }

        try {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
            });

          if (signInError) {
            console.error("Error signing in with Google", signInError);
          } else {
            router.push(`/auth/register/step-4`);
            localStorage.setItem("user_id", signInData.user.id);
          }
        } catch (error) {
          console.error("Error signing in with Google", error);
        }
      };
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sessionStorage.setItem(
      "fName",
      (document.getElementById("fNameField") as HTMLInputElement).value
    );
    sessionStorage.setItem(
      "lName",
      (document.getElementById("lNameField") as HTMLInputElement).value
    );
    sessionStorage.setItem(
      "email",
      (document.getElementById("emailField") as HTMLInputElement).value
    );
    onClick();
  };

  return (
    <div className="max-w-md w-full p-8">
      {/* Ensure script is fully loaded before calling Google Auth */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => console.log("Google Auth Script Loaded")}
      />

      <div className="flex items-center flex-col mb-4">
        <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaPlane aria-hidden="true" className="size-6 text-[#FFA500]" />
          </motion.div>
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-[#142F32] font-bold mb-1">
            First name*
          </label>
          <input
            type="text"
            id="fNameField"
            placeholder="Enter your first name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-[#142F32] mb-1">
            Last name*
          </label>
          <input
            type="text"
            placeholder="Enter your last name"
            id="lNameField"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-[#142F32] mb-1">
            Email*
          </label>
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
          className="w-full bg-[#FF7F50] text-white py-2 px-4 rounded-md shadow-lg hover:bg-[#FF6347]"
        >
          Continue
        </button>

        <div className="mt-3">
          <span className="text-[#777C90]">
            You have an account?{" "}
            <a
              href="/auth/login"
              className="text-[#142F32] hover:text-[#0F2528]"
            >
              Log in
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}

export function SignUpPasswordForm({ onClick }: SignUpFormInterface) {
  const [email, setEmail] = useState<string | null>(null);
  const [fname, setfname] = useState<string | null>(null);
  const [lname, setlname] = useState<string | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  useEffect(() => {
    setEmail(sessionStorage.getItem("email"));
    setfname(sessionStorage.getItem("fName"));
    setlname(sessionStorage.getItem("lName"));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting password form");

    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    if (!email) {
      alert("No email found. Please go back and enter your email.");
      return;
    }

    if (!fname) {
      alert("No first name found. Please go back and enter your first name.");
      return;
    }

    if (!lname) {
      alert("No last name found. Please go back and enter your last name.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      alert("Passwords do not match. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("fname", fname);
    formData.append("lname", lname);
    sessionStorage.setItem("password", password);

    const data = await signup(formData);
    localStorage.setItem("user_id", data.user?.id as string);

    redirect("/auth/register/step-3");
  };

  const handleConfirmPasswordChange = () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;
    setPasswordsMatch(password === confirmPassword);
  };

  return (
    <div className="max-w-md w-full p-8">
      <div className="flex items-center flex-col mb-8">
        <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
          <FaLock aria-hidden="true" className="size-6 text-[#FFA500]" />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-[#142F32]">
          Choose a password
        </h2>
        <p className="text-[#51605D]">
          Must be at least 8 characters and include one digit.
        </p>
        <p className="text-[#51605D]">
          Must include at least 1 upper case letter.
        </p>
        <p className="text-[#51605D]">
          Must include at least 1 lowercase letter.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-[#142F32] font-bold mb-1">
            Password*
          </label>
          <input
            type="password"
            placeholder="Choose a password"
            id="password"
            name="password"
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
            className="w-full p-2 border rounded-md focus:outline-none invalid:focus:ring-0 focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6] valid:border-green-500 focus:invalid:border-red-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-[#142F32] mb-1">
            Confirm password*
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6] ${
              passwordsMatch
                ? "valid:border-green-500"
                : "border-red-500 focus:ring-0"
            }`}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-[#FF7F50] text-white shadow-lg hover:bg-[#FF6347] py-2 px-4 rounded-md " ${
            passwordsMatch ? "bg-[#FF7F50]" : "bg-[#c7775a]"
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export function ConfirmEmailForm({ onClick }: SignUpFormInterface) {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(sessionStorage.getItem("email"));

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const errorParam = searchParams.get("error");
      setError(errorParam);
    }
  }, []);

  const handleResendEmailVerification: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event?.preventDefault();

    if (!email) {
      alert("No email found. Please go back and enter your email.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    await resendEmailVerification(formData);
  };

  const handleOnClick = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/api/auth/checkVerification");
  };

  return (
    <div className="max-w-md w-full p-8">
      <div className="flex items-center flex-col mb-8">
        <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
          <FaRegEnvelope aria-hidden="true" className="size-6 text-[#FFA500]" />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-[#142F32]">
          Confirm your email
        </h2>
        <p className="text-[#51605D]">
          We&apos;ve sent a confirmation email to your inbox.
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Holy smokes!</strong>
          <span className="block sm:inline">
            {" "}
            {decodeURIComponent(error as string).replace(/\+/g, " ")}
          </span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("error");
              window.history.replaceState({}, "", url.toString());
              window.location.reload();
            }}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <form onSubmit={handleOnClick}>
        <button
          type="submit"
          className="w-full bg-[#FF7F50] text-white shadow-lg hover:bg-[#FF6347] py-2 px-4 rounded-md"
        >
          Continue
        </button>
        <div className="mt-3">
          <span className="text-[#777C90]">
            You haven&apos;t received email?{" "}
            <button
              type="button"
              onClick={handleResendEmailVerification}
              className="text-[#142F32] hover:text-[#0F2528] underline"
            >
              Resend email
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}

export function SignUpPrefForm({ onClick }: SignUpFormInterface) {
  const router = useRouter();
  const [selectedPreferences, setSelectedPreferences] = useState<{
    [key: string]: string[];
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const travelPreferences = [
    {
      category: "travel_interests",
      options: [
        "Adventure",
        "Cultural Exploration",
        "Food & Culinary",
        "Wildlife & Nature",
        "Relaxation",
        "History & Heritage",
      ],
    },
    {
      category: "travel_style",
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
      category: "preferred_transport",
      options: ["Airplane", "Train", "Car Rental", "Bus", "Bicycle", "Walking"],
    },
    {
      category: "preferred_accommodation",
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
      category: "favorite_types_of_attractions",
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

  const handleCheckboxChange = (category: string, option: string) => {
    setSelectedPreferences((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...(prev[category] || []), option],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found!");
      return;
    }
    const preferences = {
      user_id: userId,
      travel_interests: selectedPreferences["travel_interests"] || [],
      travel_style: selectedPreferences["travel_style"] || [],
      preferred_transport: selectedPreferences["preferred_transport"] || [],
      preferred_accommodation:
        selectedPreferences["preferred_accommodation"] || [],
      favorite_types_of_attractions:
        selectedPreferences["favorite_types_of_attractions"] || [],
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/savePreferences`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save preferences");
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/trip/createTrip`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create trip");
        }
        const data = await response.json();
        router.push(`/trip/creator?trip_id=${data.travelData.id}`);
      } catch (err) {
        console.log("Failed to create trip", err);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Saving preferences...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-lg w-full p-8">
      <div className="flex items-center flex-col mb-8">
        <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
          <FaMap aria-hidden="true" className="size-6 text-[#FFA500]" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-[#142F32]">
          Set your preferences
        </h2>
        <p className="text-[#51605D]">
          Choose your preferences for AI recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {travelPreferences.map((category) => (
          <div key={category.category}>
            <h3 className="text-xl font-semibold text-[#142F32] mb-2 mt-4">
              {category.category
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {category.options.map((option) => (
                <PreferenceCard
                  key={option}
                  category={category.category}
                  option={option}
                  onChange={handleCheckboxChange}
                  isChecked={
                    selectedPreferences[category.category]?.includes(option) ||
                    false
                  }
                />
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-4 bg-[#FF7F50] text-white shadow-lg hover:bg-[#FF6347] py-2 px-4 rounded-md"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
