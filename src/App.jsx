import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  // Function to generate answer using API
  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    // Ensure the API key is correctly imported

    // Prepare the request data
    const requestData = {
      contents: [{ parts: [{ text: question }] }],
    };

    console.log("Sending request data:", requestData);

    try {
      // Send a POST request to the API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyApB_7CZo0PCUOtMrUY4QzPOUs8sglckNk
`,
        requestData
      );

      console.log("API response:", response.data);

      // Extract the response content from the API response
      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "No content generated.";
      setAnswer(generatedText);

    } catch (error) {
      console.error("Error status:", error.response?.status);
      console.error("Error response data:", error.response?.data);
      setAnswer("Sorry - Something went wrong. Please try again!");
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-screen p-3 flex flex-col justify-center items-center">
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
        >
       <h1 className="text-4xl font-bold text-blue-500 mb-4 animate-bounce">Chat AI</h1>

          <textarea
            required
            className="border border-gray-300 rounded w-full my-2 min-h-fit p-3 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
          ></textarea>
          <button
            type="submit"
            className={`bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all duration-300 ${
              generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Generate answer"}
          </button>
        </form>

        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
          <ReactMarkdown className="p-4">{answer}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default App;
