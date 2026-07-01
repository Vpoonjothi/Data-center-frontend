import React from 'react';

const SuggestedQuestions = ({ onQuestionClick }) => {
  const suggestions = [
    "What is Colocation?",
    "Tell me about Cloud Connect",
    "Show AI Solutions",
    "Talk To Sales",
    "Get Pricing"
  ];

  return (
    <div className="mt-6 mb-2">
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {suggestions.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick && onQuestionClick(question)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-700 bg-cyan-50/50 text-xs font-medium hover:bg-cyan-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
