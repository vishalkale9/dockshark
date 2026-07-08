import React from 'react';
import FileUploader from '@/components/dashboard/FileUploader';

export default function UploadPage() {
  return (
    <div className="p-8 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#141B34] dark:text-white tracking-tight">
          Upload Documents
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          Select a file to securely hash and anchor to the blockchain.
        </p>
      </div>

      <div>
        <FileUploader />
      </div>
    </div>
  );
}
