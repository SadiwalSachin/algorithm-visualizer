"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BottomGradient } from "@/components/ui/bottom-gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`User data trying to sign up :`,user);

    if (!user.username || !user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/users/sign-up", user);
      console.log(`response came from server after sign up `,response);
      if(response?.data?.success){
        toast.success("Signup successful!");
        router.push("/login")
        setIsSubmitting(false)
      } else {
        toast.success(response?.data?.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error(err?.message);
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    user.username.length > 0 &&
    user.email.length > 0 &&
    user.password.length > 0;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-900 px-2">
      <div className="shadow-input md:mx-auto w-full md:max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to Algorithm Visualizer
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="username">Username</Label>
            <Input
              value={user.username}
              onChange={handleChange}
              name="username"
              id="username"
              placeholder="username"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              value={user.email}
              onChange={handleChange}
              name="email"
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={user.password}
              onChange={handleChange}
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </LabelInputContainer>
          <button
            disabled={!isFormValid || isSubmitting}
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer mb-2"
            type="submit"
          >
            {isSubmitting ? "Signing up " : "Sign up"}
            <BottomGradient />
          </button>
          <p className="text-md flex items-center gap-x-2 mt-2">
          Already have an account? Login
          <Link className="text-blue-700" href="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
