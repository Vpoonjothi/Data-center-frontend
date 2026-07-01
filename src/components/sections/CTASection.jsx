import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTASection = () => {
  return (
    <section className="py-24 bg-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10"></div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-heading font-bold text-white mb-6">Ready to Scale Your Infrastructure?</h2>
        <p className="text-xl text-white/90 mb-10">Connect with our experts to design a customized data center solution for your enterprise.</p>
        <Link to="/contact">
          <Button variant="primary" className="bg-white text-accent hover:bg-gray-100 px-8 py-4 text-lg">
            Get a Quote Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
