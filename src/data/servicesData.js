export const servicesData = [
  {
    id: 1,
    slug: 'colocation',
    title: 'Enterprise Colocation Services',
    shortDescription: 'High-density, highly secure colocation within Tier III+ facilities.',
    fullDescription: 'Our enterprise colocation solutions provide the resilient physical foundation required for mission-critical IT infrastructure. Engineered for maximum uptime, high-density computing, and stringent physical security, our facilities allow you to scale your hardware footprint without the capital burden of building and operating your own data centers. Gain direct access to robust power architectures and a dense ecosystem of network carriers.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
    metrics: [
      { value: '99.999%', label: 'Uptime SLA' },
      { value: '50MW+', label: 'Power Capacity' },
      { value: 'Tier III+', label: 'Infrastructure' },
      { value: '1500+', label: 'Rack Capacity' }
    ],
    features: [
      {
        title: 'Carrier-Neutral Connectivity',
        description: 'Direct cross-connects to dozens of Tier 1 transit providers and internet exchanges.',
        businessValue: 'Eliminate vendor lock-in, reduce latency, and negotiate better transit rates by having multiple carriers compete in the same facility.'
      },
      {
        title: 'High-Density Deployments',
        description: 'Support for extreme power densities up to 40kW per rack, optimized for AI and HPC workloads.',
        businessValue: 'Maximize compute power per square foot and avoid the need to spread workloads across multiple underutilized racks.'
      },
      {
        title: 'Zero-Trust Physical Security',
        description: 'Multi-factor biometric access, mantraps, and 24/7/365 on-site armed security personnel.',
        businessValue: 'Ensure regulatory compliance and protect intellectual property against physical intrusion and unauthorized access.'
      },
      {
        title: 'Intelligent Monitoring',
        description: 'Real-time visibility into power draw, temperature, and humidity at the rack level.',
        businessValue: 'Proactively identify inefficiencies, optimize power utilization effectiveness (PUE), and prevent thermal events before they impact hardware.'
      }
    ],
    infrastructure: {
      power: '2N UPS redundancy, N+1 diesel generator backup with 48-hour on-site fuel capacity, and dual-fed A/B power drops to every cabinet.',
      cooling: 'N+2 CRAC/CRAH units, hot/cold aisle containment, and available direct-to-chip liquid cooling loops.',
      network: 'Diverse fiber entry points, meet-me rooms (MMR), and automated cross-connect provisioning.',
      security: 'Five layers of physical security, AI-assisted CCTV, and comprehensive access auditing.'
    },
    whyChooseUs: [
      'Tier III+ Facilities',
      '99.999% Uptime SLA',
      'Carrier Neutral Ecosystem',
      'High-Density Ready (40kW+)',
      '100% Renewable Energy Options',
      '24/7/365 Smart Hands Support'
    ],
    compliance: ['ISO 27001', 'SOC 2 Type II', 'PCI DSS', 'HIPAA', 'LEED Silver'],
    process: [
      { title: 'Requirements Engineering', desc: 'Detailed analysis of space, power, cooling, and network constraints.' },
      { title: 'Solution Design', desc: 'Custom cage/cabinet layout and precise power architecture modeling.' },
      { title: 'Deployment Planning', desc: 'Logistics coordination, migration scheduling, and cross-connect staging.' },
      { title: 'Racking & Stacking', desc: 'Physical hardware installation and structured cabling executed by experts.' },
      { title: 'Commissioning', desc: 'Rigorous testing of power feeds and network redundancy before go-live.' },
      { title: 'Ongoing Operations', desc: 'Continuous environmental monitoring and remote hands availability.' }
    ],
    caseStudies: [
      {
        challenge: 'A global financial services firm struggled with power limitations in their legacy data center, restricting their algorithmic trading hardware upgrades.',
        solution: 'Migrated 50 racks to our high-density zone, utilizing 20kW per rack and direct cross-connects to financial exchanges.',
        outcome: 'Reduced trade execution latency by 4ms, consolidated footprint by 40%, and achieved 100% uptime over 3 years.'
      }
    ]
  },
  {
    id: 2,
    slug: 'cloud-connect',
    title: 'Enterprise Cloud Connect',
    shortDescription: 'Dedicated, private layer 2/layer 3 connections to major hyperscalers.',
    fullDescription: 'Enterprise Cloud Connect provides dedicated, private network links directly from your infrastructure to AWS, Microsoft Azure, Google Cloud, and Oracle Cloud. By bypassing the public internet, enterprises achieve predictable latency, guaranteed throughput, and significantly enhanced data security. This is the foundational networking layer required for reliable hybrid and multi-cloud architectures.',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    metrics: [
      { value: '100Gbps+', label: 'Throughput Options' },
      { value: '<2ms', label: 'Local Latency' },
      { value: '4+', label: 'Hyperscalers Supported' },
      { value: '99.99%', label: 'Network SLA' }
    ],
    features: [
      {
        title: 'Private Routing',
        description: 'BGP routing over dedicated Layer 2/Layer 3 private circuits directly into cloud provider edges.',
        businessValue: 'Eliminates exposure to public internet routing anomalies, DDoS attacks, and network congestion.'
      },
      {
        title: 'Predictable Performance',
        description: 'Guaranteed, uncontended bandwidth ranging from 50Mbps to 100Gbps per connection.',
        businessValue: 'Ensures consistent application performance and fast data replication crucial for enterprise databases and real-time analytics.'
      },
      {
        title: 'Multi-Cloud Orchestration',
        description: 'Connect to multiple public clouds simultaneously through a single physical port using logical VLANs.',
        businessValue: 'Enables true multi-cloud architectures, allowing workloads to be placed in the optimal cloud without complex networking overhead.'
      },
      {
        title: 'Reduced Egress Costs',
        description: 'Leverage discounted data egress rates offered by hyperscalers for direct connections.',
        businessValue: 'Significantly lowers monthly cloud operating expenditures (OpEx), especially for data-heavy applications.'
      }
    ],
    infrastructure: {
      power: 'Redundant core routing equipment powered by dedicated A/B UPS feeds.',
      cooling: 'Optimized network environments maintaining strict temperature controls for optical transceivers.',
      network: 'Diverse, physically separated fiber paths to cloud provider on-ramps to eliminate single points of failure.',
      security: 'MACsec encryption available on physical links, strictly authenticated BGP peering.'
    },
    whyChooseUs: [
      'Direct Hyperscaler On-Ramps',
      'Automated Port Provisioning',
      'Diverse Fiber Routes',
      'Discounted Cloud Egress Rates',
      'Custom BGP Architecture Support',
      '24/7 NOC Monitoring'
    ],
    compliance: ['ISO 27001', 'SOC 2 Type II', 'PCI DSS'],
    process: [
      { title: 'Network Assessment', desc: 'Evaluate bandwidth requirements and cloud architecture (AWS DX, Azure ER, etc.).' },
      { title: 'Circuit Design', desc: 'Engineer redundant paths (Active/Active or Active/Passive) for high availability.' },
      { title: 'Physical Provisioning', desc: 'Allocate ports and establish physical cross-connects to the cloud edge.' },
      { title: 'Logical Configuration', desc: 'Configure VLANs, BGP peering sessions, and IP addressing.' },
      { title: 'Validation Testing', desc: 'Perform throughput, latency, and failover testing.' },
      { title: 'Monitoring & Optimization', desc: 'Continuous telemetry analysis and capacity planning.' }
    ],
    caseStudies: [
      {
        challenge: 'A healthcare provider faced compliance and performance issues when syncing large electronic health records (EHR) to AWS over the public internet.',
        solution: 'Deployed dual 10Gbps AWS Direct Connect links via our Cloud Connect fabric with redundant BGP routing.',
        outcome: 'Achieved HIPAA compliance for data transit, stabilized synchronization times, and reduced AWS egress fees by 60%.'
      }
    ]
  },
  {
    id: 3,
    slug: 'managed-services',
    title: 'Managed Infrastructure Services',
    shortDescription: 'Comprehensive lifecycle management and optimization of critical IT infrastructure.',
    fullDescription: 'Our Managed Infrastructure Services act as an extension of your IT organization, providing deep technical expertise to operate, optimize, and secure your complex environments. We handle the heavy lifting of continuous monitoring, patch management, capacity planning, and incident response, allowing your internal teams to focus on strategic business initiatives and application development rather than "keeping the lights on".',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    metrics: [
      { value: '15 Min', label: 'Critical Response Time' },
      { value: '24/7', label: 'NOC/SOC Coverage' },
      { value: '100%', label: 'Certified Engineers' },
      { value: 'Zero', label: 'Unplanned Downtime Goal' }
    ],
    features: [
      {
        title: 'Proactive Telemetry & Monitoring',
        description: 'Full-stack visibility utilizing advanced AIOps platforms to detect anomalies before they cause impact.',
        businessValue: 'Reduces Mean Time To Identify (MTTI) and prevents minor issues from cascading into costly outages.'
      },
      {
        title: 'Automated Patch Management',
        description: 'Rigorous, non-disruptive application of OS, hypervisor, and firmware updates.',
        businessValue: 'Maintains strict security postures and compliance requirements without burdening internal staff or causing maintenance window disruptions.'
      },
      {
        title: 'Capacity & Performance Engineering',
        description: 'Continuous analysis of compute, storage, and network utilization to forecast scaling needs.',
        businessValue: 'Eliminates resource bottlenecks and optimizes infrastructure spending by preventing over-provisioning.'
      },
      {
        title: 'Expert Incident Response',
        description: 'Direct access to Level 3 infrastructure architects for rapid root-cause analysis and remediation.',
        businessValue: 'Minimizes Mean Time To Resolution (MTTR) and ensures complex technical issues are resolved by seasoned domain experts.'
      }
    ],
    infrastructure: {
      power: 'Monitored at the PDU level with automated alerts for capacity thresholds.',
      cooling: 'Integrated into environmental monitoring dashboards for proactive thermal management.',
      network: 'Continuous flow analysis, DDoS mitigation, and firewall policy management.',
      security: 'Integrated SIEM, automated vulnerability scanning, and hardened OS configurations.'
    },
    whyChooseUs: [
      'ITIL-Aligned Methodologies',
      'Advanced AIOps Integration',
      'Dedicated Technical Account Managers',
      'Custom KPI Dashboards',
      'Vendor-Agnostic Expertise',
      'Strict SLAs on Resolution Time'
    ],
    compliance: ['ISO 20000', 'ISO 27001', 'SOC 2 Type II', 'ITIL v4 Certified Staff'],
    process: [
      { title: 'Discovery & Audit', desc: 'Comprehensive inventory and architectural review of existing systems.' },
      { title: 'Onboarding & Tooling', desc: 'Deployment of monitoring agents, log shippers, and configuration management tools.' },
      { title: 'Baseline Establishment', desc: 'Definition of normal operational parameters and alert thresholds.' },
      { title: 'Runbook Creation', desc: 'Documentation of standard operating procedures and escalation matrices.' },
      { title: 'Active Management', desc: '24/7 monitoring, routine maintenance, and reactive incident handling.' },
      { title: 'Quarterly Business Reviews', desc: 'Strategic analysis of performance trends, capacity, and architectural improvements.' }
    ],
    caseStudies: [
      {
        challenge: 'A rapidly growing e-commerce retailer suffered from unpredictable website outages during peak traffic events due to unmanaged database sprawl.',
        solution: 'Implemented comprehensive managed services, optimizing database indexing, configuring auto-scaling thresholds, and establishing 24/7 monitoring.',
        outcome: 'Achieved 100% uptime during Black Friday, reduced database response times by 45%, and allowed their developers to focus entirely on feature velocity.'
      }
    ]
  },
  {
    id: 4,
    slug: 'disaster-recovery',
    title: 'Enterprise Disaster Recovery (DRaaS)',
    shortDescription: 'Aggressive RPO/RTO disaster recovery and business continuity solutions.',
    fullDescription: 'Disaster Recovery as a Service (DRaaS) provides enterprise-grade resilience against hardware failures, natural disasters, and ransomware attacks. Utilizing continuous data replication and orchestrated automated failover mechanisms, we ensure your mission-critical applications can be restored in minutes, not days. We design tailored solutions that strictly adhere to your business continuity requirements and regulatory compliance mandates.',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    metrics: [
      { value: '<15 Min', label: 'Target RTO' },
      { value: '<5 Sec', label: 'Target RPO' },
      { value: '100%', label: 'Test Success Rate' },
      { value: '3+', label: 'Geographic Zones' }
    ],
    features: [
      {
        title: 'Continuous Data Protection (CDP)',
        description: 'Journal-based replication capturing every write operation at the hypervisor or storage layer.',
        businessValue: 'Achieves near-zero RPO (Recovery Point Objective), ensuring virtually no data loss in the event of an abrupt failure.'
      },
      {
        title: 'Orchestrated Automated Failover',
        description: 'Pre-configured runbooks that automatically spin up VMs, reconfigure networks, and update DNS.',
        businessValue: 'Dramatically reduces RTO (Recovery Time Objective) and eliminates human error during high-stress disaster scenarios.'
      },
      {
        title: 'Ransomware Recovery & Immutability',
        description: 'Air-gapped, immutable backup copies that cannot be altered or deleted by malicious actors.',
        businessValue: 'Provides a guaranteed recovery path even if primary systems and standard backups are compromised by ransomware.'
      },
      {
        title: 'Non-Disruptive Testing',
        description: 'Ability to execute full DR drills in isolated sandbox environments without affecting production workloads.',
        businessValue: 'Ensures compliance with regulatory audit requirements and proves DR readiness without risking business operations.'
      }
    ],
    infrastructure: {
      power: 'Target DR facilities utilize physically isolated power grids separate from primary sites.',
      cooling: 'Redundant cooling systems capable of handling sudden spikes in compute loads during failover.',
      network: 'Geographically diverse dark fiber interconnects and automated BGP route injection upon failover.',
      security: 'End-to-end encryption in flight and at rest, utilizing enterprise key management.'
    },
    whyChooseUs: [
      'Aggressive SLAs (Minutes, not Days)',
      'Immutable Air-Gapped Storage',
      'Automated Testing & Reporting',
      'Geographically Diverse Facilities',
      'Hypervisor & Storage Agnostic',
      'Dedicated DR Specialists'
    ],
    compliance: ['ISO 22301', 'ISO 27001', 'SOC 2 Type II', 'HIPAA', 'GDPR'],
    process: [
      { title: 'Business Impact Analysis', desc: 'Identify critical workloads and define required RTOs and RPOs per application tier.' },
      { title: 'Architecture Design', desc: 'Design the replication topology, network failover strategy, and target resource pools.' },
      { title: 'Implementation', desc: 'Deploy replication appliances, configure storage arrays, and establish secure tunnels.' },
      { title: 'Runbook Orchestration', desc: 'Script the exact sequence of VM boot orders, IP changes, and service starts.' },
      { title: 'Initial Synchronization', desc: 'Seed the DR site with the initial full copy of production data.' },
      { title: 'Validation & Testing', desc: 'Execute a full non-disruptive failover test and generate audit compliance reports.' }
    ],
    caseStudies: [
      {
        challenge: 'A regional hospital network relied on nightly tape backups, leaving them exposed to 24 hours of potential data loss and a 3-day recovery time for critical patient systems.',
        solution: 'Implemented CDP-based DRaaS replicating to a secure facility 300 miles away, with orchestrated failover for their EMR system.',
        outcome: 'Achieved an RPO of 4 seconds and an RTO of 12 minutes during their annual DR drill, satisfying strict HIPAA requirements and ensuring patient safety.'
      }
    ]
  }
];
