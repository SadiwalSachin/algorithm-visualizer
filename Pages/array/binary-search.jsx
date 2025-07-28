"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";

const BinarySearch = () => {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [arrayInput, setArrayInput] = useState("");
  const [target, setTarget] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");

  const generateSortedArray = () => {
    const sortedArray = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArray(sortedArray);
    setArrayInput(sortedArray.join(", "));
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setTarget("");
    setError("");
  };

  useEffect(() => {
    generateSortedArray();
  }, []);

  const parseAndSetArray = () => {
    try {
      setError("");
      
      if (!arrayInput.trim()) {
        setError("Please enter an array");
        return false;
      }

      // Parse the array input
      const parsedArray = arrayInput
        .split(",")
        .map(item => {
          const num = parseInt(item.trim());
          if (isNaN(num)) {
            throw new Error("Invalid number in array");
          }
          return num;
        });

      if (parsedArray.length === 0) {
        setError("Array cannot be empty");
        return false;
      }

      // Sort the array for binary search
      const sortedArray = [...parsedArray].sort((a, b) => a - b);
      
      // Check if the original array was already sorted
      const wasAlreadySorted = JSON.stringify(parsedArray) === JSON.stringify(sortedArray);
      
      setArray(sortedArray);
      
      if (!wasAlreadySorted) {
        setError("Array has been automatically sorted for binary search");
        setArrayInput(sortedArray.join(", "));
      }

      setSteps([]);
      setCurrentStep(0);
      setIsRunning(false);
      setIsPaused(false);
      
      return true;
    } catch (err) {
      setError("Please enter valid numbers separated by commas (e.g., 1, 5, 10, 15)");
      return false;
    }
  };

  const generateSteps = (arr, target) => {
    let steps = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ left, right, mid, state: "checking" });

      if (arr[mid] === target) {
        steps.push({ left, right, mid, state: "found" });
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (steps.length > 0 && steps[steps.length - 1].state !== "found") {
      steps.push({ state: "not_found" });
    }

    return steps;
  };

  const drawBars = (step) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const barWidth = Math.min(width / array.length, 60); // Limit bar width for better display
    const actualWidth = barWidth * array.length;

    svg.attr("width", actualWidth).attr("height", height);

    // Calculate max value for scaling
    const maxValue = Math.max(...array);
    const heightScale = maxValue > 0 ? (height - 50) / maxValue : 1;

    svg
      .selectAll("rect")
      .data(array)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * barWidth)
      .attr("y", (d) => height - d * heightScale - 20)
      .attr("width", barWidth - 2)
      .attr("height", (d) => d * heightScale)
      .attr("fill", (d, i) => {
        if (!step || step.state === "not_found") return "#3498db";
        if (i === step.mid && step.state === "checking") return "#f1c40f";
        if (i === step.mid && step.state === "found") return "#2ecc71";
        if (i >= step.left && i <= step.right) return "#e67e22";
        return "#bdc3c7";
      });

    svg
      .selectAll("text")
      .data(array)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + barWidth / 2)
      .attr("y", (d) => height - d * heightScale - 25)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-size", "12px");
  };

  useEffect(() => {
    if (array.length > 0) {
      drawBars(0);
    }
  }, [array]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      drawBars(steps[currentStep]);
    }
  }, [steps, currentStep]);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, currentStep, steps]);

  const startVisualization = () => {
    // First, parse and set the array
    if (!parseAndSetArray()) {
      return;
    }

    const parsedTarget = parseInt(target);
    if (isNaN(parsedTarget)) {
      setError("Enter a valid target number");
      return;
    }

    const newSteps = generateSteps(array, parsedTarget);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    setError("");
  };

  const pauseVisualization = () => {
    setIsPaused(true);
  };

  const resumeVisualization = () => {
    setIsPaused(false);
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    if (array.length > 0) {
      drawBars();
    }
  };

  const stopVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    generateSortedArray();
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-5 md:py-8">
       <div className="mb-6 ml-6">
          <Link
            href="/visualize/array"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Back to Array Algorithms
          </Link>
        </div>
    <div className="flex flex-col md:flex md:flex-row md:px-8 px-3 gap-x-8 gap-y-8"> 
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          About Binary Search
        </h3>
        <div className="prose text-gray-600">
          <p>
            Binary Search is an efficient algorithm for finding an element in a
            sorted array. It works by repeatedly dividing the search interval in
            half. If the target value is equal to the middle element, the search
            is complete. Otherwise, the search continues in the left or right
            half depending on the comparison.
          </p>

          <h4 className="font-semibold mt-4 text-gray-800">Algorithm Steps:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Find the middle element of the sorted array</li>
            <li>Compare the target value with the middle element</li>
            <li>If the target matches, return its index</li>
            <li>If the target is less, search the left sub-array</li>
            <li>If the target is more, search the right sub-array</li>
            <li>
              Repeat until the target is found or the sub-array size becomes 0
            </li>
          </ol>

          <h4 className="font-semibold mt-4 text-gray-800">
            Key Characteristics:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Requires sorted data:</strong> Works only on sorted arrays
            </li>
            <li>
              <strong>Efficient:</strong> Significantly faster than linear
              search for large datasets
            </li>
            <li>
              <strong>Divide-and-conquer:</strong> Reduces search space by half
              each step
            </li>
          </ul>

          <h4 className="font-semibold mt-4 text-gray-800">Time Complexity:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Best Case:</strong> O(1) – when the middle element is the
              target
            </li>
            <li>
              <strong>Average Case:</strong> O(log n)
            </li>
            <li>
              <strong>Worst Case:</strong> O(log n)
            </li>
          </ul>

          <h4 className="font-semibold mt-4 text-gray-800">
            Space Complexity:
          </h4>
          <p>
            O(1) for iterative approach, O(log n) for recursive approach due to
            call stack
          </p>

          <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Searching in large sorted arrays or lists</li>
            <li>When time efficiency is critical</li>
            <li>
              In scenarios where fast lookups are required (e.g., in databases,
              search engines)
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Binary Search Visualizer
        </h2>
        
        {/* Input Section */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Array (comma-separated numbers):
            </label>
            <input
              type="text"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="e.g., 1, 5, 10, 15, 20, 25"
            />
          </div>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target number:
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="px-4 py-2 border rounded-md w-40"
                placeholder="Enter target"
              />
            </div>
            <button
              onClick={generateSortedArray}
              className="md:px-4 md:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Generate Array
            </button>
          </div>
          
          {error && (
            <div className={`text-sm p-2 rounded ${
              error.includes("automatically sorted") 
                ? "bg-yellow-100 text-yellow-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {error}
            </div>
          )}
        </div>

        <svg ref={svgRef}></svg>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <button
            onClick={startVisualization}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Search
          </button>
          <button
            onClick={pauseVisualization}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            onClick={resumeVisualization}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={!isPaused}
          >
            Resume
          </button>
          <button
            onClick={stepForward}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            disabled={currentStep >= steps.length - 1}
          >
            Step Forward
          </button>
          <button
            onClick={resetVisualization}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={stopVisualization}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Stop & Clear
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BinarySearch;