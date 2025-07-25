"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";

const QuickSort = () => {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(intervalId);
  };

  // Generate steps for Quick Sort
  const generateQuickSortSteps = (arr) => {
    const steps = [];

    const partition = (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({ type: "compare", indices: [j, high], array: [...arr] });
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({ type: "swap", indices: [i, j], array: [...arr] });
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({ type: "swap", indices: [i + 1, high], array: [...arr] });
      return i + 1;
    };

    const quickSort = (arr, low, high) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      }
    };

    const arrCopy = [...arr];
    quickSort(arrCopy, 0, arrCopy.length - 1);
    steps.push({ type: "done", array: [...arrCopy] });

    return steps;
  };

  // Render bars
  const renderBars = (arr, highlight = []) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const barWidth = width / arr.length;

    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f9fafb");

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(arr)])
      .range([0, height - 20]);

    svg
      .selectAll("rect")
      .data(arr)
      .join("rect")
      .attr("x", (_, i) => i * barWidth + 5)
      .attr("y", (d) => height - yScale(d))
      .attr("width", barWidth - 10)
      .attr("height", (d) => yScale(d))
      .attr("fill", (_, i) => (highlight.includes(i) ? "#f97316" : "#3b82f6"));

    svg
      .selectAll("text")
      .data(arr)
      .join("text")
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + barWidth / 2)
      .attr("y", (d) => height - yScale(d) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .attr("font-size", "12px");
  };

  // Effect to re-render
  useEffect(() => {
    renderBars(array);
  }, [array]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      renderBars(step.array, step.indices || []);
    }
  }, [currentStep, steps]);

  // Handle Start
  const startAnimation = () => {
    if (isRunning) return;
    const generatedSteps = generateQuickSortSteps(array);
    setSteps(generatedSteps);
    setIsRunning(true);
    const id = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generatedSteps.length - 1) return prev + 1;
        clearInterval(id);
        setIsRunning(false);
        return prev;
      });
    }, 500);
    setIntervalId(id);
  };

  // Pause
  const pauseAnimation = () => {
    setIsPaused(true);
    clearInterval(intervalId);
  };

  // Resume
  const resumeAnimation = () => {
    setIsPaused(false);
    const id = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(id);
        setIsRunning(false);
        return prev;
      });
    }, 500);
    setIntervalId(id);
  };

  // Step forward
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Stop
  const stopAnimation = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    renderBars(array); // Reset to original
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="mb-6 ml-6">
        <Link
          href="/visualize/array"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Array Algorithms
        </Link>
      </div>
      <div className="mx-auto px-4 md:flex md:flex-row flex flex-col gap-y-4 items-start gap-x-10">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            About Quick Sort
          </h3>
          <div className="prose text-gray-600">
            <p>
              Quick Sort is a highly efficient sorting algorithm based on the
              divide-and-conquer approach. It selects a 'pivot' element from the
              array and partitions the remaining elements into two
              subarrays—those less than the pivot and those greater than the
              pivot—and recursively sorts them.
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">
              Algorithm Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose a pivot element from the array</li>
              <li>
                Partition the array into two parts:
                <ul className="list-disc ml-6">
                  <li>Elements less than the pivot</li>
                  <li>Elements greater than the pivot</li>
                </ul>
              </li>
              <li>Recursively apply the above steps to the subarrays</li>
              <li>
                Combine the sorted subarrays and pivot to form the final sorted
                array
              </li>
            </ol>

            <h4 className="font-semibold mt-4 text-gray-800">
              Key Characteristics:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Not Stable:</strong> Does not maintain relative order of
                equal elements
              </li>
              <li>
                <strong>In-place:</strong> Does not require extra space for
                another array
              </li>
              <li>
                <strong>Divide and Conquer:</strong> Recursive, splits problem
                into subproblems
              </li>
              <li>
                <strong>Fast on Average:</strong> Performs better than other
                O(n²) algorithms
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Time Complexity:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best Case:</strong> O(n log n) - balanced partitions
              </li>
              <li>
                <strong>Average Case:</strong> O(n log n)
              </li>
              <li>
                <strong>Worst Case:</strong> O(n²) - when pivot always picks
                smallest/largest
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Space Complexity:
            </h4>
            <p>O(log n) - due to recursive stack space</p>

            <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                When average-case performance matters more than worst-case
              </li>
              <li>When sorting large arrays in memory</li>
              <li>When in-place sorting is required</li>
              <li>For general-purpose use where stability is not needed</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Quick Sort Visualization
            </h2>
            <svg ref={svgRef}></svg>
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                onClick={generateRandomArray}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Generate Array
              </button>
              <button
                onClick={startAnimation}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Start
              </button>
              <button
                onClick={pauseAnimation}
                disabled={!isRunning || isPaused}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Pause
              </button>
              <button
                onClick={resumeAnimation}
                disabled={!isPaused}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Resume
              </button>
              <button
                onClick={stepForward}
                disabled={isRunning}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Step Forward
              </button>
              <button
                onClick={stopAnimation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSort;
