import Link from 'next/link';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { ArrowBigLeft } from 'lucide-react';

export default function ArrayVisualizerIndex() {
  const sortingAlgorithms = [
    {
      title: 'Bubble Sort',
      description: 'Simple comparison-based sorting algorithm',
      link: '/visualize/array/bubble-sort',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    },
    {
      title: 'Insertion Sort',
      description: 'Builds sorted array one element at a time',
      link: '/visualize/array/insertion-sort',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    },
    {
      title: 'Selection Sort',
      description: 'Finds minimum element and places it at beginning',
      link: '/visualize/array/selection-sort',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    },
    {
      title: 'Merge Sort',
      description: 'Finds minimum element and places it at beginning',
      link: '/visualize/array/merge-sort',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    },
    {
      title: 'Quick Sort',
      description: 'Finds minimum element and places it at beginning',
      link: '/visualize/array/quick-sort',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    }
  ];

  const searchingAlgorithms = [
    {
      title: 'Binary Search',
      description: 'Finds minimum element and places it at beginning',
      link: '/visualize/array/binary-search',
      // difficulty: 'Easy',
      // timeComplexity: 'O(n²)'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="mx-auto px-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-200">
        Visualize Array Algorithm
        </h1>
        <Link 
          href="/visualize"
        className='text-white font-bold ml-4 flex items-center'><ArrowBigLeft/>back</Link>
        <div className="mx-auto mt-5">
        <h1 className="text-3xl ml-4 font-bold text-gray-200">
        Sorting Algorithm
        </h1>
          <HoverEffect items={sortingAlgorithms}/>
        </div>
        <div className="mx-auto">
        <h1 className="text-3xl ml-4 font-bold text-gray-200">
        Searching Algorithm
        </h1>
          <HoverEffect items={searchingAlgorithms}/>
        </div>
      </div>
    </div>
  );
}