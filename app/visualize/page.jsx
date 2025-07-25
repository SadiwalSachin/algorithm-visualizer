"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Visualize() {
  const features = [
    {
      title: "Visualize Arrays",
      description:
        "Understand how sorting, searching, and prefix algorithms work through interactive visuals. Start with the foundation of DSA.",
      link: "/array",
    },
    {
      title: "Master Strings",
      description:
        "Explore pattern matching, anagram checks, and sliding window techniques with real-time string manipulation animations.",
      link: "/string",
    },
    {
      title: "Linked List Logic",
      description:
        "See how nodes are connected, traversed, reversed, and manipulated in linked lists—step-by-step.",
      link: "/linked-list",
    },
    {
      title: "Stack & Queue in Action",
      description:
        "Push, pop, enqueue, dequeue—understand the flow of stack and queue operations with animated diagrams.",
      link: "/stack-queue",
    },
    {
      title: "Tree Traversals Made Easy",
      description:
        "From root to leaves, watch how trees are traversed—Inorder, Preorder, Postorder—and more advanced logic.",
      link: "/tree",
    },
    {
      title: "Graph Algorithms",
      description:
        "Visualize graph traversal like BFS, DFS, and shortest paths like Dijkstra’s algorithm. Learn connections, literally.",
      link: "/graph",
    },
    {
      title: "Track Your Progress",
      description:
        "Practice daily and track which algorithms you’ve visualized, understood, or need to revisit.",
      link: "/progress",
    },
  ];

  return (
    <div className="bg-zinc-900 min-h-screen md:px-10 px-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 mx-auto ">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({ title, description, index, link }) => {
  const router = useRouter();

  function handleNavigate() {
    router.push(`visualize/${link}`);
  }

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800 cursor-pointer bg-zinc-200",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export default Visualize;
