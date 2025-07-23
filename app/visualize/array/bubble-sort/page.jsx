"use client"

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BubbleSortPage() {
  const svgRef = useRef(null);
  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [speed, setSpeed] = useState(50);

  const ARRAY_SIZE = 10;
  const SVG_WIDTH = 800;
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
    setComparingIndices([]);
    setSortedIndices([]);
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
      .domain([0, d3.max(array, (d) => d)]) // <-- FIXED
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
        if (sortedIndices.includes(i)) return "#4ade80"; // green
        if (comparingIndices.includes(i)) return "#f87171"; // red
        return "#3b82f6"; // blue
      });

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
  }, [array, comparingIndices, sortedIndices]);

  const bubbleSortStep = async (arr, step) => {
    let currentArray = [...arr];
    const n = currentArray.length;
    let stepCounter = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stepCounter === step) {
          setComparingIndices([j, j + 1]);

          if (currentArray[j] > currentArray[j + 1]) {
            [currentArray[j], currentArray[j + 1]] = [
              currentArray[j + 1],
              currentArray[j],
            ];
          }

          const newlySorted = step >= ((n - i - 1) * (n - i)) / 2;
          if (newlySorted) {
            setSortedIndices((prev) => {
              const unique = new Set([...prev, n - 1 - i]);
              return Array.from(unique).sort((a, b) => a - b);
            });
          }

          return {
            array: currentArray,
            completed: false,
            step: stepCounter,
          };
        }

        stepCounter++;
      }
    }

    setComparingIndices([]);
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    return { array: currentArray, completed: true, step: stepCounter };
  };

  const startAnimation = async () => {
    setIsRunning(true);
    setIsPaused(false);
    let step = currentStep;
    let currentArray = [...array];

    while (true) {
      if (isPaused) break;

      const result = await bubbleSortStep(currentArray, step);

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
    generateRandomArray();
  };

  const stepForward = async () => {
    if (isRunning) return;

    const result = await bubbleSortStep(array, currentStep);

    if (!result.completed) {
      setArray(result.array);
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsRunning(false);
      setComparingIndices([]);
    }
  };

  return (
    <div className=" bg-zinc-900 py-8">
      <div className="mb-6 ml-6">
        <Link
          href="/visualize/array"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Array Algorithms
        </Link>
      </div>

      <div className="px-4 md:flex md:flex-row flex flex-col gap-y-4 items-start gap-x-10">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            About Bubble Sort
          </h3>
          <div className="prose text-gray-600">
            <p>
              Bubble Sort is one of the simplest sorting algorithms. It
              repeatedly steps through the list, compares adjacent elements, and
              swaps them if they are in the wrong order.
            </p>
            <h4 className="font-semibold mt-4">Algorithm Steps:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Compare adjacent elements</li>
              <li>Swap if they are in wrong order</li>
              <li>Continue until no swaps are needed</li>
              <li>Repeat for each pass</li>
            </ol>
            <h4 className="font-semibold mt-4">Time Complexity:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Best Case: O(n) - when array is already sorted</li>
              <li>Average Case: O(n²)</li>
              <li>Worst Case: O(n²) - when array is reverse sorted</li>
            </ul>
            <h4 className="font-semibold mt-4">Space Complexity:</h4>
            <p>O(1) - only uses a constant amount of extra space</p>
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Bubble Sort Visualization
          </h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={isRunning ? pauseAnimation : startAnimation}
              disabled={sortedIndices.length === array.length}
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
              disabled={isRunning || sortedIndices.length === array.length}
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
                Comparing:{" "}
                {comparingIndices.length > 0
                  ? `indices ${comparingIndices.join(", ")}`
                  : "None"}
              </p>
              <p>
                Sorted elements: {sortedIndices.length}/{array.length}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Sorted</span>
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
