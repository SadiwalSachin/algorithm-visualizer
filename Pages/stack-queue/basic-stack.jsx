"use client"

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";

export default function StackVisualizer() {
  const svgRef = useRef();
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [poppedValue, setPoppedValue] = useState(null);

  // Draw arrows with D3
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    // Draw arrows between consecutive stack elements
    for (let i = 0; i < stack.length - 1; i++) {
      const fromY = 450 - (i * 70) - 30; // Center of current element
      const toY = 450 - ((i + 1) * 70) - 30; // Center of next element
      
      svg
        .append("line")
        .attr("x1", 100) // Center of stack area
        .attr("y1", fromY)
        .attr("x2", 100)
        .attr("y2", toY + 35) // Stop before the next element
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    }
  }, [stack]);

  // Push operation
  const pushStack = () => {
    if (!inputValue.trim()) return;

    const newNode = {
      id: Date.now(),
      value: inputValue,
      index: 0, // New element goes to top (index 0)
    };

    // Update all existing elements to shift down
    setStack((prev) => [newNode, ...prev]);
    setInputValue("");
  };

  // Pop operation
  const popStack = () => {
    if (stack.length === 0) return;
    
    const top = stack[0];
    setPoppedValue(top.value);

    // Remove the top element
    setStack((prev) => prev.slice(1));

    // Clear popped value after 2 seconds
    setTimeout(() => setPoppedValue(null), 2000);
  };

  // Handle Enter key for push
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      pushStack();
    }
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Stack Data Structure Visualizer
        </h1>
        <p className="text-gray-400 text-center mb-8">LIFO - Last In, First Out</p>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Enter value to push"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors w-64"
          />
          <button
            onClick={pushStack}
            disabled={!inputValue.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors min-w-[100px]"
          >
            Push
          </button>
          <button
            onClick={popStack}
            disabled={stack.length === 0}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors min-w-[100px]"
          >
            Pop
          </button>
        </div>

        {/* Stack Info */}
        <div className="text-center mb-6">
          <div className="inline-flex gap-6 bg-gray-800 rounded-lg px-6 py-3">
            <span className="text-blue-400">Size: <span className="font-bold text-white">{stack.length}</span></span>
            <span className="text-green-400">Top: <span className="font-bold text-white">{stack.length > 0 ? stack[0].value : 'Empty'}</span></span>
          </div>
        </div>

        {/* Stack Visualization */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Stack Container */}
            <div className="w-[200px] h-[500px] border-2 border-gray-600 rounded-lg bg-gray-800/30 relative overflow-hidden">
              
              {/* Bottom label */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
                Bottom
              </div>
              
              {/* Top label */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
                Top (Push/Pop here)
              </div>

              {/* SVG for arrows */}
              <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
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

              {/* Stack Elements */}
              {stack.map((node, index) => {
                const yPosition = 450 - (index * 70); // Position from bottom
                return (
                  <div
                    key={node.id}
                    className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out"
                    style={{
                      top: `${500 - yPosition - 60}px`,
                      zIndex: stack.length - index
                    }}
                  >
                    <div className={`w-[160px] h-[60px] rounded-lg shadow-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-400 shadow-blue-500/50' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-500'
                    }`}>
                      <span className="truncate px-2">{node.value}</span>
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-400 text-sm font-semibold">
                        TOP
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty stack message */}
              {stack.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                  Stack is Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popped Value Display */}
        {poppedValue && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-red-500/20 border border-red-500 rounded-lg px-6 py-3">
              <span className="text-red-400 font-semibold">Popped Value: </span>
              <span className="text-white font-bold text-lg">{poppedValue}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">How to use:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Push:</strong> Add a new element to the top of the stack</li>
            <li>• <strong>Pop:</strong> Remove and return the top element from the stack</li>
            <li>• <strong>LIFO:</strong> Last element pushed is the first one to be popped</li>
            <li>• Press Enter in the input field to quickly push a value</li>
          </ul>
        </div>
      </div>
    </div>
  );
}