"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const email = params.get("email");

    if (username && email) {
      setUser((prevUser) => ({ ...prevUser, username, email }));
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.newPassword !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/users/resetpassword", {
        username: user.username,
        email: user.email,
        newPassword: user.newPassword,
        token: new URLSearchParams(window.location.search).get("token"),
      });
      console.log("Password reset success", response.data);
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      console.log("Password reset failed", error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <label htmlFor="username">Username</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="username"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
        />
        <label htmlFor="email">Email</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="newPassword"
          type="password"
          value={user.newPassword}
          onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
          placeholder="New Password"
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="confirmPassword"
          type="password"
          value={user.confirmPassword}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          placeholder="Confirm Password"
        />
        <button
          type="submit"
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
