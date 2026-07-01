import React from 'react';

const FeatureComparison = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compare Features</h2>
          <p className="text-lg text-slate-400">Everything included in our enterprise solutions.</p>
        </div>

        <div className="bg-slate-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-800">
              {features.map((feature, index) => (
                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-5 px-6 w-1/3 border-r border-gray-800">
                    <span className="font-semibold text-white">{feature.name}</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-slate-400 leading-relaxed">{feature.description}</span>
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

export default FeatureComparison;
