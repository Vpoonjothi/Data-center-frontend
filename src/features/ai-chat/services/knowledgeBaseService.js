import { companyKnowledge } from '../../../data/knowledge/companyKnowledge';
import { servicesKnowledge } from '../../../data/knowledge/servicesKnowledge';
import { solutionsKnowledge } from '../../../data/knowledge/solutionsKnowledge';
import { datacenterKnowledge } from '../../../data/knowledge/datacenterKnowledge';
import { faqKnowledge } from '../../../data/knowledge/faqKnowledge';

export const getCompanyInfo = () => companyKnowledge;

export const searchServices = (query) => {
  return servicesKnowledge.find(s => 
    query.includes(s.slug) || 
    query.includes(s.title.toLowerCase()) ||
    (s.keywords && s.keywords.some(k => query.includes(k)))
  );
};

export const searchSolutions = (query) => {
  return solutionsKnowledge.find(s => 
    query.includes(s.slug) || 
    query.includes(s.title.toLowerCase()) ||
    (s.keywords && s.keywords.some(k => query.includes(k)))
  );
};

export const searchFacilities = (query) => {
  return datacenterKnowledge.find(f => 
    query.includes(f.slug) || 
    query.includes(f.location.toLowerCase()) ||
    (f.keywords && f.keywords.some(k => query.includes(k)))
  );
};

export const searchFaqs = (query) => {
  // Find highest matching FAQ based on keywords
  let bestMatch = null;
  let maxScore = 0;

  faqKnowledge.forEach(faq => {
    let score = 0;
    if (faq.keywords) {
      faq.keywords.forEach(kw => {
        if (query.includes(kw)) score++;
      });
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  });

  return maxScore > 0 ? bestMatch : null;
};
