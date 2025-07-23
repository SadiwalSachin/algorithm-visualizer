"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function InsertionSortPage() {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentKey, setCurrentKey] = useState(-1);
  const [comparingIndex, setComparingIndex] = useState(-1);
  const [sortedUpTo, setSortedUpTo] = useState(0);
  const [speed, setSpeed] = useState(100);

  const ARRAY_SIZE = 10;
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 400;
  const MARGIN = { top: 20, right: 20, bottom: 40, left: 40 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

  // Initialize random array
  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: ARRAY_SIZE },
      () => Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setCurrentStep(0);
    setCurrentKey(-1);
    setComparingIndex(-1);
    setSortedUpTo(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  // Initialize array on component mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // D3 visualization
  useEffect(() => {
    if (array.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(array.length))
      .range([0, CHART_WIDTH])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(array)])
      .range([CHART_HEIGHT, 0]);

    // Create bars
    const bars = g
      .selectAll(".bar")
      .data(array)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => CHART_HEIGHT - yScale(d))
      .attr("fill", (d, i) => {
        if (i === currentKey) return "#f59e0b"; // amber for current key
        if (i === comparingIndex) return "#ef4444"; // red for comparing
        if (i <= sortedUpTo) return "#10b981"; // green for sorted portion
        return "#3b82f6"; // blue for unsorted
      })
      .attr("stroke", "#1e40af")
      .attr("stroke-width", 1);

    // Add value labels
    g.selectAll(".label")
      .data(array)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#374151")
      .text((d) => d);

    // Add sorted/unsorted divider line
    if (sortedUpTo > 0 && sortedUpTo < array.length - 1) {
      g.append("line")
        .attr("x1", xScale(sortedUpTo) + xScale.bandwidth())
        .attr("y1", 0)
        .attr("x2", xScale(sortedUpTo) + xScale.bandwidth())
        .attr("y2", CHART_HEIGHT)
        .attr("stroke", "#dc2626")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5,5");
    }

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${CHART_HEIGHT})`)
      .call(d3.axisBottom(xScale).tickFormat((i) => i));

    // Add y-axis
    g.append("g").call(d3.axisLeft(yScale));
  }, [array, currentKey, comparingIndex, sortedUpTo]);

  // Insertion sort algorithm with step-by-step execution
  const insertionSortStep = async (arr, step) => {
    const n = arr.length;
    let currentArray = [...arr];
    let stepCount = 0;

    for (let i = 1; i < n; i++) {
      let key = currentArray[i];
      let j = i - 1;

      // Set current key
      if (stepCount === step) {
        setCurrentKey(i);
        setSortedUpTo(i - 1);
        setComparingIndex(-1);
        return {
          array: currentArray,
          completed: false,
          step: stepCount,
          message: `Selecting key element ${key} at index ${i}`,
        };
      }
      stepCount++;

      // Compare and shift elements
      while (j >= 0 && currentArray[j] > key) {
        if (stepCount === step) {
          setCurrentKey(i);
          setComparingIndex(j);
          setSortedUpTo(i - 1);
          return {
            array: currentArray,
            completed: false,
            step: stepCount,
            message: `Comparing key ${key} with element ${currentArray[j]} at index ${j}`,
          };
        }
        stepCount++;

        // Shift element to the right
        currentArray[j + 1] = currentArray[j];

        if (stepCount === step) {
          setCurrentKey(i);
          setComparingIndex(j);
          setSortedUpTo(i - 1);
          return {
            array: currentArray,
            completed: false,
            step: stepCount,
            message: `Shifting element ${currentArray[j]} to position ${j + 1}`,
          };
        }
        stepCount++;

        j--;
      }

      // Insert key at correct position
      currentArray[j + 1] = key;

      if (stepCount === step) {
        setCurrentKey(-1);
        setComparingIndex(-1);
        setSortedUpTo(i);
        return {
          array: currentArray,
          completed: false,
          step: stepCount,
          message: `Inserting key ${key} at position ${j + 1}`,
        };
      }
      stepCount++;
    }

    // Mark all elements as sorted
    setCurrentKey(-1);
    setComparingIndex(-1);
    setSortedUpTo(n - 1);
    return {
      array: currentArray,
      completed: true,
      step: stepCount,
      message: "Array is fully sorted!",
    };
  };

  // Start/Resume animation
  const startAnimation = async () => {
    setIsRunning(true);
    setIsPaused(false);

    let step = currentStep;
    let currentArray = [...array];

    while (true) {
      if (isPaused) break;

      const result = await insertionSortStep(currentArray, step);

      if (result.completed) {
        setIsRunning(false);
        setCurrentKey(-1);
        setComparingIndex(-1);
        break;
      }

      setArray(result.array);
      setCurrentStep(step + 1);
      step++;

      // Wait for animation speed
      await new Promise((resolve) => setTimeout(resolve, 1000 - speed * 9));
    }
  };

  // Pause animation
  const pauseAnimation = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  // Reset to initial state
  const resetAnimation = () => {
    setIsRunning(false);
    setIsPaused(false);
    generateRandomArray();
  };

  // Step forward
  const stepForward = async () => {
    if (isRunning) return;

    const result = await insertionSortStep(array, currentStep);

    if (!result.completed) {
      setArray(result.array);
      setCurrentStep(currentStep + 1);
    } else {
      setIsRunning(false);
      setCurrentKey(-1);
      setComparingIndex(-1);
    }
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
            About Insertion Sort
          </h3>
          <div className="prose text-gray-600">
            <p>
              Insertion Sort builds the final sorted array one element at a
              time. It works by taking elements from the unsorted portion and
              inserting them into their correct position in the sorted portion.
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">
              Algorithm Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Start with the second element (index 1) as the first element is
                already sorted
              </li>
              <li>
                Compare the current element (key) with elements in the sorted
                portion
              </li>
              <li>Shift larger elements to the right to make space</li>
              <li>Insert the key in its correct position</li>
              <li>Repeat for all remaining elements</li>
            </ol>

            <h4 className="font-semibold mt-4 text-gray-800">
              Key Characteristics:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Stable:</strong> Maintains relative order of equal
                elements
              </li>
              <li>
                <strong>In-place:</strong> Only requires O(1) extra memory
              </li>
              <li>
                <strong>Adaptive:</strong> Performs well on nearly sorted arrays
              </li>
              <li>
                <strong>Online:</strong> Can sort arrays as it receives them
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Time Complexity:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best Case:</strong> O(n) - when array is already sorted
              </li>
              <li>
                <strong>Average Case:</strong> O(n²)
              </li>
              <li>
                <strong>Worst Case:</strong> O(n²) - when array is reverse
                sorted
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Space Complexity:
            </h4>
            <p>O(1) - only uses a constant amount of extra space</p>

            <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Small datasets typically n 50</li>
              <li>Nearly sorted arrays</li>
              <li>When simplicity is preferred over efficiency</li>
              <li>As a subroutine in hybrid algorithms like Quicksort</li>
            </ul>

            {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Visualization Guide:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>Green bars:</strong> Sorted portion of the array</li>
                <li><strong>Amber bar:</strong> Current key being inserted</li>
                <li><strong>Red bar:</strong> Element being compared with the key</li>
                <li><strong>Blue bars:</strong> Unsorted portion</li>
                <li><strong>Dashed line:</strong> Divider between sorted and unsorted portions</li>
              </ul>
            </div> */}
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Insertion Sort Visualization
          </h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={isRunning ? pauseAnimation : startAnimation}
              disabled={sortedUpTo === array.length - 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>

            <button
              onClick={stepForward}
              disabled={isRunning || sortedUpTo === array.length - 1}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Step Forward
            </button>

            <button
              onClick={generateRandomArray}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              Generate New Array
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-4 mb-6 justify-center">
            <label className="text-sm font-medium text-gray-700">Speed:</label>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{speed}%</span>
          </div>

          {/* Algorithm Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Algorithm Status:
            </h3>
            <div className="text-sm text-gray-600">
              <p>Step: {currentStep}</p>
              <p>
                Current Key:{" "}
                {currentKey >= 0
                  ? `${array[currentKey]} (index ${currentKey})`
                  : "None"}
              </p>
              <p>
                Comparing Index:{" "}
                {comparingIndex >= 0 ? `${comparingIndex}` : "None"}
              </p>
              <p>
                Sorted up to: {sortedUpTo}/{array.length - 1}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Sorted Portion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span>Current Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Unsorted</span>
            </div>
          </div>

          {/* Visualization */}
          <div className="flex justify-center">
            <svg
              ref={svgRef}
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              className="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
