export const servicesKnowledge = [
  {
    id: "colocation",
    slug: "colocation",
    keywords: ["colocation", "rack space", "server hosting", "cabinet hosting", "data center hosting"],
    title: "Enterprise Colocation",
    shortDescription: "High-density, highly secure colocation within Tier III+ facilities.",
    fullDescription: "Our enterprise colocation solutions provide the resilient physical foundation required for mission-critical IT infrastructure. Engineered for maximum uptime, high-density computing, and stringent physical security, our facilities allow you to scale your hardware footprint without the capital burden of building and operating your own data centers.",
    features: [
      "Carrier-neutral connectivity",
      "High-density deployments up to 40kW per rack",
      "Zero-trust physical security with biometric access",
      "Real-time intelligent environmental monitoring"
    ],
    benefits: [
      "Eliminate vendor lock-in and reduce transit costs",
      "Maximize compute power per square foot",
      "Ensure strict regulatory compliance",
      "Optimize power utilization effectiveness (PUE)"
    ],
    commonQuestions: [
      { q: "What is Colocation?", a: "Colocation allows you to place your own servers in our highly secure, power-redundant data center facilities." },
      { q: "Do you offer high-density power?", a: "Yes, we support extreme power densities up to 40kW per rack, optimized for AI and HPC workloads." }
    ],
    relatedLinks: [
      { label: "View Data Centers", url: "/data-center" },
      { label: "Request Pricing", url: "/contact" }
    ]
  },
  {
    id: "cloud-connect",
    slug: "cloud-connect",
    keywords: ["cloud connect", "cloud connectivity", "aws direct connect", "azure expressroute"],
    title: "Enterprise Cloud Connect",
    shortDescription: "Dedicated, private layer 2/layer 3 connections to major hyperscalers.",
    fullDescription: "Enterprise Cloud Connect provides dedicated, private network links directly from your infrastructure to AWS, Microsoft Azure, Google Cloud, and Oracle Cloud. Bypass the public internet for predictable latency and enhanced data security.",
    features: [
      "Private BGP routing to cloud provider edges",
      "Guaranteed uncontended bandwidth up to 100Gbps",
      "Multi-cloud orchestration via logical VLANs",
      "MACsec encryption on physical links"
    ],
    benefits: [
      "Eliminate exposure to public internet routing anomalies",
      "Ensure consistent application performance with <2ms latency",
      "Enable true multi-cloud architectures from a single port",
      "Significantly lower cloud egress costs"
    ],
    commonQuestions: [
      { q: "What is Cloud Connect?", a: "It's a private, direct network connection from your hardware in our data center straight into public clouds like AWS or Azure." },
      { q: "Which clouds do you support?", a: "We provide direct on-ramps to AWS, Azure, Google Cloud, and Oracle Cloud." }
    ],
    relatedLinks: [
      { label: "View Cloud Solutions", url: "/solutions" }
    ]
  },
  {
    id: "managed-services",
    slug: "managed-services",
    keywords: ["managed services", "managed infrastructure", "patch management", "monitoring"],
    title: "Managed Infrastructure Services",
    shortDescription: "Comprehensive lifecycle management and optimization of critical IT infrastructure.",
    fullDescription: "Our Managed Infrastructure Services act as an extension of your IT organization. We handle continuous monitoring, patch management, capacity planning, and incident response, allowing your internal teams to focus on strategic business initiatives.",
    features: [
      "Proactive telemetry and AIOps monitoring",
      "Automated OS and hypervisor patch management",
      "Capacity forecasting and performance engineering",
      "Expert Level 3 incident response"
    ],
    benefits: [
      "Reduce Mean Time To Identify (MTTI) issues",
      "Maintain strict security postures without manual effort",
      "Optimize infrastructure spending by preventing over-provisioning",
      "Access vendor-agnostic infrastructure experts 24/7"
    ],
    commonQuestions: [
      { q: "What Managed Services do you provide?", a: "We handle 24/7 monitoring, automated patching, capacity planning, and expert incident resolution for your servers and network." },
      { q: "Is support available 24/7?", a: "Yes, our NOC/SOC provides complete 24/7/365 coverage with a 15-minute critical response time SLA." }
    ],
    relatedLinks: [
      { label: "Talk to an Expert", url: "/contact" }
    ]
  },
  {
    id: "disaster-recovery",
    slug: "disaster-recovery",
    keywords: ["disaster recovery", "draas", "business continuity", "backup"],
    title: "Enterprise Disaster Recovery",
    shortDescription: "Aggressive RPO/RTO disaster recovery and business continuity solutions.",
    fullDescription: "Disaster Recovery as a Service (DRaaS) provides enterprise-grade resilience against hardware failures, natural disasters, and ransomware attacks using continuous data replication and orchestrated automated failover.",
    features: [
      "Continuous Data Protection (CDP) journal-based replication",
      "Orchestrated automated failover runbooks",
      "Air-gapped, immutable backup copies",
      "Non-disruptive sandbox testing environments"
    ],
    benefits: [
      "Achieve near-zero RPO (Recovery Point Objective)",
      "Dramatically reduce RTO (Recovery Time Objective) during crises",
      "Guarantee recovery paths even during ransomware events",
      "Prove compliance readiness without risking production workloads"
    ],
    commonQuestions: [
      { q: "How does Disaster Recovery work?", a: "We continuously replicate your data to a secondary facility. If your primary site fails, we automatically spin up your systems in our facility in minutes." },
      { q: "Can you protect against ransomware?", a: "Yes, we utilize air-gapped, immutable backups that malicious actors cannot alter or delete." }
    ],
    relatedLinks: [
      { label: "View Data Centers", url: "/data-center" }
    ]
  }
];
