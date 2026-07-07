import React from 'react';

const BillingSummary = ({
  productName,
  productCategory,
  subscriptionPlan,
  billingCycle,
  duration,
  quantity,
  unitPrice,
  subtotal,
  discount,
  taxableAmount,
  gstAmount,
  grandTotal,
  isEditable = false,
  onDiscountChange
}) => {
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? '₹0.00' : `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
          Billing Summary
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Product Details - Compact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 pb-5 border-b border-slate-800/80">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Product</p>
            <p className="text-sm font-semibold text-slate-200 truncate" title={productName}>{productName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Category</p>
            <p className="text-sm font-medium text-slate-300">{productCategory || 'N/A'}</p>
          </div>
          <div className="hidden lg:block">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Plan</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{subscriptionPlan || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Cycle</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{billingCycle || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Duration</p>
            <p className="text-sm font-medium text-slate-300">{duration || 'N/A'}</p>
          </div>
          <div className="lg:hidden">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Plan</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{subscriptionPlan || 'N/A'}</p>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-1">
          <div className="flex justify-between items-center group">
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Unit Price</span>
            <span className="text-sm font-medium text-slate-200">{formatCurrency(unitPrice)}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Quantity</span>
            <span className="text-sm font-medium text-slate-200">{quantity || 1}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 border-dashed">
            <span className="text-sm text-slate-400">Subtotal</span>
            <span className="text-sm font-medium text-slate-200">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-emerald-500/80">Discount</span>
            {isEditable ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-emerald-400">-₹</span>
                <input 
                  type="number" 
                  value={discount || ''}
                  onChange={(e) => onDiscountChange && onDiscountChange(e.target.value)}
                  placeholder="0.00"
                  className="w-24 bg-slate-950/50 border border-emerald-500/30 text-emerald-400 rounded-md px-2 py-1 text-sm text-right focus:outline-none focus:border-emerald-500 transition-colors shadow-inner shadow-emerald-900/20"
                />
              </div>
            ) : (
              <span className="text-sm font-semibold text-emerald-400">-{formatCurrency(discount)}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 border-dashed">
            <span className="text-sm text-slate-400">Taxable Amount</span>
            <span className="text-sm font-medium text-slate-200">{formatCurrency(taxableAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">GST (18%)</span>
            <span className="text-sm font-medium text-slate-200">{formatCurrency(gstAmount)}</span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="mt-4 pt-5 border-t border-slate-700/80 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-full border border-slate-700/50">
            Final
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Grand Total</span>
              <span className="text-[10px] text-slate-500">Including 18% GST</span>
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSummary;
