import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-[#111111]">Terms & Conditions</h1>
        <div className="prose text-sm text-neutral-600 space-y-4">
          <p>Welcome to Hiwood. By accessing or using our website, placing an order, or browsing our bags, you agree to comply with and be bound by the following terms.</p>
          <h3 className="text-base font-bold text-[#111111]">Pricing & Currency</h3>
          <p>All prices listed on the Hiwood storefront are denominated in Pakistani Rupees (PKR / Rs.) and include all applicable local manufacturing costs.</p>
          <h3 className="text-base font-bold text-[#111111]">Orders & Availability</h3>
          <p>All orders placed are subject to product availability and stock verification. Hiwood reserves the right to cancel or decline orders in cases of pricing inaccuracies or suspected fraudulent activity.</p>
        </div>
      </div>
    </div>
  );
}
