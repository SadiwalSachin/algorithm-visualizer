"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    _id:"",
    username:"",
    email:"",
    createdAt:"",
    isVerified:false
  })

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      localStorage.setItem("token", "");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to logout");
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/about");
      setUser(res?.data?.user);
      toast.success("User data loaded");
      console.log(res?.data?.user);
      
    } catch (err) {
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-xl shadow-lg p-6 space-y-4">
      <Link
      href="/"
      className="text-blue-600"
      >
      Back to home
      </Link>
        <h1 className="text-2xl font-bold text-center">User Profile</h1>
        <hr className="border-gray-600" />

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-600 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-zinc-600 rounded w-5/6 mx-auto"></div>
            <div className="h-4 bg-zinc-600 rounded w-2/3 mx-auto"></div>
          </div>
        ) : user ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Username:</span> {user?.username}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Is Verified:</span> {user?.isVerified ? "true" : "false"}</p>
            <p>
              <span className="font-semibold">User ID:</span>{" "}
              <Link
                href={`/profile/${user._id}`}
                className="text-blue-400 underline"
              >
                {user._id}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No user data loaded</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={getUserDetails}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? "Loading..." : "Load Profile"}
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
