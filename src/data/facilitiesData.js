export const facilitiesData = [
  {
    id: "us-east-1",
    slug: "us-east-1",
    facilityName: "US-East-1 Data Center",
    city: "Ashburn",
    state: "Virginia",
    country: "USA",
    region: "Americas",
    status: "Operational",
    capacity: "50 MW",
    uptime: "99.999%",
    tier: "Tier III+",
    description: "Located in the heart of the world's most dense data center market, US-East-1 offers unparalleled connectivity, enterprise-grade security, and sustainable power infrastructure. This flagship facility provides direct access to major cloud providers, Tier 1 network carriers, and internet exchanges.",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
    features: [
      "N+1 Redundancy",
      "Dual Utility Feeds",
      "Backup Generators",
      "High Density Cabinets",
      "Advanced Cooling",
      "Smart Monitoring"
    ],
    powerSystems: [
      "UPS Redundancy (2N)",
      "Diesel Generators (N+1)",
      "Automatic Transfer Switches",
      "48 Hours On-site Fuel Storage"
    ],
    coolingSystems: [
      "CRAC Units (N+2)",
      "Liquid Cooling Support",
      "Hot/Cold Aisle Containment",
      "Chilled Water Systems"
    ],
    networkProviders: [
      { name: "AT&T", type: "Tier 1 Carrier" },
      { name: "Lumen", type: "Tier 1 Carrier" },
      { name: "Verizon", type: "Tier 1 Carrier" },
      { name: "Cogent", type: "Tier 1 Carrier" },
      { name: "Zayo", type: "Fiber Network" },
      { name: "Tata Communications", type: "Global Network" }
    ],
    securityFeatures: [
      "Biometric Access",
      "Multi-Factor Authentication",
      "CCTV Monitoring",
      "24/7 On-site Security Personnel",
      "Access Logging & Auditing",
      "Visitor Management System"
    ],
    certifications: [
      "ISO 27001",
      "SOC 2 Type II",
      "PCI DSS",
      "HIPAA",
      "GDPR Compliant",
      "LEED Silver"
    ],
    availableServices: [
      { name: "Colocation", slug: "colocation", description: "Secure, reliable space for your IT infrastructure." },
      { name: "Managed Hosting", slug: "managed-hosting", description: "End-to-end management of your dedicated environment." },
      { name: "Cloud Connect", slug: "cloud-connect", description: "Direct, private connections to major public clouds." },
      { name: "Disaster Recovery", slug: "disaster-recovery", description: "Robust business continuity solutions." },
      { name: "Dedicated Servers", slug: "dedicated-servers", description: "High-performance bare metal servers." },
      { name: "AI Infrastructure", slug: "ai-infrastructure", description: "High-density deployments for AI/ML workloads." }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80", title: "Server Room" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80", title: "Cooling Infrastructure" },
      { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80", title: "Security Operations Center" },
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80", title: "Power Distribution" }
    ],
    faqs: [
      { question: "Can I schedule a site visit?", answer: "Yes, we welcome prospective clients to tour our facilities. Please contact our sales team to arrange a secure, guided tour of US-East-1." },
      { question: "What rack sizes are available?", answer: "We offer standard 42U and 48U cabinets, as well as customized cage spaces and private suites tailored to your specific deployment needs." },
      { question: "What is the power density?", answer: "Our standard cabinets support up to 10kW, with specialized high-density zones available supporting up to 40kW per rack for demanding AI and HPC workloads." },
      { question: "Do you offer remote hands support?", answer: "Absolutely. Our certified on-site technicians are available 24/7/365 to perform remote hands services, including reboots, cable management, and hardware replacement." }
    ],
    statistics: {
      capacity: 50,
      uptime: 99.999,
      cabinets: 1500,
      carriers: 24,
      monitoring: "24/7"
    }
  },
  {
    id: "us-west-1",
    slug: "us-west-1",
    facilityName: "US-West-1 Data Center",
    city: "Santa Clara",
    state: "California",
    country: "USA",
    region: "Americas",
    status: "Operational",
    capacity: "35 MW",
    uptime: "99.999%",
    tier: "Tier III",
    description: "Situated in the heart of Silicon Valley, US-West-1 provides exceptional low-latency connectivity to major tech hubs and Asian markets. This facility is optimized for high-density computing and features advanced seismic base isolation.",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
    features: [
      "Seismic Base Isolation",
      "N+1 Redundancy",
      "Renewable Energy Sourcing",
      "High Density Zones",
      "Water-efficient Cooling",
      "Smart Monitoring"
    ],
    powerSystems: [
      "UPS Redundancy (N+1)",
      "Diesel Generators (N+1)",
      "Dual Feed from Utility",
      "Solar Panel Integration"
    ],
    coolingSystems: [
      "Evaporative Cooling",
      "Liquid Cooling Support",
      "Hot/Cold Aisle Containment",
      "Outside Air Economization"
    ],
    networkProviders: [
      { name: "AT&T", type: "Tier 1 Carrier" },
      { name: "Verizon", type: "Tier 1 Carrier" },
      { name: "Comcast Business", type: "Regional Network" },
      { name: "Zayo", type: "Fiber Network" },
      { name: "Hurricane Electric", type: "IP Transit" }
    ],
    securityFeatures: [
      "Biometric Access",
      "Mantraps",
      "CCTV Monitoring",
      "24/7 On-site Security Personnel",
      "Perimeter Fencing"
    ],
    certifications: [
      "ISO 27001",
      "SOC 2 Type II",
      "PCI DSS",
      "HIPAA",
      "LEED Gold"
    ],
    availableServices: [
      { name: "Colocation", slug: "colocation", description: "Secure, reliable space for your IT infrastructure." },
      { name: "Cloud Connect", slug: "cloud-connect", description: "Direct, private connections to major public clouds." },
      { name: "Dedicated Servers", slug: "dedicated-servers", description: "High-performance bare metal servers." },
      { name: "AI Infrastructure", slug: "ai-infrastructure", description: "High-density deployments for AI/ML workloads." }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80", title: "Server Room" },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80", title: "Cooling Systems" }
    ],
    faqs: [
      { question: "Can I schedule a site visit?", answer: "Yes, please contact our sales team." },
      { question: "What is the power density?", answer: "Standard 8kW, high-density up to 35kW." }
    ],
    statistics: {
      capacity: 35,
      uptime: 99.999,
      cabinets: 1200,
      carriers: 18,
      monitoring: "24/7"
    }
  },
  {
    id: "eu-central-1",
    slug: "eu-central-1",
    facilityName: "EU-Central-1 Data Center",
    city: "Frankfurt",
    state: "Hesse",
    country: "Germany",
    region: "Europe",
    status: "Expanding",
    capacity: "40 MW",
    uptime: "99.999%",
    tier: "Tier III+",
    description: "Strategically located near DE-CIX, the world's leading internet exchange, EU-Central-1 serves as a critical gateway to European markets. We are currently expanding this facility to support an additional 15MW of capacity.",
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
    features: [
      "Direct DE-CIX Access",
      "N+1 Redundancy",
      "100% Renewable Energy",
      "High Density Cabinets",
      "Advanced Cooling",
      "Smart Monitoring"
    ],
    powerSystems: [
      "UPS Redundancy (2N)",
      "Diesel Generators (N+1)",
      "Automatic Transfer Switches",
      "100% Green Power Sourced"
    ],
    coolingSystems: [
      "CRAC Units (N+2)",
      "Free Cooling Chillers",
      "Hot/Cold Aisle Containment",
      "Chilled Water Systems"
    ],
    networkProviders: [
      { name: "Deutsche Telekom", type: "Tier 1 Carrier" },
      { name: "Colt", type: "Tier 1 Carrier" },
      { name: "Lumen", type: "Tier 1 Carrier" },
      { name: "Cogent", type: "Tier 1 Carrier" },
      { name: "Zayo", type: "Fiber Network" },
      { name: "Telia", type: "Global Network" }
    ],
    securityFeatures: [
      "Biometric Access",
      "Multi-Factor Authentication",
      "CCTV Monitoring",
      "24/7 On-site Security Personnel",
      "Access Logging & Auditing",
      "Visitor Management System"
    ],
    certifications: [
      "ISO 27001",
      "ISO 9001",
      "ISO 50001",
      "SOC 2 Type II",
      "PCI DSS",
      "GDPR Compliant"
    ],
    availableServices: [
      { name: "Colocation", slug: "colocation", description: "Secure, reliable space for your IT infrastructure." },
      { name: "Managed Hosting", slug: "managed-hosting", description: "End-to-end management of your dedicated environment." },
      { name: "Cloud Connect", slug: "cloud-connect", description: "Direct, private connections to major public clouds." },
      { name: "Disaster Recovery", slug: "disaster-recovery", description: "Robust business continuity solutions." }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80", title: "Server Room" },
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80", title: "Network Operations" }
    ],
    faqs: [
      { question: "Can I schedule a site visit?", answer: "Yes, we welcome prospective clients to tour our facilities." },
      { question: "What is the timeline for the expansion?", answer: "Phase 2 expansion is expected to be completed by Q4 2026." },
      { question: "Do you offer remote hands support?", answer: "Absolutely. Our certified on-site technicians are available 24/7/365." }
    ],
    statistics: {
      capacity: 40,
      uptime: 99.999,
      cabinets: 1800,
      carriers: 35,
      monitoring: "24/7"
    }
  },
  {
    id: "ap-east-1",
    slug: "ap-east-1",
    facilityName: "AP-East-1 Data Center",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    region: "Asia Pacific",
    status: "Operational",
    capacity: "25 MW",
    uptime: "99.999%",
    tier: "Tier III",
    description: "Providing a crucial gateway to Asian markets, AP-East-1 boasts ultra-low latency connections to major regional financial and technology centers. Purpose-built with advanced seismic engineering.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    features: [
      "Advanced Seismic Engineering",
      "N+1 Redundancy",
      "Carrier Neutral",
      "High Density Cabinets",
      "Advanced Cooling",
      "Bilingual Support Staff"
    ],
    powerSystems: [
      "UPS Redundancy (2N)",
      "Diesel Generators (N+1)",
      "Automatic Transfer Switches",
      "Dedicated Substation"
    ],
    coolingSystems: [
      "CRAC Units (N+2)",
      "Hot/Cold Aisle Containment",
      "Chilled Water Systems",
      "Redundant Piping"
    ],
    networkProviders: [
      { name: "NTT", type: "Tier 1 Carrier" },
      { name: "KDDI", type: "Tier 1 Carrier" },
      { name: "Softbank", type: "Tier 1 Carrier" },
      { name: "PCCW Global", type: "Global Network" },
      { name: "Tata Communications", type: "Global Network" }
    ],
    securityFeatures: [
      "Biometric Access",
      "Multi-Factor Authentication",
      "CCTV Monitoring",
      "24/7 On-site Security Personnel",
      "Mantraps",
      "Visitor Management System"
    ],
    certifications: [
      "ISO 27001",
      "SOC 2 Type II",
      "PCI DSS",
      "FISC Compliant",
      "ISO 14001"
    ],
    availableServices: [
      { name: "Colocation", slug: "colocation", description: "Secure, reliable space for your IT infrastructure." },
      { name: "Cloud Connect", slug: "cloud-connect", description: "Direct, private connections to major public clouds." },
      { name: "Dedicated Servers", slug: "dedicated-servers", description: "High-performance bare metal servers." }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80", title: "Server Room" },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80", title: "Power Infrastructure" }
    ],
    faqs: [
      { question: "Can I schedule a site visit?", answer: "Yes, please contact our sales team." },
      { question: "Is English support available?", answer: "Yes, our on-site remote hands technicians and support staff are bilingual (English/Japanese)." }
    ],
    statistics: {
      capacity: 25,
      uptime: 99.999,
      cabinets: 900,
      carriers: 15,
      monitoring: "24/7"
    }
  }
];
