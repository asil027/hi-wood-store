import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-[#111111]">Privacy Policy</h1>
        <div className="prose text-sm text-neutral-600 space-y-4">
          <p>At Hiwood Pakistan, accessible from hiwood.pk, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Hiwood and how we use it.</p>
          <h3 className="text-base font-bold text-[#111111]">Information We Collect</h3>
          <p>When you place an order, we collect your full name, email address, phone number, shipping address, and city for the exclusive purpose of processing, dispatching, and delivering your order.</p>
          <h3 className="text-base font-bold text-[#111111]">Data Security</h3>
          <p>We do not store plain-text passwords or sensitive debit/credit card numbers on our servers. All customer accounts are protected with bcrypt hashing and industry-standard TLS encryption.</p>
        </div>
      </div>
    </div>
  );
}
