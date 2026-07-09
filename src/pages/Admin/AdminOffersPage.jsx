import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateOffer, createOffer, deleteOffer } from '../../services/adminApi';
import { getOffers } from '../../services/api';
import { 
  Search, Filter, Plus, Edit2, Trash2, Copy, Eye,
  Tag, Activity, Clock, AlertCircle, Cpu, HardDrive,
  Calendar, CheckCircle2, XCircle
} from 'lucide-react';

// Status colors
const statusColors = {
  Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Scheduled: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Expired: 'text-red-400 bg-red-400/10 border-red-400/20',
  Draft: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

const AdminOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-status-filter')) setIsStatusFilterOpen(false);
      if (!e.target.closest('.custom-product-filter')) setIsProductFilterOpen(false);
      if (!e.target.closest('.custom-sort-filter')) setIsSortFilterOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setOffersLoading(true);
      const data = await getOffers();
      setOffers(data);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setOffersLoading(false);
    }
  };

  const handleOpenEdit = (offer = null) => {
    if (offer) {
      setCurrentOffer(offer);
    } else {
      setCurrentOffer({ 
        name: '', 
        discount: 0, 
        min_vcpu: 1, 
        min_ram: 1,
        product_category: 'Enterprise Servers',
        status: 'Draft',
        start_date: '',
        end_date: '',
        description: '',
        image_url: ''
      });
    }
    setIsEditModalOpen(true);
  };

  const handleOpenPreview = (offer) => {
    setCurrentOffer(offer);
    setIsPreviewModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentOffer.id) {
        await updateOffer(currentOffer.id, currentOffer);
      } else {
        await createOffer(currentOffer);
      }
      await fetchOffers();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error saving offer:', err);
      alert(err.response?.data?.message || 'Failed to save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(id);
      await fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert(err.response?.data?.message || 'Failed to delete offer');
    }
  };

  const handleDuplicateOffer = async (offer) => {
    try {
      const duplicated = { ...offer, name: `${offer.name} (Copy)` };
      delete duplicated.id;
      delete duplicated.createdAt;
      delete duplicated.updatedAt;
      await createOffer(duplicated);
      await fetchOffers();
    } catch (err) {
      console.error('Error duplicating offer:', err);
    }
  };

  // Filter and Sort Logic
  const filteredOffers = useMemo(() => {
    return offers
      .filter(o => 
        (statusFilter === 'All' || o.status === statusFilter) &&
        (productFilter === 'All' || o.product_category === productFilter) &&
        (o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (o.description && o.description.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'Highest Discount') return b.discount - a.discount;
        if (sortBy === 'Ending Soon') {
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return new Date(a.end_date) - new Date(b.end_date);
        }
        return 0;
      });
  }, [offers, searchTerm, statusFilter, productFilter, sortBy]);

  // KPIs
  const activeCount = offers.filter(o => o.status === 'Active').length;
  const scheduledCount = offers.filter(o => o.status === 'Scheduled').length;
  const expiredCount = offers.filter(o => o.status === 'Expired').length;
  const avgDiscount = offers.length > 0 
    ? Math.round(offers.reduce((acc, curr) => acc + curr.discount, 0) / offers.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#020817] text-white p-6 md:p-8 font-sans">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-3">
              Offer Management
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Create and manage promotional campaigns for AI Servers, Enterprise Servers, and Colocation services.
            </p>
          </div>
          <button 
            onClick={() => handleOpenEdit()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/50 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Create Offer
          </button>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KpiCard icon={<Tag />} label="Total Offers" value={offers.length} />
          <KpiCard icon={<Activity />} label="Active Offers" value={activeCount} color="text-emerald-400" />
          <KpiCard icon={<Clock />} label="Scheduled" value={scheduledCount} color="text-yellow-400" />
          <KpiCard icon={<AlertCircle />} label="Expired" value={expiredCount} color="text-red-400" />
          <KpiCard icon={<Tag />} label="Avg Discount" value={`${avgDiscount}%`} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Search & Filters */}
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a1128]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder-gray-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="relative custom-status-filter min-w-[140px]">
              <button
                type="button"
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className="w-full flex items-center justify-between bg-[#0a1128]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <span className="truncate">{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                <svg className={`shrink-0 w-4 h-4 ml-2 transition-transform ${isStatusFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isStatusFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 z-50 mt-2 w-full min-w-[140px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                  >
                    {['All', 'Active', 'Scheduled', 'Expired', 'Draft'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => { setStatusFilter(status); setIsStatusFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${statusFilter === status ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-300'}`}
                      >
                        {status === 'All' ? 'All Status' : status}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Filter */}
            <div className="relative custom-product-filter min-w-[160px]">
              <button
                type="button"
                onClick={() => setIsProductFilterOpen(!isProductFilterOpen)}
                className="w-full flex items-center justify-between bg-[#0a1128]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <span className="truncate">{productFilter === 'All' ? 'All Products' : productFilter}</span>
                <svg className={`shrink-0 w-4 h-4 ml-2 transition-transform ${isProductFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isProductFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 z-50 mt-2 w-full min-w-[160px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                  >
                    {['All', 'Enterprise Servers', 'AI Servers', 'Colocation'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setProductFilter(cat); setIsProductFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${productFilter === cat ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-300'}`}
                      >
                        {cat === 'All' ? 'All Products' : cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Filter */}
            <div className="relative custom-sort-filter min-w-[160px]">
              <button
                type="button"
                onClick={() => setIsSortFilterOpen(!isSortFilterOpen)}
                className="w-full flex items-center justify-between bg-[#0a1128]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <span className="truncate">{sortBy}</span>
                <svg className={`shrink-0 w-4 h-4 ml-2 transition-transform ${isSortFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isSortFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 md:left-0 z-50 mt-2 w-full min-w-[160px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                  >
                    {['Newest', 'Highest Discount', 'Ending Soon'].map(sort => (
                      <button
                        key={sort}
                        type="button"
                        onClick={() => { setSortBy(sort); setIsSortFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${sortBy === sort ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-300'}`}
                      >
                        {sort}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {offersLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p>Loading premium offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-3xl border-dashed">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <Tag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Promotional Offers</h3>
            <p className="text-gray-400 max-w-md mb-8">
              Create your first campaign to boost sales and attract new enterprise clients.
            </p>
            <button 
              onClick={() => handleOpenEdit()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
            >
              + Create Offer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredOffers.map(offer => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onEdit={() => handleOpenEdit(offer)}
                onDelete={() => handleDeleteOffer(offer.id)}
                onDuplicate={() => handleDuplicateOffer(offer)}
                onPreview={() => handleOpenPreview(offer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditOfferModal 
            offer={currentOffer} 
            onChange={(field, val) => setCurrentOffer({...currentOffer, [field]: val})}
            onClose={() => setIsEditModalOpen(false)} 
            onSave={handleSaveOffer}
            isSubmitting={isSubmitting}
          />
        )}
        {isPreviewModalOpen && (
          <PreviewOfferModal 
            offer={currentOffer} 
            onClose={() => setIsPreviewModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Subcomponents

const KpiCard = ({ icon, label, value, color = "text-white" }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-32"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        {icon}
      </div>
    </div>
    <div className={`text-3xl font-bold ${color}`}>
      {value}
    </div>
  </motion.div>
);

const OfferCard = ({ offer, onEdit, onDelete, onDuplicate, onPreview }) => {
  const statusClass = statusColors[offer.status || 'Draft'] || statusColors['Draft'];

  const formatDate = (dateString) => {
    if (!dateString) return 'Forever';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div 
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-[#0a1128]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col group relative overflow-hidden shadow-lg shadow-black/50"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="pr-16">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-tight uppercase line-clamp-2">
            {offer.name}
          </h3>
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-sm mb-3">
            {offer.discount}% OFF
          </span>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            {offer.product_category || 'Enterprise Servers'}
          </p>
        </div>
        <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusClass}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
          {offer.status || 'Draft'}
        </div>
      </div>

      {/* Middle: Requirements */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-6 flex-grow">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Minimum Requirements</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{offer.min_vcpu}</div>
              <div className="text-xs text-gray-400">vCPU</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{offer.min_ram}</div>
              <div className="text-xs text-gray-400">GB RAM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Validity & Actions */}
      <div className="flex items-end justify-between border-t border-white/5 pt-4 mt-auto">
        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(offer.start_date)} - {formatDate(offer.end_date)}</span>
          </div>
        </div>
        
        {/* Hover Actions Container */}
        <div className="flex items-center gap-1 bg-[#0a1128] p-1 rounded-xl border border-white/10 opacity-100 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ActionButton icon={<Eye />} onClick={onPreview} tooltip="Preview" />
          <ActionButton icon={<Edit2 />} onClick={onEdit} tooltip="Edit" />
          <ActionButton icon={<Copy />} onClick={onDuplicate} tooltip="Duplicate" />
          <ActionButton icon={<Trash2 />} onClick={onDelete} tooltip="Delete" color="hover:text-red-400" />
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, onClick, tooltip, color = "hover:text-emerald-400" }) => (
  <button 
    onClick={onClick}
    className={`p-2 text-gray-400 ${color} rounded-lg hover:bg-white/5 transition-colors group/btn relative`}
  >
    {React.cloneElement(icon, { className: 'w-4 h-4' })}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
      {tooltip}
    </span>
  </button>
);

const EditOfferModal = ({ offer, onChange, onClose, onSave, isSubmitting }) => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-product-dropdown')) {
        setIsProductDropdownOpen(false);
      }
      if (!e.target.closest('.custom-status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#020817] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 shadow-2xl"
      >
        <div className="sticky top-0 bg-[#020817]/90 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center z-20">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            {offer.id ? <Edit2 className="text-emerald-400 w-5 h-5" /> : <Plus className="text-emerald-400 w-5 h-5" />}
            {offer.id ? 'Edit Offer Configuration' : 'Create New Offer'}
          </h2>
          <button onClick={onClose} type="button" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Offer Name</label>
              <input 
                type="text" required value={offer.name || ''} 
                onChange={e => onChange('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. Q3 Enterprise Promo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Discount Percentage</label>
              <div className="relative">
                <input 
                  type="number" min="0" max="100" required value={offer.discount === '' ? '' : offer.discount}
                  onChange={e => onChange('discount', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Product Category</label>
              <div className="relative custom-product-dropdown">
                <button
                  type="button"
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className="w-full flex items-center justify-between bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <span>{offer.product_category || 'Enterprise Servers'}</span>
                  <svg className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isProductDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-50 mt-2 w-full bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                    >
                      {['Enterprise Servers', 'AI Servers', 'Colocation'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { onChange('product_category', cat); setIsProductDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${offer.product_category === cat ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> Minimum Requirements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">vCPU Cores</label>
                <input 
                  type="number" min="1" required value={offer.min_vcpu || 1}
                  onChange={e => onChange('min_vcpu', Number(e.target.value))}
                  className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">RAM (GB)</label>
                <input 
                  type="number" min="1" required value={offer.min_ram || 1}
                  onChange={e => onChange('min_ram', Number(e.target.value))}
                  className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Status & Validity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Status</label>
              <div className="relative custom-status-dropdown">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <span>{offer.status || 'Draft'}</span>
                  <svg className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isStatusDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-50 mt-2 w-full bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                    >
                      {['Draft', 'Scheduled', 'Active', 'Expired'].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => { onChange('status', status); setIsStatusDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${offer.status === status ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-300'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
              <input 
                type="date"
                value={offer.start_date ? offer.start_date.split('T')[0] : ''}
                onChange={e => onChange('start_date', e.target.value)}
                className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark] cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">End Date</label>
              <input 
                type="date"
                value={offer.end_date ? offer.end_date.split('T')[0] : ''}
                onChange={e => onChange('end_date', e.target.value)}
                className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>

          {/* Marketing Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Description / Marketing Text</label>
            <textarea 
              rows="3" value={offer.description || ''}
              onChange={e => onChange('description', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              placeholder="e.g. Upgrade to an Enterprise Server with a minimum of 4 vCPUs and get 20% off for the first 3 months."
            />
          </div>


          <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : (offer.id ? 'Save Changes' : 'Create Offer')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PreviewOfferModal = ({ offer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-gray-900 to-[#020817] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {offer.image_url ? (
          <div className="w-full h-48 bg-gray-800 bg-cover bg-center" style={{ backgroundImage: `url(${offer.image_url})` }} />
        ) : (
          <div className="w-full h-32 bg-gradient-to-r from-emerald-900/40 to-blue-900/40 flex items-center justify-center">
            <Tag className="w-12 h-12 text-emerald-500/50" />
          </div>
        )}
        
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors">
          <XCircle className="w-6 h-6" />
        </button>

        <div className="p-8 text-center relative -mt-12">
          <div className="inline-block px-6 py-2 bg-emerald-500 text-white font-black text-2xl rounded-full shadow-lg border-4 border-[#020817] mb-6 transform -rotate-2">
            {offer.discount}% OFF
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4 uppercase tracking-wide">{offer.name}</h2>
          
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            {offer.description || `Special discount on all ${offer.product_category}. Upgrade your infrastructure today.`}
          </p>

          <div className="flex flex-col items-center justify-center gap-2 mb-8 bg-white/5 py-4 rounded-2xl border border-white/5">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Requirements</span>
            <div className="flex items-center gap-4 text-white font-medium">
              <span>{offer.min_vcpu} vCPU</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <span>{offer.min_ram} GB RAM</span>
            </div>
          </div>

          <button type="button" onClick={onClose} className="w-full max-w-sm mx-auto py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-emerald-400 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Apply Offer Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOffersPage;
