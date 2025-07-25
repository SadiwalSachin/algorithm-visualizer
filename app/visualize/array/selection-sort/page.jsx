"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Link from "next/link";

const SelectionSort = () => {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [minIndex, setMinIndex] = useState(-1);
  const [comparingIndex, setComparingIndex] = useState(-1);
  const [sortedUpTo, setSortedUpTo] = useState(-1);
  const [speed, setSpeed] = useState(100);

  const ARRAY_SIZE = 7;
  const SVG_WIDTH = 300;
  const SVG_HEIGHT = 400;
  const MARGIN = { top: 20, right: 20, bottom: 40, left: 40 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: ARRAY_SIZE },
      () => Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setCurrentStep(0);
    setMinIndex(-1);
    setComparingIndex(-1);
    setSortedUpTo(-1);
    setIsRunning(false);
    setIsPaused(false);
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

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

    g.selectAll(".bar")
      .data(array)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => CHART_HEIGHT - yScale(d))
      .attr("fill", (d, i) => {
        if (i <= sortedUpTo) return "#10b981";
        if (i === minIndex) return "#f59e0b";
        if (i === comparingIndex) return "#ef4444";
        return "#3b82f6";
      })
      .attr("stroke", "#1e40af")
      .attr("stroke-width", 1);

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

    g.append("g")
      .attr("transform", `translate(0,${CHART_HEIGHT})`)
      .call(d3.axisBottom(xScale).tickFormat((i) => i));

    g.append("g").call(d3.axisLeft(yScale));
  }, [array, minIndex, comparingIndex, sortedUpTo]);

  const selectionSortStep = async (arr, step) => {
    const n = arr.length;
    let currentArray = [...arr];
    let stepCount = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (stepCount === step) {
          setMinIndex(minIdx);
          setComparingIndex(j);
          setSortedUpTo(i - 1);
          return { array: currentArray, completed: false };
        }
        stepCount++;
        if (currentArray[j] < currentArray[minIdx]) minIdx = j;
      }

      [currentArray[i], currentArray[minIdx]] = [
        currentArray[minIdx],
        currentArray[i],
      ];

      if (stepCount === step) {
        setMinIndex(-1);
        setComparingIndex(-1);
        setSortedUpTo(i);
        return { array: currentArray, completed: false };
      }
      stepCount++;
    }

    setMinIndex(-1);
    setComparingIndex(-1);
    setSortedUpTo(n - 1);
    return { array: currentArray, completed: true };
  };

  const startAnimation = async () => {
    setIsRunning(true);
    setIsPaused(false);

    let step = currentStep;
    let currentArray = [...array];

    while (true) {
      if (isPaused) break;

      const result = await selectionSortStep(currentArray, step);
      if (result.completed) {
        setIsRunning(false);
        break;
      }

      setArray(result.array);
      setCurrentStep(step + 1);
      step++;
      await new Promise((resolve) => setTimeout(resolve, 1000 - speed * 9));
    }
  };

  const pauseAnimation = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetAnimation = () => {
    setIsRunning(false);
    setIsPaused(false);
    generateRandomArray();
  };

  const stepForward = async () => {
    if (isRunning) return;
    const result = await selectionSortStep(array, currentStep);
    if (!result.completed) {
      setArray(result.array);
      setCurrentStep(currentStep + 1);
    } else {
      setIsRunning(false);
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
      <div className="mx-auto px-4 md:flex md:flex-row flex flex-col gap-y-8 gap-x-10">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            About Selection Sort
          </h3>
          <div className="prose text-gray-600">
            <p>
              Selection Sort is a simple comparison-based sorting algorithm. It
              works by dividing the array into a sorted and unsorted part, and
              repeatedly selecting the smallest (or largest) element from the
              unsorted part and moving it to the end of the sorted part.
            </p>

            <h4 className="font-semibold mt-4 text-gray-800">
              Algorithm Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start from the first element of the array</li>
              <li>Find the minimum element in the unsorted portion</li>
              <li>Swap the minimum element with the first unsorted element</li>
              <li>
                Move the boundary between sorted and unsorted one step right
              </li>
              <li>Repeat until the entire array is sorted</li>
            </ol>

            <h4 className="font-semibold mt-4 text-gray-800">
              Key Characteristics:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Not Stable:</strong> May change the relative order of
                equal elements
              </li>
              <li>
                <strong>In-place:</strong> Requires only constant extra memory
              </li>
              <li>
                <strong>Deterministic:</strong> Behavior does not change across
                runs
              </li>
              <li>
                <strong>Simple:</strong> Easy to implement and understand
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Time Complexity:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best Case:</strong> O(n²)
              </li>
              <li>
                <strong>Average Case:</strong> O(n²)
              </li>
              <li>
                <strong>Worst Case:</strong> O(n²)
              </li>
            </ul>

            <h4 className="font-semibold mt-4 text-gray-800">
              Space Complexity:
            </h4>
            <p>O(1) - only uses a constant amount of extra space</p>

            <h4 className="font-semibold mt-4 text-gray-800">When to Use:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>When memory space is very limited</li>
              <li>For small arrays or teaching purposes</li>
              <li>When performance is not a priority</li>
              <li>As a part of hybrid sorting algorithms</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Selection Sort Visualization
          </h2>

          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={isRunning ? pauseAnimation : startAnimation}
              disabled={sortedUpTo === array.length - 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white disabled:bg-gray-400 disabled:cursor-not-allowed`}
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

          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Algorithm Status:
            </h3>
            <div className="text-sm text-gray-600">
              <p>Step: {currentStep}</p>
              <p>Minimum Index: {minIndex >= 0 ? minIndex : "None"}</p>
              <p>
                Comparing Index: {comparingIndex >= 0 ? comparingIndex : "None"}
              </p>
              <p>
                Sorted up to: {sortedUpTo}/{array.length - 1}
              </p>
            </div>
          </div>

          <div className="flex gap-6 mb-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Sorted Portion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span>Minimum Element</span>
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
};

export default SelectionSort;
