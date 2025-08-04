"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-zinc-900 border-none">
        <div className="px-4 py-10 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-7xl  text-center text-2xl font-bold text-slate-700 md:text-3xl lg:text-6xl dark:text-slate-300 md:leading-tight">
            {"Master DSA Visually – One Algorithm at a Time. Now explore how the web works, understand system design architecture, and visualize your own code in action."

              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block text-white"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-white"
          >
            Explore how sorting and searching algorithms work through engaging,
            step-by-step visualizations. Start with arrays – the foundation of
            DSA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/visualize"
              className="w-80 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-center"
            >
              🚀 Start Exploring DSA Visually
            </Link>
          </motion.div>

          {/* New Section: Visualize Your Own Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="relative z-10 mt-12 max-w-2xl mx-auto text-center"
          >
            <p className="relative z-10 mx-auto max-w-xl text-center text-lg font-normal text-white mb-6">
              Want to see how your own logic runs? Upload your custom algorithm
              and watch it come alive.
            </p>

            <Link
              href="/visualize/custom-code"
              className="w-80 transform rounded-lg bg-black px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-center"
            >
              🛠️ Visualize Your Own Code
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Home;
