'use client';

import { useState } from 'react';
import { ReturnsList } from '@/components/returns-list';
import { ReturnDetailsModal } from '@/components/return-details-modal';
import { SalesReturn } from '@/lib/api/returns';
import { Package } from 'lucide-react';

export default function ReturnsPage() {
  const [showReturnDetails, setShowReturnDetails] = useState(false);
  const [selectedReturnForDetails, setSelectedReturnForDetails] = useState<SalesReturn | null>(null);

  const handleViewReturn = (returnData: SalesReturn) => {
    setSelectedReturnForDetails(returnData);
    setShowReturnDetails(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Returns</h1>
        </div>
        <p className="text-muted-foreground">Track and manage your return requests</p>
      </div>

      <ReturnsList onViewReturn={handleViewReturn} />

      {/* Return Details Modal */}
      <ReturnDetailsModal
        isOpen={showReturnDetails}
        onClose={() => {
          setShowReturnDetails(false);
          setSelectedReturnForDetails(null);
        }}
        returnData={selectedReturnForDetails}
      />
    </div>
  );
}