"use client";
import { useState } from "react";
import { sendResetPassword } from "../../actions";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyEmail = async () => {
    const result = await sendResetPassword(email);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("Email send successfully! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-[#142F32]">Enter your email to reset password.</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleVerifyEmail}
          className="bg-[#142F32] text-white p-2 rounded w-full"
        >
          Send email
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
