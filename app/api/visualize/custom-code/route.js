import  generateContent  from "@/helpers/generateContent";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {userQuery} = await request.json()

        console.log(userQuery);
        
        const response = await generateContent(userQuery)

        let cleaner = response.match( /"chart":\s*"([\s\S]*?)"\s*}/)

        cleaner = cleaner[1].replace(/\\n/g, "\n").trim();

        return NextResponse.json({data:cleaner})

    } catch (error) {
        console.log(error);
    }
}


function cleanMermaidResponse(raw) {
    // 1️⃣ Remove triple backticks and "json" label if present
    let cleaned = raw.replace(/```json|```/g, "").trim();
  
    // 2️⃣ Parse JSON safely
    let obj;
    try {
      obj = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("Invalid JSON format from AI output");
    }
  
    // 3️⃣ Ensure chart property exists and fix escaped newlines
    if (obj.chart) {
      obj.chart = obj.chart.replace(/\\n/g, "\n").trim();
    } else {
      throw new Error("No 'chart' property found in AI output");
    }
  
    return obj;
  }