import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateOffer } from '../../services/adminApi';
import { getOffers } from '../../services/api';

const AdminOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offerSuccess, setOfferSuccess] = useState(null);
  const [offerError, setOfferError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleOfferChange = (id, field, value) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, [field]: Number(value) } : offer
    ));
  };

  const handleOfferSubmit = async (e, offerId) => {
    e.preventDefault();
    setOfferError(null);
    setOfferSuccess(null);
    const offerToUpdate = offers.find(o => o.id === offerId);
    
    try {
      await updateOffer(offerId, {
        discount: offerToUpdate.discount,
        min_vcpu: offerToUpdate.min_vcpu,
        min_ram: offerToUpdate.min_ram
      });
      setOfferSuccess(`Updated ${offerToUpdate.name} successfully!`);
      setTimeout(() => setOfferSuccess(null), 3000);
    } catch (err) {
      setOfferError(err.response?.data?.message || 'Failed to update offer');
      setTimeout(() => setOfferError(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Promotional Offers</h1>
        <p className="text-gray-400">Manage discounts and minimum hardware requirements for Enterprise Server upsells.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        {offerError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6">
            {offerError}
          </div>
        )}
        {offerSuccess && (
          <div className="bg-secondary/10 border border-secondary/50 text-secondary p-4 rounded-xl text-sm mb-6">
            {offerSuccess}
          </div>
        )}

        {offersLoading ? (
          <div className="text-gray-400 py-4">Loading offers...</div>
        ) : (
          <div className="space-y-6">
            {offers.map(offer => (
              <form key={offer.id} onSubmit={(e) => handleOfferSubmit(e, offer.id)} className="bg-[#020817] p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h4 className="font-bold text-lg text-emerald-400">{offer.name}</h4>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Discount (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={offer.discount}
                      onChange={(e) => handleOfferChange(offer.id, 'discount', e.target.value)}
                      className="w-full bg-[#0a1128] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Min vCPU Required</label>
                    <input 
                      type="number"
                      min="1"
                      value={offer.min_vcpu}
                      onChange={(e) => handleOfferChange(offer.id, 'min_vcpu', e.target.value)}
                      className="w-full bg-[#0a1128] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Min RAM Required (GB)</label>
                    <input 
                      type="number"
                      min="1"
                      value={offer.min_ram}
                      onChange={(e) => handleOfferChange(offer.id, 'min_ram', e.target.value)}
                      className="w-full bg-[#0a1128] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOffersPage;
