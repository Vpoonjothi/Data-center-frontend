import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../../components/common/PageBanner';
import { facilitiesData } from '../../data/facilitiesData';

const DataCenterPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const regions = ['All', ...new Set(facilitiesData.map(f => f.region))];
  const statuses = ['All', ...new Set(facilitiesData.map(f => f.status))];

  const filteredFacilities = facilitiesData.filter(facility => {
    const matchesSearch = facility.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          facility.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || facility.region === regionFilter;
    const matchesStatus = statusFilter === 'All' || facility.status === statusFilter;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="bg-white">
      <PageBanner 
        title="Global Network" 
        description="Explore our state-of-the-art facilities strategically located across major global hubs." 
      />
      
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">LOCATIONS</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-12 text-[#0F172A] text-center">Facility Directory</h2>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm transition-shadow"
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Region:</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm font-medium text-gray-700 cursor-pointer"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full py-2 pl-3 pr-10 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm font-medium text-gray-700 cursor-pointer"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-200 text-[#64748B] uppercase tracking-wider text-sm font-bold">
                  <th className="py-5 px-6">Region / City</th>
                  <th className="py-5 px-6">Facility Name</th>
                  <th className="py-5 px-6">Power Capacity</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredFacilities.map((loc, i) => (
                    <motion.tr 
                      key={loc.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-emerald-50/50 transition-colors group"
                    >
                      <td className="py-5 px-6">
                        <div className="font-medium text-[#0F172A]">{loc.city}, {loc.state}</div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">{loc.region}</div>
                      </td>
                      <td className="py-5 px-6 font-mono text-[#166E18] font-semibold text-lg">{loc.facilityName}</td>
                      <td className="py-5 px-6 text-[#64748B]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-bold text-gray-800">
                            <div className="w-2 h-2 rounded-full bg-[#166E18] group-hover:animate-pulse"></div>
                            {loc.capacity}
                          </div>
                          <div className="text-xs font-semibold text-gray-500">Tier: {loc.tier}</div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                          loc.status === 'Operational' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : loc.status === 'Expanding'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            loc.status === 'Operational' ? 'bg-green-500' : loc.status === 'Expanding' ? 'bg-secondary' : 'bg-yellow-500'
                          }`}></span>
                          {loc.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button
                          onClick={() => navigate(`/data-center/facilities/${loc.slug}`)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-accent text-accent font-bold rounded-lg hover:bg-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary shadow-sm"
                        >
                          View Facility
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredFacilities.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-gray-500">
                        No facilities found matching your criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataCenterPage;
