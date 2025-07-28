"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Link from "next/link";

const MergeSort = () => {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const intervalRef = useRef(null);

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
    setOriginalArray(newArray);
    setCurrentStep(0);
    setSteps([]);
    setIsRunning(false);
    setIsPaused(false);
  };

  // D3 visualization
  useEffect(() => {
    if (!array.length) return;

    const w = 300;
    const h = 300;

    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h);

    svg.selectAll("*").remove();

    const barWidth = w / array.length;

    svg
      .selectAll("rect")
      .data(array)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * barWidth)
      .attr("y", (d) => h - d * 3)
      .attr("width", barWidth - 2)
      .attr("height", (d) => d * 3)
      .attr("fill", (_, i) => {
        if (!steps[currentStep]) return "steelblue";
        const step = steps[currentStep];
        if (step.type === "compare" && step.indices.includes(i))
          return "orange";
        if (step.type === "overwrite" && step.index === i) return "red";
        return "steelblue";
      });

    svg
      .selectAll("text")
      .data(array)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + barWidth / 4)
      .attr("y", (d) => h - d * 3 - 5)
      .attr("fill", "black");
  }, [array, currentStep, steps]);

  // Generate merge sort steps
  const generateMergeSortSteps = (arr) => {
    const a = [...arr];
    const mergeSteps = [];

    const merge = (arr, l, m, r) => {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;

      while (i < left.length && j < right.length) {
        mergeSteps.push({
          type: "compare",
          indices: [l + i, m + 1 + j],
          array: [...arr],
        });

        if (left[i] <= right[j]) {
          arr[k] = left[i];
          mergeSteps.push({
            type: "overwrite",
            index: k,
            value: left[i],
            array: [...arr],
          });
          i++;
        } else {
          arr[k] = right[j];
          mergeSteps.push({
            type: "overwrite",
            index: k,
            value: right[j],
            array: [...arr],
          });
          j++;
        }
        k++;
      }

      while (i < left.length) {
        arr[k] = left[i];
        mergeSteps.push({
          type: "overwrite",
          index: k,
          value: left[i],
          array: [...arr],
        });
        i++;
        k++;
      }

      while (j < right.length) {
        arr[k] = right[j];
        mergeSteps.push({
          type: "overwrite",
          index: k,
          value: right[j],
          array: [...arr],
        });
        j++;
        k++;
      }
    };

    const mergeSort = (arr, l, r) => {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    };

    mergeSort(a, 0, a.length - 1);
    mergeSteps.push({ type: "completed", array: [...a] });
    return mergeSteps;
  };

  // Start animation
  const startAnimation = () => {
    const generatedSteps = generateMergeSortSteps(array);
    setSteps(generatedSteps);
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= generatedSteps.length) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return prev;
        }
        setArray(generatedSteps[nextStep].array);
        return nextStep;
      });
    }, 300);
  };

  // Pause/Resume
  const togglePause = () => {
    if (isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep >= steps.length) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return prev;
          }
          setArray(steps[nextStep].array);
          return nextStep;
        });
      }, 300);
    } else {
      clearInterval(intervalRef.current);
    }
    setIsPaused(!isPaused);
  };

  // Step forward manually
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setArray(steps[next].array);
    }
  };

  // Stop animation
  const stopAnimation = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setArray(originalArray);
  };

  // Reset
  const reset = () => {
    clearInterval(intervalRef.current);
    generateRandomArray();
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

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
      <div className="mx-auto px-4 md:flex md:flex-row flex flex-col gap-y-8 gap-x-10">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            About Merge Sort
          </h3>
          <div className="prose text-gray-600">
            <p>
              Merge Sort is a divide-and-conquer algorithm that divides the
              array into halves, recursively sorts them, and then merges the
              sorted halves to produce a fully sorted array. It guarantees
              stable and efficient sorting.
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">
              Algorithm Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Divide the array into two halves</li>
              <li>Recursively sort both halves</li>
              <li>Merge the sorted halves into a single sorted array</li>
              <li>Repeat until the entire array is sorted</li>
            </ol>

            <h4 className="font-semibold mt-4 text-gray-800">
              Key Characteristics:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Stable:</strong> Maintains the relative order of equal
                elements
              </li>
              <li>
                <strong>Not In-place:</strong> Requires O(n) extra memory for
                merging
              </li>
              <li>
                <strong>Divide and Conquer:</strong> Breaks problems into
                smaller parts
              </li>
              <li>
                <strong>Consistent Performance:</strong> Performs well on all
                kinds of inputs
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Time Complexity:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best Case:</strong> O(n log n)
              </li>
              <li>
                <strong>Average Case:</strong> O(n log n)
              </li>
              <li>
                <strong>Worst Case:</strong> O(n log n)
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Space Complexity:
            </h4>
            <p>O(n) - requires additional memory for merging</p>

            <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>When guaranteed O(n log n) performance is needed</li>
              <li>When working with large datasets</li>
              <li>For external sorting (like sorting data on disk)</li>
              <li>When stability in sorting is important</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Merge Sort Visualizer
            </h2>

            <div className="flex justify-center">
              <svg ref={svgRef}></svg>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={startAnimation}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Start
              </button>

              <button
                onClick={togglePause}
                disabled={!isRunning}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>

              <button
                onClick={stepForward}
                disabled={isRunning || currentStep >= steps.length - 1}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Step Forward
              </button>

              <button
                onClick={stopAnimation}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Stop
              </button>

              <button
                onClick={reset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSort;
