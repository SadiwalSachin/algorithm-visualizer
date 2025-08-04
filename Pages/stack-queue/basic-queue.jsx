"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";

export default function QueueVisualizer() {
  const svgRef = useRef();
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dequeuedValue, setDequeuedValue] = useState(null);

  // Draw arrows
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    for (let i = 0; i < queue.length - 1; i++) {
      const fromX = 30 + i * 180 + 130;
      const toX = fromX + 50;
      const yPos = 100;

      svg
        .append("line")
        .attr("x1", fromX)
        .attr("y1", yPos)
        .attr("x2", toX)
        .attr("y2", yPos)
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    }
  }, [queue]);

  // Enqueue (add to left)
  const enqueue = () => {
    if (!inputValue.trim()) return;

    const newNode = {
      id: Date.now(),
      value: inputValue,
    };

    setQueue((prev) => [newNode, ...prev]); // Add at start
    setInputValue("");
  };

  // Dequeue (remove from right)
  const dequeue = () => {
    if (queue.length === 0) return;

    const removed = queue[queue.length - 1];
    setDequeuedValue(removed.value);

    setQueue((prev) => prev.slice(0, -1)); // Remove last item

    setTimeout(() => setDequeuedValue(null), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") enqueue();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-8 px-1 md:px-8">
      <div className="mb-6 ml-2">
        <Link
          href="/visualize/stack-queue"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Stack-Queue
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Queue Data Structure Visualizer
        </h1>
        <p className="text-gray-400 text-center mb-8">
          FIFO - First In, First Out
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Enter value to enqueue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors w-64"
          />
          <button
            onClick={enqueue}
            disabled={!inputValue.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors min-w-[120px]"
          >
            Enqueue
          </button>
          <button
            onClick={dequeue}
            disabled={queue.length === 0}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors min-w-[120px]"
          >
            Dequeue
          </button>
        </div>

        {/* Queue Info */}
        <div className="text-center mb-6">
          <div className="inline-flex gap-6 bg-gray-800 rounded-lg px-6 py-3">
            <span className="text-blue-400">
              Size: <span className="font-bold text-white">{queue.length}</span>
            </span>
            <span className="text-green-400">
              Front:{" "}
              <span className="font-bold text-white">
                {queue.length > 0 ? queue[0].value : "Empty"}
              </span>
            </span>
            <span className="text-yellow-400">
              Rear:{" "}
              <span className="font-bold text-white">
                {queue.length > 0
                  ? queue[queue.length - 1].value
                  : "Empty"}
              </span>
            </span>
          </div>
        </div>

        {/* Queue Visualization */}
        <div className="flex justify-center overflow-x-auto">
          <div className="relative w-max px-5">
            <div className="h-[200px] w-[400px] md:min-w-[600px] border-2 border-gray-600 rounded-lg bg-gray-800/30 relative overflow-hidden flex items-center px-6">
              {/* SVG Arrows */}
              <svg
                ref={svgRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <marker
                    id="arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>

              {/* Queue Elements */}
              {queue.map((node, index) => (
                <div
                  key={node.id}
                  className={`w-[160px] h-[60px] rounded-lg shadow-lg flex items-center justify-center font-bold text-lg transition-all duration-500 mx-2 transform ${
                    index === 0
                      ? "bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-400 shadow-green-500/50"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-500"
                  }`}
                  style={{
                    transition: "transform 0.5s ease-in-out",
                  }}
                >
                  <span className="truncate px-2">{node.value}</span>
                  {index === 0 && (
                    <div className="absolute -top-8 text-green-400 text-sm font-semibold">
                      FRONT
                    </div>
                  )}
                  {index === queue.length - 1 && (
                    <div className="absolute -bottom-8 text-yellow-400 text-sm font-semibold">
                      REAR
                    </div>
                  )}
                </div>
              ))}

              {/* Empty message */}
              {queue.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                  Queue is Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dequeued Value */}
        {dequeuedValue && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-red-500/20 border border-red-500 rounded-lg px-6 py-3">
              <span className="text-red-400 font-semibold">
                Dequeued Value:{" "}
              </span>
              <span className="text-white font-bold text-lg">
                {dequeuedValue}
              </span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-green-400">
            How to use:
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              • <strong>Enqueue:</strong> Add a new element to the front (left) of the queue
            </li>
            <li>
              • <strong>Dequeue:</strong> Remove the element from the rear (right) of the queue
            </li>
            <li>
              • <strong>FIFO:</strong> First element added is the first one to be removed
            </li>
            <li>• Press Enter in the input field to quickly enqueue a value</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
