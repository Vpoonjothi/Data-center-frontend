export const datacenterKnowledge = [
  {
    id: "us-east-1",
    slug: "us-east-1",
    keywords: ["us east", "ashburn", "virginia", "us-east-1"],
    facilityName: "US-East-1",
    location: "Ashburn, VA",
    capacity: "50MW",
    uptime: "99.999%",
    tier: "Tier III+",
    security: ["5-Layer Physical Security", "Biometric Mantraps", "24/7 Armed Guards", "AI-assisted CCTV"],
    networkProviders: ["AT&T", "Verizon", "Cogent", "Zayo", "Lumen"],
    powerSystems: "2N UPS redundancy, N+1 diesel generator backup, 48-hour on-site fuel",
    coolingSystems: "N+2 CRAC units, hot/cold aisle containment",
    services: ["Colocation", "Cloud Connect", "Managed Services", "Disaster Recovery"],
    commonQuestions: [
      { q: "Where is your US-East facility?", a: "Our flagship US-East-1 facility is located in Data Center Alley in Ashburn, Virginia." },
      { q: "What is the power capacity in Ashburn?", a: "US-East-1 has a total critical IT load capacity of 50MW." }
    ]
  },
  {
    id: "us-west-1",
    slug: "us-west-1",
    keywords: ["us west", "santa clara", "california", "silicon valley", "us-west-1"],
    facilityName: "US-West-1",
    location: "Santa Clara, CA",
    capacity: "35MW",
    uptime: "99.999%",
    tier: "Tier III+",
    security: ["5-Layer Physical Security", "Biometric Mantraps", "24/7 Armed Guards", "Seismic Isolation"],
    networkProviders: ["Comcast", "Zayo", "Hurricane Electric", "Palo Alto IX"],
    powerSystems: "2N UPS redundancy, N+1 generator backup, 100% Renewable Energy matched",
    coolingSystems: "Water-free cooling technology, N+2 redundancy",
    services: ["Colocation", "Cloud Connect", "Managed Services"],
    commonQuestions: [
      { q: "Where is your West Coast data center?", a: "US-West-1 is located in the heart of Silicon Valley in Santa Clara, California." },
      { q: "Is the California facility earthquake safe?", a: "Yes, US-West-1 utilizes advanced seismic base isolation technology." }
    ]
  },
  {
    id: "eu-central-1",
    slug: "eu-central-1",
    keywords: ["eu central", "frankfurt", "germany", "europe", "eu-central-1"],
    facilityName: "EU-Central-1",
    location: "Frankfurt, Germany",
    capacity: "40MW",
    uptime: "99.999%",
    tier: "Tier IV Design",
    security: ["GDPR Compliant Auditing", "Biometric Mantraps", "24/7 Armed Guards"],
    networkProviders: ["DE-CIX Direct Connection", "Deutsche Telekom", "Vodafone"],
    powerSystems: "2N+1 UPS redundancy, 100% Wind/Solar powered",
    coolingSystems: "Geothermal cooling assist, N+2 CRAC",
    services: ["Colocation", "Cloud Connect", "Disaster Recovery"],
    commonQuestions: [
      { q: "Where is your European facility?", a: "EU-Central-1 is located in Frankfurt, Germany." },
      { q: "Do you connect to DE-CIX?", a: "Yes, EU-Central-1 offers direct cross-connects to the DE-CIX internet exchange." }
    ]
  },
  {
    id: "ap-east-1",
    slug: "ap-east-1",
    keywords: ["ap east", "singapore", "asia", "ap-east-1"],
    facilityName: "AP-East-1",
    location: "Singapore",
    capacity: "25MW",
    uptime: "99.999%",
    tier: "Tier III+",
    security: ["Biometric Mantraps", "24/7 Armed Guards", "Anti-tailgating portals"],
    networkProviders: ["Singtel", "Equinix Internet Exchange", "StarHub"],
    powerSystems: "2N UPS redundancy, N+1 generators",
    coolingSystems: "High-efficiency chilled water systems, tropical optimized",
    services: ["Colocation", "Managed Services", "Cloud Connect"],
    commonQuestions: [
      { q: "Do you have a facility in Asia?", a: "Yes, our AP-East-1 facility is located in Singapore, serving as our primary Asia-Pacific hub." }
    ]
  }
];
