import { cloudKnowledge } from './cloudKnowledge';
import { gpuKnowledge } from './gpuKnowledge';
import { hostingKnowledge } from './hostingKnowledge';
import { dedicatedServerKnowledge } from './dedicatedServerKnowledge';
import { servicesKnowledge } from './servicesKnowledge';
import { faqKnowledge } from './faqKnowledge';
import { pricingKnowledge } from './pricingKnowledge';

// Aggregate all knowledge bases into one massive searchable array
export const fullKnowledgeBase = [
  ...cloudKnowledge,
  ...gpuKnowledge,
  ...hostingKnowledge,
  ...dedicatedServerKnowledge,
  ...servicesKnowledge,
  ...faqKnowledge,
  ...pricingKnowledge
];
