"use client"

import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between px-4 py-4 border-b bg-zinc-900">
      <div className="flex items-center gap-2">
        <Link
        href="/"
        className="text-base text-white font-bold md:text-2xl">AI Visualizer</Link>
      </div>
      {/* <Link
      href={"/login"}
      className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-center">
        Login
      </Link> */}
    </nav>
  );
};