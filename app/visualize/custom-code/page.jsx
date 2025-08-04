"use client";

import axios from "axios";

import { useState } from "react";
import Mermaid from "@/components/Mermaid";

export default function Home() {
  const [input, setInput] = useState("");
  const [diagram, setDiagram] = useState("");
  const [result,setResult] = useState("")


  async function getChart(){
    try {

      console.log("get chart chala");
      
      const response = await axios.post("/api/visualize/custom-code",{userQuery:input})

      console.log(response.data.data);
      setResult(response.data.data)
    } catch (error) {
      
    }
  }

  return (
    <div className="md:p-8 p-4 min-h-screen mx-auto bg-zinc-900 flex flex-col">
      <div>
        <h1 className="text-2xl text-white font-bold mb-4">
          🛠️ Visualize Your Own Code
        </h1>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your code"
          className="w-full h-40 p-2 border rounded mb-4 bg-zinc-200"
        />
        <button
          onClick={getChart}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-8"
        >
          Visualize
        </button>
      </div>
      <Mermaid chart={result.length>0 ? result : ""} />
    </div>
  );
}
