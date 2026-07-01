import { matchResponse } from '../utils/responseMatcher';
import { calculateDynamicPricing } from '../utils/pricingEngine';

export const generateBotResponse = async (userText) => {
  // Simulate network delay for realistic typing effect
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Check dynamic pricing engine first
  const pricingData = calculateDynamicPricing(userText);
  if (pricingData) {
    return {
      id: Date.now() + 1,
      type: 'BOT_MESSAGE',
      text: pricingData.text,
      relatedLinks: pricingData.relatedLinks
    };
  }

  // 2. Pass to knowledge base matcher
  const responseData = matchResponse(userText);

  return {
    id: Date.now() + 1,
    type: responseData.type || 'BOT_MESSAGE',
    text: responseData.text,
    relatedLinks: responseData.relatedLinks
  };
};
