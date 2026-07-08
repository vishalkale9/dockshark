import React from 'react';
import DocumentLedger from '@/components/dashboard/DocumentLedger';

export default function LedgerPage() {
  return (
    <div className="p-8 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#141B34] dark:text-white tracking-tight">
          Document Ledger
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          View all your securely hashed and anchored documents.
        </p>
      </div>

      <DocumentLedger />
    </div>
  );
}
