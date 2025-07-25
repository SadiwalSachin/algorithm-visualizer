"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verifyUserEmail() {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/verify-email", { token });
      if (response?.data?.success) {
        setVerified(true);
        toast.success(response?.data?.message);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
        toast.error(response?.data?.error);
      }
    } catch (error) {
      setError(true);
      console.log(`error while verifying the use ${error}`);
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold py-2 border-b-2">Welcome to Algorithm Visualizer </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-2">
          Email Verification
        </h2>

        {!verified && !error && (
          <>
            <p className="text-gray-600 mb-6">
              ❗Your email is not verified yet. Please verify to continue.
            </p>
            <button
              onClick={verifyUserEmail}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </>
        )}

        {verified && (
          <>
            <p className="text-green-600 font-medium mb-4">
              ✅ Your email has been successfully verified!
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {error && !verified && (
          <p className="text-red-600 mt-4">
            ❌ Invalid or expired verification link.
          </p>
        )}
      </div>
    </div>
  );
};

export default page;
