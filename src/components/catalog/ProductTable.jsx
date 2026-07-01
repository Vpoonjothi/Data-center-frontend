import React from 'react';

const ProductTable = ({ plans }) => {
  if (!plans || plans.length === 0) return null;

  return (
    <section className="py-20 bg-[#020817]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-slate-900/50 backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0a1128] border-b border-gray-800 text-slate-300 text-sm uppercase tracking-wider">
                <th className="py-5 px-6 font-semibold">Plan Name</th>
                <th className="py-5 px-6 font-semibold">CPU</th>
                <th className="py-5 px-6 font-semibold">RAM</th>
                <th className="py-5 px-6 font-semibold">Storage</th>
                <th className="py-5 px-6 font-semibold">Bandwidth</th>
                <th className="py-5 px-6 font-semibold">Price</th>
                <th className="py-5 px-6 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {plans.map((plan, index) => (
                <tr key={index} className="hover:bg-emerald-900/10 transition-colors group">
                  <td className="py-5 px-6">
                    <span className="font-bold text-white text-lg">{plan.name}</span>
                  </td>
                  <td className="py-5 px-6 text-slate-300 font-medium">{plan.cpu}</td>
                  <td className="py-5 px-6 text-slate-300">{plan.ram}</td>
                  <td className="py-5 px-6 text-slate-300">{plan.storage}</td>
                  <td className="py-5 px-6 text-slate-300">{plan.bandwidth}</td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">₹{plan.price}</span>
                      <span className="text-xs text-slate-500">/month</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button className="px-6 py-2.5 bg-accent hover:bg-secondary text-white text-sm font-semibold rounded-lg transition-colors opacity-90 group-hover:opacity-100">
                      Buy Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductTable;
