import Link from "next/link";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ArrowBigLeft } from "lucide-react";

export default function ArrayVisualizerIndex() {
  const linkedList = [
    {
      title: "Create Linked List",
      description:
        "Start building a linked list from scratch with user inputs.",
      link: "/visualize/linked-list/create",
    },
    {
      title: "Insert at Index",
      description: "Insert a node at a specific index in the list.",
      link: "/visualize/linked-list/insert-node",
    },
    // {
    //   title: "Reverse Linked List",
    //   description: "Reverse the entire linked list and visualize.",
    //   link: "/visualize/linked-list/reverse",
    // },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
    <div className="mx-auto md:px-10">
      <h1 className="md:text-3xl text-2xl font-bold text-center mb-8 text-gray-200">
        Visualize Linked List
      </h1>
      <Link
        href="/visualize"
        className="text-white font-bold ml-4 flex items-center"
      >
        <ArrowBigLeft />
        back
      </Link>
      <div className="mx-auto mt-5">
        <h1 className="md:text-3xl text-xl ml-4 font-bold text-gray-200">
          Working of Linked List
        </h1>
        <HoverEffect items={linkedList} />
      </div>
    </div>
  </div>
  );
}
