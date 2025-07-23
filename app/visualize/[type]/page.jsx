import { notFound } from "next/navigation";
import Link from "next/link";

const supportedTypes = ["array"]

export default function VisualizerPage(params){
    const {type} = params

    if (!supportedTypes?.includes(type)) {
        // ❌ Feature not ready → Show "Coming Soon"
        return (
          <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold mb-4 text-white">🚧 {type?.toUpperCase()} Visualizer</h1>
            <p className="text-lg text-gray-600 mb-6 text-white">
              This feature is under construction and will be available soon.
            </p>
          </div>
        );
      }

      return (
        <div>
          <h1>{type?.toUpperCase()} Visualizer</h1>
          {/* Render your actual visualizer here */}
        </div>
      );

}