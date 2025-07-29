"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import Link from "next/link";

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const svgRef = useRef();

  const addNode = () => {
    if (!inputValue.trim()) return;

    const newNode = {
      id: Date.now(),
      value: inputValue,
      x: nodes.length * 100 + 50,
      y: 100,
    };

    setNodes([...nodes, newNode]);
    setInputValue("");
  };

  useEffect(() => {
    if (nodes.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];

      svg
        .append("line")
        .attr("x1", from.x + 60)
        .attr("y1", from.y + 25)
        .attr("x2", to.x)
        .attr("y2", to.y + 25)
        .attr("stroke", "#4ade80")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    }
  }, [nodes]);

  return (
    <div className="min-h-screen bg-zinc-900 py-5 md:py-8">
      <div className="mb-6 ml-6">
        <Link
          href="/visualize/linked-list"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Linked-List
        </Link>
      </div>
      <div className="flex flex-col-reverse md:flex md:flex-row md:px-8 px-3 md:gap-x-8 gap-y-8">
        <div className="mt-8 bg-zinc-300 rounded-lg shadow-md p-6 md:w-[50%]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            About Linked List
          </h3>
          <div className="prose text-gray-600">
            <p>
              A Linked List is a linear data structure where elements are stored
              in nodes, and each node points to the next one. Unlike arrays,
              linked lists do not require contiguous memory and can grow or
              shrink dynamically.
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">
              Structure of a Node:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Data:</strong> Holds the actual value
              </li>
              <li>
                <strong>Pointer:</strong> Reference to the next node in the list
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Types of Linked List:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Singly Linked List:</strong> Each node points to the
                next node only
              </li>
              <li>
                <strong>Doubly Linked List:</strong> Each node has pointers to
                both next and previous nodes
              </li>
              <li>
                <strong>Circular Linked List:</strong> Last node points back to
                the first node
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Operations Supported:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Insert a node at head, tail, or a specific position</li>
              <li>Delete a node from head, tail, or a specific position</li>
              <li>Search for a value in the list</li>
              <li>Reverse the entire list</li>
              <li>Traverse and display the list</li>
            </ol>

            <h4 className="font-semibold mt-4 text-gray-800">
              Key Characteristics:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Dynamic size:</strong> Can grow or shrink at runtime
              </li>
              <li>
                <strong>Efficient insertions/deletions:</strong> Especially at
                beginning or middle
              </li>
              <li>
                <strong>No random access:</strong> Cannot access elements by
                index directly like arrays
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Time Complexity:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Access by index:</strong> O(n)
              </li>
              <li>
                <strong>Insertion/Deletion at head:</strong> O(1)
              </li>
              <li>
                <strong>Insertion/Deletion at tail or middle:</strong> O(n)
              </li>
              <li>
                <strong>Search:</strong> O(n)
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Space Complexity:
            </h4>
            <p>
              O(n), where n is the number of nodes (each node stores data +
              pointer)
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>When frequent insertions/deletions are needed</li>
              <li>When memory allocation should be dynamic</li>
              <li>When data size is unknown in advance</li>
            </ul>
          </div>
        </div>
        <div className="p-6 bg-zinc-900 text-white">
          <h1 className="text-2xl font-bold mb-4">Linked List Visualizer</h1>

          <div className="flex items-center gap-3 mb-6 w-full">
            <input
              type="text"
              className="md:px-4 px-2 py-2 rounded bg-gray-800 text-white border border-gray-700"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter node value"
            />
            <button
              onClick={addNode}
              className="bg-green-500 hover:bg-green-600 md:px-4 px-2 py-2 rounded font-semibold"
            >
              Add Node
            </button>
          </div>

          <div className="relative h-[200px] w-full">
            <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full">
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="10"
                  refY="5"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10" fill="#4ade80" />
                </marker>
              </defs>
            </svg>

            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: node.x, y: node.y }}
                transition={{ duration: 0.5 }}
                className="absolute w-[60px] h-[50px] bg-green-500 text-white flex items-center justify-center rounded shadow-lg"
              >
                {node.value}
              </motion.div>
            ))}
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
