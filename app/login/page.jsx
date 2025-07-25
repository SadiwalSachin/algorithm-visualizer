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
import { useAuth } from "@/context/user-context";

const Login = () => {
  const router = useRouter();
  const {setIsLoggedIn} = useAuth()
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`User data trying to sign up :`, user);

    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/users/login", user);
      console.log(`response came from server after login up `, response);
      if (response?.data?.success) {
        router.push("/");
        toast.success("Login successful!");
        localStorage.setItem("token",response?.data?.token)
        setIsLoggedIn(true)
        setIsSubmitting(false);
      } else {
        toast.error(response?.data?.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("login failed. Try again.");
      setIsSubmitting(false);
    }
  };

  const isFormValid = user.email.length > 0 && user.password.length > 0;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-900 px-3">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to Algorithm Visualizer
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
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
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer mb-4"
            type="submit"
          >
            {isSubmitting ? "Login...." : "Login"}
            <BottomGradient />
          </button>
          <p className="text-md flex items-center gap-x-2 mt-2">
            Don't have an account?
            <Link className="text-blue-700" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
