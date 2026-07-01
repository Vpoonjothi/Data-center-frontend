export const serviceData = {
  'public-cloud': {
    name: 'Public Cloud',
    hero: {
      title: 'Enterprise Public Cloud',
      subtitle: 'Scalable, secure, and highly available cloud infrastructure deployed in seconds. Built for modern enterprise workloads.',
      badgeText: 'Instant Provisioning',
      ctaPrimary: { text: 'Deploy Now', link: '/signup' },
      ctaSecondary: { text: 'Talk to Sales', link: '#contact-sales' }
    },
    overview: {
      paragraphs: [
        'Greenleaf Public Cloud provides a highly reliable, scalable, and secure environment for your applications. Our infrastructure is powered by the latest generation hardware and an ultra-low latency network.',
        'Whether you are running cloud-native applications, hosting high-traffic websites, or managing complex databases, our public cloud delivers consistent performance with an SLA of 99.99%.'
      ],
      bullets: [
        '100% NVMe Storage Arrays',
        'Tier III+ Data Centers globally',
        'DDoS Protection included',
        'Instant horizontal and vertical scaling'
      ]
    },
    features: [
      { title: 'High Availability', description: 'Redundant architecture at every level ensures your applications stay online.' },
      { title: 'Enterprise Security', description: 'Advanced firewalls, DDoS mitigation, and isolation keep your data safe.' },
      { title: 'Scalability', description: 'Scale resources up or down instantly via our API or control panel.' },
      { title: '24x7 Support', description: 'Expert technical support available around the clock.' },
      { title: 'Low Latency', description: 'Optimized routing and a global backbone network.' },
      { title: 'Global Network', description: 'Deploy your applications close to your users worldwide.' }
    ],
    benefits: [
      { title: 'Cost Savings', description: 'Pay only for what you use with our predictable, transparent billing.' },
      { title: 'Performance', description: 'Industry-leading compute and NVMe storage for maximum IOPS.' },
      { title: 'Reliability', description: 'Backed by our financially rewarding 99.99% Uptime SLA.' },
      { title: 'Compliance', description: 'Compliant with GDPR, HIPAA, PCI-DSS, and ISO 27001.' },
      { title: 'Flexibility', description: 'Customize your virtual instances to match your exact needs.' },
      { title: 'Growth', description: 'Infrastructure that scales effortlessly as your business grows.' }
    ],
    faqs: [
      { question: 'What is a Public Cloud?', answer: 'Public Cloud refers to computing resources—like servers and storage—delivered over the internet and shared among multiple users, offering high scalability and cost-efficiency.' },
      { question: 'Is my data secure on a Public Cloud?', answer: 'Yes. Greenleaf employs enterprise-grade security protocols, including hardware isolation, DDoS protection, and encrypted data transfers.' },
      { question: 'Can I scale my resources automatically?', answer: 'Absolutely. We offer an intuitive API and auto-scaling groups to handle traffic spikes seamlessly.' },
      { question: 'How is billing calculated?', answer: 'You are billed hourly based on the resources you consume, up to a monthly cap. No hidden fees.' },
      { question: 'What operating systems are supported?', answer: 'We support all major Linux distributions (Ubuntu, Debian, CentOS, AlmaLinux) and Windows Server.' }
    ],
    relatedServices: [
      { name: 'Private Cloud', description: 'Dedicated cloud resources for maximum privacy and control.', path: '/cloud/private-cloud' },
      { name: 'Hybrid Cloud', description: 'Combine public and private cloud environments seamlessly.', path: '/cloud/hybrid-cloud' },
      { name: 'Cloud Backup', description: 'Automated, secure off-site backups for your critical data.', path: '/cloud/cloud-backup' },
      { name: 'Disaster Recovery', description: 'Continuous replication for zero downtime recovery.', path: '/cloud/disaster-recovery' }
    ]
  },
  // We can add private-cloud, hybrid-cloud, etc. as needed using the same structure.
  // We'll create a fallback generic data set if a specific slug is missing.
};

export const getServiceData = (slug) => {
  if (serviceData[slug]) {
    return serviceData[slug];
  }
  
  // Generic fallback for any other service slug
  const titleFormatted = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    name: titleFormatted,
    hero: {
      title: `Enterprise ${titleFormatted}`,
      subtitle: `Premium ${titleFormatted} solutions designed for scale, performance, and ultimate reliability.`,
      ctaPrimary: { text: 'Get Started', link: '/signup' },
      ctaSecondary: { text: 'Contact Sales', link: '#contact-sales' }
    },
    overview: {
      paragraphs: [
        `Welcome to Greenleaf's industry-leading ${titleFormatted} service. We provide a highly reliable and secure environment customized for your operational needs.`,
        `Built on enterprise-grade hardware and backed by our expert support team, our ${titleFormatted} ensures your business operates seamlessly.`
      ],
      bullets: [
        'Enterprise-grade infrastructure',
        'Industry leading SLAs',
        '24/7/365 Expert Support',
        'Global availability zones'
      ]
    },
    features: [
      { title: 'High Availability', description: 'Redundant architecture at every level ensures your applications stay online.' },
      { title: 'Enterprise Security', description: 'Advanced firewalls, DDoS mitigation, and isolation keep your data safe.' },
      { title: 'Scalability', description: 'Scale resources up or down instantly via our API or control panel.' }
    ],
    benefits: [
      { title: 'Cost Savings', description: 'Predictable, transparent billing with no hidden fees.' },
      { title: 'Performance', description: 'Industry-leading compute and NVMe storage.' },
      { title: 'Reliability', description: 'Backed by our financially rewarding 99.99% Uptime SLA.' }
    ],
    faqs: [
      { question: `What is included with ${titleFormatted}?`, answer: `Our ${titleFormatted} includes full access to our enterprise network, DDoS protection, and 24/7 support.` },
      { question: 'How quickly can this be deployed?', answer: 'Most deployments are instant, though custom enterprise configurations may take up to 24 hours.' },
      { question: 'Do you offer a Service Level Agreement (SLA)?', answer: 'Yes, we offer an industry-leading 99.99% Uptime SLA.' },
      { question: 'Can I upgrade later?', answer: 'Yes, our infrastructure is built to scale with your business.' },
      { question: 'Is support included?', answer: 'Yes, basic 24/7 support is included with all services.' }
    ],
    relatedServices: [
      { name: 'Public Cloud', description: 'Scalable cloud infrastructure.', path: '/cloud/public-cloud' },
      { name: 'Dedicated Servers', description: 'Raw bare-metal performance.', path: '/dedicated-servers/amd' }
    ]
  };
};
