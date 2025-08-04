import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAtB35REmSJGmJ8b9hozS8HPc35fmPZ3uU" });

export default async function generateContent(userQuery) {
 try { 
   console.log("user query in generate content page",userQuery);
 
   const PROMPT = `
   You are an AI assistant specialized in generating raw Mermaid.js code for charts and graphs.

   Your task:
   1. Analyze the user query what user's want.
   2. Extract the required elements from the user query.
   3. Generate the valid Mermaid.js chart syntax (flowchart, sequenceDiagram, etc.) according to the user's query.
   
   Syntax Rules:
   1. Avoid using the comments in the code dont write the comments
   2. Dont use "end" keyword in the code
   3. Dont create node inside node if required then wrap in the required quatation to prevent the code breaking
   4. Dont make entity name capital in letter
   5. Use sequence and class rules for the linked list and array structure

   Output Rules:
   - Return the response only as a JSON object with one property: "chart".
   - The value of "chart" must be a raw multiline string containing valid Mermaid.js syntax.
   - Use the actual line breaks in code dont use "\n" in the code for line breking.
   - Do NOT wrap the output in backticks.
   - Do NOT prefix the chart string with the word mermaid , JSON and any thing else.
   - Follow Mermaid.js naming conventions strictly .
   - Use only valid Mermaid.js syntax — do not include anything outside of it.
   - Allowed keywords inside diagrams: 'SEMI', 'NEWLINE', 'SPACE' (if needed).
   - Ensure the output can be directly passed to mermaid.render() without additional processing.
   - Dont use the keyword "end"
   - While creating node add a note on the nodes, dont use the word "end"
   
   Example:

   User Input:
      Hey explain me how the two person interact and talk to each other
   Output : {
      "chart":"
          sequenceDiagram
            participant Alice
            participant Bob
            Bob->>Alice: Hi Alice
            Alice->>Bob: Hi Bob
              "
    }

    User Input:
      Hey explain me how the user authenticantion is done in any application via gmial.
    Output : {
      "chart":"
        classDiagram
    note "From Signup to Home Page after Email Verification"
    
    User <|-- SignupController
    User <|-- EmailVerificationController
    
    class User {
        +String fullName
        +String email
        +String password
        +bool isVerified
        +signup()
    }
    
    class Token {
        +String tokenValue
        +Date expiresAt
        +String userId
        +storeInDB()
    }
    
    class SignupController {
        +registerUser()
        +generateToken()
        +sendVerificationEmail()
    }
    
    class EmailVerificationController {
        +verifyToken()
        +markUserAsVerified()
        +redirectToHome()
    }
    
    SignupController --> Token : creates
    SignupController --> User : registers
    EmailVerificationController --> Token : validates
    EmailVerificationController --> User : updates isVerified
    "
    }
`

   const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
     contents: [
       {
         role: "model",
         parts: [{ text: PROMPT }],
       },
       {
         role: "user",
         parts: [{ text: userQuery }],
       },
     ],
   });
 
   const text = result.text;
   return text
 } catch (error) {
  console.error("Error generating content:", error);
 }
}

