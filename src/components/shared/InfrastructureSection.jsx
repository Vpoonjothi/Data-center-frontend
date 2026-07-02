import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const infrastructureFeatures = [
  {
    id: 'biometric',
    title: 'Biometric Access Control',
    shortDesc: 'Fingerprint authentication for authorized personnel only.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Fingerprint Authentication',
      'RFID Access',
      'Multi-factor Security',
      'Restricted Entry',
      'Visitor Logging',
      'Audit Trail'
    ]
  },
  {
    id: 'security',
    title: '24×7 Security',
    shortDesc: 'Dedicated security team monitoring the facility around the clock.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'On-site Security Guards',
      'Perimeter Fencing',
      'Mantraps',
      'ID Verification',
      'Background Checks'
    ]
  },
  {
    id: 'cctv',
    title: 'AI CCTV Monitoring',
    shortDesc: 'Continuous intelligent surveillance with human detection.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop',
    benefits: [
      '24×7 Recording',
      'Motion Detection',
      'Human Detection',
      'AI Analytics',
      'Remote Monitoring'
    ]
  },
  {
    id: 'fire',
    title: 'Fire Suppression',
    shortDesc: 'Automatic enterprise fire detection and suppression systems.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'VESDA Detection',
      'FM200 Gas Suppression',
      'Smoke Sensors',
      'Heat Sensors',
      'Instant Alerts'
    ]
  },
  {
    id: 'ups',
    title: 'Dual UPS Backup',
    shortDesc: 'Redundant UPS infrastructure for uninterrupted clean power.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'N+1 Configuration',
      'Battery Failover',
      'Surge Protection',
      'Clean Power Delivery',
      'Zero Transfer Time'
    ]
  },
  {
    id: 'generator',
    title: 'Generator Backup',
    shortDesc: 'Automatic generator failover during extended power interruptions.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Diesel Generators',
      'Auto-Start Sequence',
      '72-Hour Fuel Capacity',
      'Priority Fuel Contracts',
      'Regular Load Testing'
    ]
  },
  {
    id: 'cooling',
    title: 'Precision Cooling',
    shortDesc: 'Enterprise cooling systems maintaining optimal operating conditions.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Hot/Cold Aisle Containment',
      'N+1 Chiller Units',
      'Constant Humidity Control',
      'Optimized PUE',
      'Environmental Monitoring'
    ]
  },
  {
    id: 'network',
    title: 'Redundant Internet',
    shortDesc: 'Multiple Tier-1 providers ensuring high network availability.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Multi-ISP Connectivity',
      'BGP Routing',
      'DDoS Protection',
      'Fiber Redundancy',
      '100Gbps Backbone'
    ]
  }
];

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "24×7", label: "Monitoring" },
  { value: "N+1", label: "Redundancy" },
  { value: "Tier III", label: "Ready" },
  { value: "Dual", label: "Power Feed" },
  { value: "Enterprise", label: "Security" }
];

const whyChooseUs = [
  {
    title: "Enterprise Hardware",
    desc: "Latest generation processors and NVMe storage.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  },
  {
    title: "Low Latency Network",
    desc: "Optimized routing for minimum ping times globally.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  },
  {
    title: "High Availability",
    desc: "Redundant architecture eliminating single points of failure.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  },
  {
    title: "Certified Security",
    desc: "ISO 27001 and SOC 2 Type II compliant facility.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  }
];

const workflowSteps = [
  "Customer Request",
  "Configuration",
  "Hardware Allocation",
  "Rack Installation",
  "Network Configuration",
  "Security Validation",
  "Quality Testing",
  "Server Provisioned"
];

const InfrastructureSection = () => {
  const [activeFeature, setActiveFeature] = useState(infrastructureFeatures[0]);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden border-t border-gray-800">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-900/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            Enterprise Infrastructure & Security
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Experience true enterprise-grade infrastructure built for maximum uptime, extreme security, and effortless scalability.
          </motion.p>
        </div>

        {/* Interactive Explorer (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24">
          
          {/* Left Panel: Dynamic Display */}
          <div className="lg:col-span-5 h-[500px]">
            <div className="h-full bg-gradient-to-br from-[#0a1128] to-[#020817] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={activeFeature.image} 
                    alt={activeFeature.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/60 to-transparent" />
                  <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {activeFeature.icon}
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-lg">{activeFeature.title}</h3>
                    <p className="text-gray-300 text-lg drop-shadow-md">{activeFeature.shortDesc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Interactive Buttons */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infrastructureFeatures.map((feature) => {
              const isActive = activeFeature.id === feature.id;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col justify-end min-h-[160px]
                    ${isActive 
                      ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] -translate-y-1 ring-2 ring-emerald-500/50' 
                      : 'border-gray-800 hover:border-emerald-500/50 hover:-translate-y-1'
                    }`}
                >
                  {/* Background Image */}
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}
                  />
                  
                  {/* Overlays */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-[#020817]/60' : 'bg-[#020817]/80 group-hover:bg-[#020817]/60'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/80 to-transparent" />
                  {isActive && <div className="absolute inset-0 bg-emerald-900/30 mix-blend-overlay" />}

                  {/* Icon & Status */}
                  <div className="absolute top-4 w-[calc(100%-2rem)] flex justify-between items-start z-10">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-colors
                      ${isActive ? 'bg-emerald-500/40 border-emerald-500/50 text-emerald-300' : 'bg-white/10 border-white/10 text-gray-300'}
                    `}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                    {isActive && (
                      <div className="px-2 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded text-[10px] font-bold text-emerald-300 tracking-wider">
                        ACTIVE
                      </div>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10 mt-12">
                    <h3 className={`font-bold mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 transition-colors ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {feature.shortDesc}
                    </p>
                  </div>
                  
                  {/* Highlight overlay for active state */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeFeatureHighlight"
                      className="absolute inset-0 bg-emerald-500/10 pointer-events-none"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enterprise Metrics Row */}
        <div className="bg-gradient-to-r from-[#0a1128] via-gray-900/80 to-[#0a1128] border border-gray-800 rounded-3xl p-8 mb-24 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center relative z-10">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50 hover:border-emerald-500/30 transition-colors group">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  {metric.value}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Data Center */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-white text-center mb-12">Why Choose Our Data Center</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="bg-[#0a1128]/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Workflow */}
        <div className="mb-10 relative">
          <h3 className="text-2xl font-bold text-white text-center mb-16">Infrastructure Workflow</h3>
          
          <div className="relative">
            {/* Connecting Line Background */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-400"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-0 relative z-10">
              {workflowSteps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex flex-col items-center group cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-gray-700 flex items-center justify-center text-emerald-500 font-bold mb-4 shadow-lg group-hover:border-emerald-400 group-hover:bg-[#020817] group-hover:scale-110 transition-all duration-300 z-10 relative">
                    <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider group-hover:text-emerald-300 transition-colors px-2">
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InfrastructureSection;
