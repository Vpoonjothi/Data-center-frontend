export const solutionsKnowledge = [
  {
    id: "ai-ml",
    slug: "ai-machine-learning",
    keywords: ["ai", "machine learning", "gpu", "artificial intelligence"],
    title: "AI & Machine Learning Infrastructure",
    shortDescription: "High-density infrastructure built specifically for intensive AI workloads.",
    fullDescription: "Greenleaf provides the extreme power density and specialized cooling required for modern AI and Machine Learning clusters. Our facilities are designed from the ground up to support the heavy power draw and thermal output of advanced GPU hardware.",
    useCases: [
      "Large Language Model (LLM) Training",
      "Real-time AI Inference",
      "Deep Learning Research",
      "Predictive Analytics Modeling"
    ],
    benefits: [
      "Support for up to 40kW+ per rack",
      "Direct-to-chip liquid cooling readiness",
      "Reinforced flooring for ultra-heavy GPU clusters",
      "Proximity to major cloud edge locations for hybrid workflows"
    ],
    targetIndustries: ["Technology", "Healthcare Research", "Financial Quant Trading", "Autonomous Vehicles"],
    commonQuestions: [
      { q: "Which solution is best for AI?", a: "Our AI & Machine Learning Infrastructure solution is specifically designed to handle the massive power and cooling requirements of GPU clusters like the NVIDIA H100." },
      { q: "Do you support liquid cooling?", a: "Yes, our high-density zones are equipped to support direct-to-chip liquid cooling loops." }
    ],
    relatedLinks: [
      { label: "Request AI Architecture Review", url: "/contact" }
    ]
  },
  {
    id: "finance",
    slug: "financial-services",
    keywords: ["finance", "financial", "trading", "fintech", "hft"],
    title: "Financial Services Infrastructure",
    shortDescription: "Ultra-low latency and highly compliant environments for fintech and trading.",
    fullDescription: "Built for high-frequency trading firms, banks, and fintech providers, this solution offers proximity hosting, direct cross-connects to financial exchanges, and infrastructure that exceeds the strict compliance requirements of the global financial sector.",
    useCases: [
      "High-Frequency Trading (HFT)",
      "Blockchain & Digital Asset Infrastructure",
      "Core Banking Systems Hosting",
      "Secure Payment Processing"
    ],
    benefits: [
      "Sub-millisecond latency to major financial matching engines",
      "Strict PCI DSS and SOC 2 Type II compliance",
      "Five layers of zero-trust physical security",
      "100% uptime guarantees for trading hours"
    ],
    targetIndustries: ["Investment Banking", "FinTech", "Cryptocurrency", "Insurance"],
    commonQuestions: [
      { q: "What financial solutions are available?", a: "We offer Financial Services Infrastructure featuring ultra-low latency cross-connects to major exchanges, strict PCI DSS compliance, and 100% uptime SLAs for trading." },
      { q: "Are you PCI compliant?", a: "Yes, all our facilities maintain strict PCI DSS, SOC 2 Type II, and ISO 27001 certifications." }
    ],
    relatedLinks: [
      { label: "View Certifications", url: "/data-center" }
    ]
  },
  {
    id: "healthcare",
    slug: "healthcare",
    keywords: ["healthcare", "health", "hospital", "hipaa", "medical"],
    title: "Healthcare Data Solutions",
    shortDescription: "HIPAA-compliant, highly secure infrastructure for electronic health records and medical imaging.",
    fullDescription: "A tailored solution for healthcare providers and MedTech companies ensuring the absolute security, privacy, and constant availability of critical patient data. Engineered to handle massive data storage for medical imaging while strictly adhering to HIPAA mandates.",
    useCases: [
      "Electronic Health Records (EHR) Hosting",
      "PACS and Medical Imaging Storage",
      "Genomic Sequencing Data Processing",
      "Telemedicine Backend Infrastructure"
    ],
    benefits: [
      "Full HIPAA and HITECH compliance",
      "Scalable storage architectures for petabytes of medical imaging",
      "Geographically diverse disaster recovery for patient data",
      "24/7 physical access auditing"
    ],
    targetIndustries: ["Hospitals", "Health Insurance", "MedTech", "Pharmaceuticals"],
    commonQuestions: [
      { q: "Do you provide healthcare infrastructure?", a: "Yes, we provide specialized Healthcare Data Solutions that are fully HIPAA compliant and designed for massive, secure medical data storage." },
      { q: "Are you HIPAA compliant?", a: "Absolutely. We offer full HIPAA and HITECH compliance, complete with detailed physical access auditing." }
    ],
    relatedLinks: [
      { label: "Talk to a Healthcare Specialist", url: "/contact" }
    ]
  },
  {
    id: "edge",
    slug: "edge-computing",
    keywords: ["edge", "edge computing", "cdn", "iot"],
    title: "Edge Computing Solutions",
    shortDescription: "Distributed micro-data centers bringing compute power closer to end-users.",
    fullDescription: "For applications where every millisecond counts, our Edge Computing Solutions provide distributed infrastructure footprints near major population centers and 5G aggregation points, drastically reducing latency for end-users and IoT devices.",
    useCases: [
      "IoT Data Aggregation",
      "Content Delivery Networks (CDN)",
      "Real-time Video Streaming",
      "Smart City Infrastructure"
    ],
    benefits: [
      "Drastically reduced round-trip time (RTT) for users",
      "Lower transit bandwidth costs by processing data locally",
      "Improved resilience through distributed architecture",
      "Rapid deployment in metropolitan markets"
    ],
    targetIndustries: ["Media & Entertainment", "Telecommunications", "Retail", "Manufacturing"],
    commonQuestions: [
      { q: "What is your edge computing solution?", a: "Our Edge Computing Solution deploys infrastructure closer to your users in regional hubs to reduce latency and improve performance for IoT, streaming, and CDN workloads." },
      { q: "How does edge computing help latency?", a: "By physically placing servers closer to the end user, we reduce the distance data must travel, cutting round-trip time from hundreds of milliseconds down to single digits." }
    ],
    relatedLinks: [
      { label: "View Our Locations", url: "/data-center" }
    ]
  }
];
