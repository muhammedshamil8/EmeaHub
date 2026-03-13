import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import CustomSelect from "../components/common/CustomSelect";
import { DocumentTextIcon, SparklesIcon, DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AISummarizePage() {
  const [formData, setFormData] = useState({
    topic: "",
    length: "medium"
  });
  
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!formData.topic) {
      toast.error("Please enter a topic to summarize");
      return;
    }

    setLoading(true);
    setSummary(null);
    try {
      const response = await API.post("/ai/summarize", formData);
      if (response.data.success) {
        setSummary(response.data.summary);
        toast.success("Summary generated!");
      } else {
        throw new Error(response.data.message || "Failed to generate summary");
      }
    } catch (error) {
      console.error("AI Summarize Error", error);
      toast.error(error.response?.data?.message || "Something went wrong generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
          <DocumentMagnifyingGlassIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI Topic Summarizer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Paste a complex academic topic, concept, or theory and let our AI break it down into an easy-to-understand summary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-1 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2 text-primary-500" />
            Input Topic
          </h2>
          
          <form onSubmit={handleSummarize} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                What do you want to learn? *
              </label>
              <textarea
                rows="4"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-900 dark:text-white resize-none"
                placeholder="e.g. Explain Quantum Entanglement or The French Revolution..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Summary Length
              </label>
              <CustomSelect
                value={formData.length}
                onChange={(val) => setFormData({ ...formData, length: val })}
                options={[
                  { value: "short", label: "Brief Summary (Short)" },
                  { value: "medium", label: "Standard Overview (Medium)" },
                  { value: "long", label: "Detailed Explanation (Long)" },
                ]}
                placeholder="Select Length"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.topic}
              className="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 shadow-lg shadow-purple-500/30 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Summarizing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate Summary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <SparklesIcon className="w-16 h-16 text-primary-500 dark:text-primary-400 relative z-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Processing Content...
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                Our AI is currently reading your prompt, synthesizing the material, and simplifying the concepts.
              </p>
            </div>
          ) : summary ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <DocumentTextIcon className="w-7 h-7 mr-3 text-emerald-500" />
                AI Summary
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <pre className="whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner overflow-auto h-[500px] text-sm leading-relaxed">
                  {summary}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-full min-h-[400px]">
              <DocumentMagnifyingGlassIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">
                Awaiting Topic Input
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                Type in the topic you want to learn about on the left, and let AI summarize it for you instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
