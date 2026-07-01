import { fullKnowledgeBase } from '../knowledge';

export const matchResponse = (text) => {
  const normalizedText = text.toLowerCase();

  let bestMatch = null;
  let maxScore = 0;

  // Search all knowledge modules
  for (const knowledgeItem of fullKnowledgeBase) {
    let score = 0;
    for (const keyword of knowledgeItem.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = knowledgeItem;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      text: bestMatch.response,
      relatedLinks: bestMatch.relatedLinks,
      type: 'BOT_MESSAGE'
    };
  }

  // Fallback
  return { 
    text: "I'm sorry, I couldn't find specific information about that. Our enterprise support team would be happy to help you with detailed requirements.", 
    relatedLinks: [
      { text: 'Contact Sales', url: '/contact' }
    ],
    type: 'BOT_MESSAGE' 
  };
};
