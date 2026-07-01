export const formatServiceResponse = (service) => {
  return `${service.fullDescription}

At Greenleaf, our ${service.title} provides:

${service.features.map(f => `• ${f}`).join('\n')}

**Key Business Benefits:**
${service.benefits.map(b => `✓ ${b}`).join('\n')}

Would you like me to connect you with a Greenleaf infrastructure specialist or request a customized quote?`;
};

export const formatSolutionResponse = (solution) => {
  return `For ${solution.targetIndustries ? solution.targetIndustries[0] : 'enterprise'} workloads, we typically recommend our **${solution.title}**.

${solution.fullDescription}

This solution is engineered for:
${solution.useCases.map(u => `• ${u}`).join('\n')}

**Key Advantages:**
${solution.benefits.map(b => `✓ ${b}`).join('\n')}

If you can share your expected scale or workload size, I can provide a more tailored recommendation or connect you with an expert.`;
};

export const formatFacilityResponse = (facility) => {
  return `Our **${facility.facilityName}** facility in ${facility.location} provides enterprise-grade infrastructure designed for reliability and security.

**Core Capabilities:**
• **Capacity:** ${facility.capacity} IT load
• **Uptime:** ${facility.uptime} SLA
• **Power:** ${facility.powerSystems}
• **Cooling:** ${facility.coolingSystems}

**Security & Connectivity:**
${facility.security.map(s => `✓ ${s}`).join('\n')}
✓ Carrier-neutral access to ${facility.networkProviders.slice(0, 3).join(', ')} and more.

Would you like me to connect you with a Greenleaf infrastructure specialist to discuss deployment options in ${facility.location}?`;
};

export const formatContactResponse = (companyInfo) => {
  return `Greenleaf provides enterprise-grade infrastructure designed for reliability, security, and growth. You can reach our expert team 24/7.

**Sales & Consulting:**
${companyInfo.phone}
${companyInfo.salesEmail}

**24/7 Support (NOC):**
${companyInfo.phone}
${companyInfo.supportEmail}

Would you like me to connect you with an infrastructure specialist right now?`;
};

export const formatFaqResponse = (faq) => {
  return `${faq.answer}\n\nCan I provide you with more details on this, or connect you with our technical sales team?`;
};

export const formatUnknownResponse = () => {
  return `I'm a Greenleaf AI Infrastructure Consultant, but I don't have the specific answer to that right now.

I can help you understand our:
• Enterprise Services (Colocation, Cloud Connect, DRaaS)
• Industry-specific Solutions (AI/ML, Finance, Healthcare)
• Global Data Center Facilities
• Pricing and Deployment processes

Would you like me to connect you directly with a human infrastructure specialist?`;
};

export const formatLeadTriggerResponse = () => {
  return `I'd be happy to connect you with our architecture team to provide a tailored quote and discuss your specific infrastructure requirements. 

Please provide your details below, and an expert will reach out shortly.`;
};
