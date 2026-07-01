// Data structure for specialized AI Servers

export const FEATURED_AI_SERVER = {
  id: 'ai-compute-pro-5060-ti',
  name: 'AI Compute Pro 5060 Ti',
  tagline: 'High-performance AI infrastructure designed for machine learning, AI inference, LLM deployment, computer vision, rendering, and enterprise workloads.',
  shortSubtitle: 'Enterprise-grade AI infrastructure powered by Intel Core Ultra processors and NVIDIA RTX 5060 Ti graphics.',
  
  // Core Specs
  specs: {
    cpu: 'Intel Core Ultra i7',
    ram: '64 GB DDR5 RAM',
    storage: '2 × 2 TB M.2 NVMe SSD',
    gpu: 'NVIDIA RTX 5060 Ti 16 GB',
    network: '10 Gbps Port',
    bandwidth: 'Unlimited',
    os: 'Ubuntu / Windows Server',
    support: '24/7 Technical Support'
  },

  // Detailed Specifications for Grid Cards
  detailedSpecs: [
    { title: 'Processor', value: 'Intel Core Ultra i7', icon: 'cpu' },
    { title: 'Memory', value: '64 GB DDR5', icon: 'ram' },
    { title: 'Storage', value: '2 × 2 TB M.2 NVMe', icon: 'storage' },
    { title: 'Graphics', value: 'RTX 5060 Ti 16GB', icon: 'gpu' },
    { title: 'Network', value: '10 Gbps Port', icon: 'network' },
    { title: 'Bandwidth', value: 'Unlimited', icon: 'bandwidth' },
    { title: 'Support', value: '24/7 Expert', icon: 'support' },
  ],

  // Ideal Use Cases
  useCases: [
    'AI Model Training',
    'Machine Learning',
    'Deep Learning',
    'LLM Deployment',
    'Computer Vision',
    'Image Processing',
    'Video Rendering',
    'Data Analytics',
    'Research Workloads'
  ],

  // Performance Benefits
  benefits: [
    {
      title: 'Fast DDR5 Memory',
      description: 'Accelerate memory-bound AI workloads with ultra-fast DDR5 RAM delivering unprecedented bandwidth.'
    },
    {
      title: 'Ultra-fast NVMe Storage',
      description: 'Zero bottleneck data loading for massive datasets with parallel PCIe Gen 4/5 M.2 NVMe SSDs.'
    },
    {
      title: 'Dedicated NVIDIA GPU',
      description: 'Harness 16GB of dedicated VRAM on the latest RTX 5060 Ti for local inference and training.'
    },
    {
      title: 'High-speed Network',
      description: 'Unrestricted data transfer capabilities with a dedicated 10 Gbps uplink and unlimited bandwidth.'
    },
    {
      title: 'Enterprise Reliability',
      description: 'Built with enterprise-grade components guaranteeing 99.99% uptime for mission-critical applications.'
    },
    {
      title: '24/7 Monitoring',
      description: 'Continuous proactive infrastructure monitoring backed by expert technical support available around the clock.'
    }
  ],

  pricing: {
    monthly: '₹XX,XXX',
    placeholder: true
  }
};
