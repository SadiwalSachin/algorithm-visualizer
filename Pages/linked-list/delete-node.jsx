"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import Link from "next/link";

export default function DeleteNodeVisualizer() {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([
    { id: 1, value: "10", x: 50, y: 100 },
    { id: 2, value: "20", x: 150, y: 100 },
    { id: 3, value: "30", x: 250, y: 100 },
    { id: 4, value: "40", x: 350, y: 100 },
  ]);
  const [position, setPosition] = useState("");
  const [pointerPos, setPointerPos] = useState(0);

  useEffect(() => {
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
        .attr("stroke", "#f87171")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    }
  }, [nodes]);

  const deleteNode = async () => {
    const pos = parseInt(position);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) return;

    // Animate pointer to the position
    for (let i = 0; i <= pos; i++) {
      await new Promise((resolve) => {
        setPointerPos(i);
        setTimeout(resolve, 500);
      });
    }

    // Remove the node and shift others
    const updated = nodes
      .filter((_, index) => index !== pos)
      .map((node, index) => ({
        ...node,
        x: index * 100 + 50,
      }));

    setNodes(updated);
    setPosition("");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-8 px-4 md:px-8">
      <div className="mb-6 ml-6">
        <Link
          href="/visualize/linked-list"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Linked-List
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Delete Node in Linked List</h1>
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600"
        />
        <button
          onClick={deleteNode}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
        >
          Delete
        </button>
      </div>

      <div className="relative h-[200px] w-full overflow-x-auto">
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
              <path d="M0,0 L10,5 L0,10" fill="#f87171" />
            </marker>
          </defs>
        </svg>

        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: node.x, y: node.y }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-[60px] h-[50px] bg-red-500 text-white flex items-center justify-center rounded shadow-lg"
            >
              {node.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Moving Pointer */}
        {pointerPos < nodes.length + 1 && (
          <motion.div
            animate={{ x: pointerPos * 100 + 50, y: 50 }}
            transition={{ duration: 0.4 }}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
          ></motion.div>
        )}
      </div>
    </div>
  );
}
