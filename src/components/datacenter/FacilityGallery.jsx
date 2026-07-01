import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FacilityGallery = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Facility Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Take a look inside our state-of-the-art infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-w-16 aspect-h-9 md:aspect-none md:h-full">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gray-300 focus:outline-none"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 right-0 text-center text-white font-bold text-xl">
              {selectedImage.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FacilityGallery;
