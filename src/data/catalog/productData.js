export const productData = {
  'amd': {
    category: 'Dedicated Servers',
    name: 'AMD Dedicated Servers',
    hero: {
      title: 'AMD EPYC™ Dedicated Servers',
      subtitle: 'Raw, uncompromising performance powered by the latest generation AMD EPYC processors. Built for heavy workloads and virtualization.',
      badgeText: 'Bare Metal Performance',
      startingPrice: '9,999'
    },
    plans: [
      { name: 'AMD EPYC 7282', cpu: '16 Cores / 32 Threads', ram: '64 GB ECC', storage: '960 GB NVMe', bandwidth: '10 TB @ 1 Gbps', price: '9,999' },
      { name: 'AMD EPYC 7452', cpu: '32 Cores / 64 Threads', ram: '128 GB ECC', storage: '2x 960 GB NVMe', bandwidth: '20 TB @ 1 Gbps', price: '14,999' },
      { name: 'AMD EPYC 7543', cpu: '32 Cores / 64 Threads', ram: '256 GB ECC', storage: '2x 1.92 TB NVMe', bandwidth: '30 TB @ 10 Gbps', price: '22,499' },
      { name: 'AMD EPYC 9654', cpu: '96 Cores / 192 Threads', ram: '768 GB DDR5', storage: '4x 3.84 TB NVMe', bandwidth: 'Unmetered @ 10 Gbps', price: '49,999' }
    ],
    features: [
      { name: 'DDoS Protection', description: 'Standard 20Gbps mitigation included automatically on all bare metal servers.' },
      { name: 'IPMI Access', description: 'Full out-of-band management via dedicated IPMI/iDRAC interface.' },
      { name: 'Network Port', description: 'Dedicated 1 Gbps or 10 Gbps uplink directly connected to our core routing layer.' },
      { name: 'Private Networking', description: 'Free unmetered backend network for secure server-to-server communication.' }
    ]
  },
  'intel': {
    category: 'Dedicated Servers',
    name: 'Intel Dedicated Servers',
    hero: {
      title: 'Intel Xeon® Dedicated Servers',
      subtitle: 'Enterprise-grade reliability and single-core performance. Ideal for high-frequency trading, databases, and enterprise applications.',
      badgeText: 'Enterprise Grade',
      startingPrice: '8,499'
    },
    plans: [
      { name: 'Intel Xeon Silver 4214', cpu: '12 Cores / 24 Threads', ram: '64 GB ECC', storage: '1 TB SSD', bandwidth: '10 TB @ 1 Gbps', price: '8,499' },
      { name: 'Intel Xeon Gold 6230', cpu: '20 Cores / 40 Threads', ram: '128 GB ECC', storage: '2x 1 TB NVMe', bandwidth: '20 TB @ 1 Gbps', price: '13,999' },
      { name: 'Intel Xeon Platinum 8260', cpu: '24 Cores / 48 Threads', ram: '256 GB ECC', storage: '2x 2 TB NVMe', bandwidth: 'Unmetered @ 10 Gbps', price: '24,999' }
    ],
    features: [
      { name: 'DDoS Protection', description: 'Standard 20Gbps mitigation included automatically on all bare metal servers.' },
      { name: 'IPMI Access', description: 'Full out-of-band management via dedicated IPMI/iDRAC interface.' },
      { name: 'Network Port', description: 'Dedicated 1 Gbps or 10 Gbps uplink directly connected to our core routing layer.' }
    ]
  },
  'enterprise': {
    category: 'Dedicated Servers',
    name: 'Enterprise Dedicated Servers',
    hero: {
      title: 'Enterprise Dedicated Servers',
      subtitle: 'Mission-critical infrastructure with dual processors, massive RAM, and multi-terabyte NVMe storage designed for extreme enterprise workloads.',
      badgeText: 'Premium Tier',
      startingPrice: '29,999'
    },
    plans: [
      { name: 'Dual Intel Gold 6230', cpu: '40 Cores / 80 Threads', ram: '256 GB ECC', storage: '4x 2 TB NVMe', bandwidth: '50 TB @ 10 Gbps', price: '29,999' },
      { name: 'Dual AMD EPYC 7543', cpu: '64 Cores / 128 Threads', ram: '512 GB ECC', storage: '8x 3.84 TB NVMe', bandwidth: 'Unmetered @ 10 Gbps', price: '45,999' },
      { name: 'Quad Intel Platinum 8260', cpu: '96 Cores / 192 Threads', ram: '1 TB ECC', storage: '12x 7.68 TB NVMe', bandwidth: 'Unmetered @ 40 Gbps', price: '89,999' }
    ],
    features: [
      { name: 'N+1 Redundancy', description: 'Dual power supplies and redundant network links as standard.' },
      { name: 'Hardware RAID', description: 'Enterprise hardware RAID controllers with BBU.' },
      { name: 'DDoS Protection', description: 'Premium 100Gbps volumetric DDoS mitigation.' },
      { name: 'SLA Guarantee', description: '100% network and power uptime guarantee.' }
    ]
  },
  'storage': {
    category: 'Dedicated Servers',
    name: 'Storage Dedicated Servers',
    hero: {
      title: 'High-Capacity Storage Servers',
      subtitle: 'Massive storage capacity with enterprise-grade HDDs and NVMe caching. Perfect for backups, media streaming, and big data.',
      badgeText: 'Storage Optimized',
      startingPrice: '12,999'
    },
    plans: [
      { name: 'Storage Entry - 40TB', cpu: 'Intel Xeon Silver 4214', ram: '64 GB ECC', storage: '4x 10TB HDD + 1TB NVMe', bandwidth: '10 TB @ 1 Gbps', price: '12,999' },
      { name: 'Storage Pro - 100TB', cpu: 'AMD EPYC 7282', ram: '128 GB ECC', storage: '10x 10TB HDD + 2TB NVMe', bandwidth: '20 TB @ 10 Gbps', price: '24,999' },
      { name: 'Storage Max - 200TB', cpu: 'AMD EPYC 7543', ram: '256 GB ECC', storage: '20x 10TB HDD + 4TB NVMe', bandwidth: '50 TB @ 10 Gbps', price: '45,999' }
    ],
    features: [
      { name: 'Hardware RAID', description: 'Enterprise RAID controllers for data redundancy.' },
      { name: 'NVMe Caching', description: 'Fast SSD caching for high IOPS on hot data.' },
      { name: 'Unmetered Internal Traffic', description: 'Free transfers between your servers.' },
      { name: 'DDoS Protection', description: 'Standard mitigation included.' }
    ]
  },
  'high-performance': {
    category: 'Dedicated Servers',
    name: 'High Performance Servers',
    hero: {
      title: 'High Performance Servers',
      subtitle: 'High frequency processors optimized for single-thread performance, gaming, and algorithmic trading.',
      badgeText: 'High Frequency',
      startingPrice: '11,499'
    },
    plans: [
      { name: 'Intel Core i9-13900K', cpu: '24 Cores / 32 Threads @ 5.8GHz', ram: '64 GB DDR5', storage: '2x 1 TB NVMe Gen4', bandwidth: '10 TB @ 1 Gbps', price: '11,499' },
      { name: 'AMD Ryzen 9 7950X', cpu: '16 Cores / 32 Threads @ 5.7GHz', ram: '128 GB DDR5', storage: '2x 2 TB NVMe Gen4', bandwidth: '20 TB @ 10 Gbps', price: '15,999' }
    ],
    features: [
      { name: 'Overclocked Performance', description: 'CPUs tuned for maximum frequency.' },
      { name: 'DDoS Protection', description: 'Game-server optimized anti-DDoS included.' }
    ]
  },
  'managed': {
    category: 'Dedicated Servers',
    name: 'Managed Dedicated Servers',
    hero: {
      title: 'Fully Managed Servers',
      subtitle: 'Focus on your business while our enterprise engineers handle the server administration, security, and updates.',
      badgeText: 'Fully Managed',
      startingPrice: '18,999'
    },
    plans: [
      { name: 'Managed Business', cpu: 'AMD EPYC 7282', ram: '64 GB ECC', storage: '2x 960 GB NVMe', bandwidth: '10 TB @ 1 Gbps', price: '18,999' },
      { name: 'Managed Enterprise', cpu: 'AMD EPYC 7452', ram: '128 GB ECC', storage: '4x 960 GB NVMe', bandwidth: '20 TB @ 10 Gbps', price: '28,999' }
    ],
    features: [
      { name: 'Proactive Monitoring', description: '24/7 monitoring of all critical services.' },
      { name: 'Security Hardening', description: 'Regular security audits and patching.' },
      { name: 'cPanel/WHM Included', description: 'Premium control panel license included.' }
    ]
  },
  'bare-metal': {
    category: 'Dedicated Servers',
    name: 'Bare Metal Servers',
    hero: {
      title: 'Bare Metal Cloud',
      subtitle: 'Provision physical servers with cloud-like flexibility. Billed hourly, deployed in under 10 minutes.',
      badgeText: 'Hourly Billing',
      startingPrice: '7,499'
    },
    plans: [
      { name: 'BM-1', cpu: 'Intel Xeon E-2288G', ram: '32 GB ECC', storage: '2x 500 GB NVMe', bandwidth: '5 TB @ 1 Gbps', price: '7,499' },
      { name: 'BM-2', cpu: 'AMD EPYC 7232P', ram: '64 GB ECC', storage: '2x 1 TB NVMe', bandwidth: '10 TB @ 1 Gbps', price: '10,999' }
    ],
    features: [
      { name: 'Cloud API', description: 'Manage bare metal servers via our REST API.' },
      { name: 'Hourly Billing', description: 'Pay only for what you use, scale up or down.' }
    ]
  },
  'gpu-dedicated': {
    category: 'GPU Solutions',
    name: 'GPU Dedicated Servers',
    hero: {
      title: 'NVIDIA® GPU Servers',
      subtitle: 'Accelerate your AI, Deep Learning, and Rendering workloads with extreme parallel computing power.',
      badgeText: 'AI Ready',
      startingPrice: '15,999'
    },
    plans: [
      { name: '1x NVIDIA RTX 4090', cpu: 'AMD EPYC 7282', ram: '128 GB ECC', storage: '2 TB NVMe', bandwidth: '10 TB @ 10 Gbps', price: '15,999' },
      { name: '2x NVIDIA L40S', cpu: 'AMD EPYC 7543', ram: '256 GB ECC', storage: '4 TB NVMe', bandwidth: 'Unmetered @ 10 Gbps', price: '32,999' },
      { name: '4x NVIDIA A100 80GB', cpu: '2x AMD EPYC 7543', ram: '512 GB ECC', storage: '8 TB NVMe', bandwidth: 'Unmetered @ 10 Gbps', price: '85,999' },
      { name: '8x NVIDIA H100 80GB', cpu: '2x AMD EPYC 9654', ram: '1.5 TB DDR5', storage: '16 TB NVMe', bandwidth: 'Unmetered @ 100 Gbps', price: '149,999' }
    ],
    features: [
      { name: 'Tensor Cores', description: 'Accelerate mixed-precision AI training workloads.' },
      { name: 'NVLink Support', description: 'High-bandwidth GPU-to-GPU interconnect.' },
      { name: 'DDoS Protection', description: 'Standard 20Gbps mitigation included automatically.' }
    ]
  },
  'shared': {
    category: 'Web Hosting',
    name: 'Shared Hosting',
    hero: {
      title: 'Enterprise Shared Hosting',
      subtitle: 'Fast, secure, and reliable web hosting for businesses of all sizes. Powered by LiteSpeed and cPanel.',
      badgeText: 'Fully Managed',
      startingPrice: '149'
    },
    cards: [
      { 
        name: 'Starter', 
        description: 'Perfect for small blogs and personal websites.',
        price: '149',
        isPopular: false,
        features: ['1 Website', '10 GB NVMe Storage', 'Unmetered Bandwidth', 'Free SSL Certificate', 'Weekly Backups']
      },
      { 
        name: 'Business', 
        description: 'Ideal for growing businesses with multiple sites.',
        price: '349',
        isPopular: true,
        features: ['10 Websites', '50 GB NVMe Storage', 'Unmetered Bandwidth', 'Free SSL Certificate', 'Daily Backups', 'Free Domain']
      },
      { 
        name: 'Enterprise', 
        description: 'Maximum resources for high-traffic stores.',
        price: '799',
        isPopular: false,
        features: ['Unlimited Websites', '200 GB NVMe Storage', 'Unmetered Bandwidth', 'Free SSL', 'Hourly Backups', 'Free Domain', 'Dedicated IP']
      }
    ],
    features: [
      { name: 'LiteSpeed Web Server', description: 'Up to 20x faster than traditional Apache servers.' },
      { name: 'cPanel Control Panel', description: 'Industry standard, easy-to-use hosting management interface.' },
      { name: 'Immunify360', description: 'Proactive malware detection and automated cleanup.' }
    ]
  }
};

export const getProductData = (slug) => {
  // If the specific slug isn't mapped, create a fallback based on the slug name.
  if (productData[slug]) return productData[slug];

  const titleFormatted = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    category: 'Products',
    name: titleFormatted,
    hero: {
      title: `${titleFormatted} Solutions`,
      subtitle: `Premium ${titleFormatted} products designed for performance and scale.`,
      badgeText: 'Premium Tier',
      startingPrice: '4,999'
    },
    plans: [
      { name: `Basic ${titleFormatted}`, cpu: '4 Cores', ram: '16 GB', storage: '250 GB', bandwidth: '5 TB', price: '4,999' },
      { name: `Pro ${titleFormatted}`, cpu: '8 Cores', ram: '32 GB', storage: '500 GB', bandwidth: '10 TB', price: '9,999' },
    ],
    features: [
      { name: 'Enterprise Reliability', description: 'Built on redundant hardware architecture.' },
      { name: '24x7 Support', description: 'Direct access to level 3 engineers.' }
    ]
  };
};
