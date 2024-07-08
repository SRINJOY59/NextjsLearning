"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      const verifyEmail = async () => {
        setIsLoading(true);
        try {
          await axios.post("/api/users/verifyemail", { token });
          setVerified(true);
        } catch (error: any) {
          setError(error.response?.data?.error || error.message);
          console.log(error.response?.data?.error || error.message);
        } finally {
          setIsLoading(false);
        }
      };

      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
      {isLoading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {verified && !error && (
        <p className="text-green-500">Your email has been verified successfully!</p>
      )}
      {!isLoading && !verified && !error && (
        <p className="text-blue-500">Verifying your email...</p>
      )}
      {verified && (
        <Link href="/login" legacyBehavior>
          <a className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200">
            Login
          </a>
        </Link>
      )}
    </div>
  );
}





