export const INTENT_TYPES = {
  SERVICE: 'SERVICE_INTENT',
  SOLUTION: 'SOLUTION_INTENT',
  FACILITY: 'FACILITY_INTENT',
  CONTACT: 'CONTACT_INTENT',
  PRICING: 'PRICING_INTENT',
  FAQ: 'FAQ_INTENT',
  UNKNOWN: 'UNKNOWN_INTENT'
};

const keywordMap = {
  [INTENT_TYPES.SERVICE]: ['colocation', 'cloud', 'managed', 'disaster', 'recovery', 'service'],
  [INTENT_TYPES.SOLUTION]: ['ai', 'machine learning', 'finance', 'trading', 'health', 'edge', 'solution'],
  [INTENT_TYPES.FACILITY]: ['data center', 'facility', 'east', 'west', 'ashburn', 'santa clara', 'frankfurt', 'singapore', 'location', 'where'],
  [INTENT_TYPES.CONTACT]: ['contact', 'phone', 'email', 'support', 'sales', 'number', 'call', 'talk'],
  [INTENT_TYPES.PRICING]: ['pricing', 'cost', 'quote', 'fee', 'how much', 'price', 'consultation', 'demo', 'tour']
};

export const detectIntent = (text) => {
  // Convert to lowercase, remove punctuation, and trim
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  
  // Find primary intent based on keyword hits
  for (const [intent, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => normalizedText.includes(kw))) {
      return intent;
    }
  }

  // Fallback to FAQ if it looks like a question
  if (normalizedText.includes('what is') || normalizedText.includes('how') || normalizedText.includes('can i') || normalizedText.includes('do you')) {
    return INTENT_TYPES.FAQ;
  }

  return INTENT_TYPES.UNKNOWN;
};
