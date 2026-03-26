'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SalesReturn, returnUtils } from '@/lib/api/returns'
import { Package, Calendar, User, FileText, CreditCard } from 'lucide-react'
import { format } from 'date-fns'

interface ReturnDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  returnData: SalesReturn | null
}

export function ReturnDetailsModal({
  isOpen,
  onClose,
  returnData
}: ReturnDetailsModalProps) {
  if (!returnData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Return Details - {returnData.returnNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Return Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={returnUtils.getStatusColor(returnData.status)}>
                      {returnData.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">QC Status</label>
                  <div className="mt-1">
                    <Badge className={returnUtils.getQcStatusColor(returnData.qcStatus)}>
                      {returnData.qcStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Credit Note</label>
                  <div className="mt-1">
                    <Badge variant={returnData.creditNoteIssued ? "default" : "secondary"}>
                      {returnData.creditNoteIssued ? "Issued" : "Not Issued"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Return Amount</label>
                  <div className="mt-1 font-semibold text-lg">
                    ₹{returnData.totalReturnAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Original Order Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Number</label>
                  <div className="mt-1 font-medium">{returnData.originalOrderId.orderNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(returnData.originalOrderId.orderedAt), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Amount</label>
                  <div className="mt-1 font-medium">₹{returnData.originalOrderId.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnData.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">
                          {item.medicineId?.productName || item.categoryProductId?.productName || 'Unknown Product'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Code: {item.medicineId?.itemCode || item.categoryProductId?.itemCode || 'N/A'}
                        </p>
                        {item.medicineId?.manufacturer && (
                          <p className="text-sm text-muted-foreground">
                            Manufacturer: {item.medicineId.manufacturer}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Batch Number:</span>
                          <span className="text-sm font-medium">{item.batchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Return Quantity:</span>
                          <span className="text-sm font-medium">{item.returnQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Return Reason:</span>
                          <span className="text-sm font-medium">
                            {returnUtils.formatReturnReason(item.returnReason)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Unit Price:</span>
                          <span className="text-sm font-medium">₹{item.unitPriceAtSale.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tax Amount:</span>
                          <span className="text-sm font-medium">₹{item.taxAmountAtSale.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">Return Requested</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(returnData.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                {returnData.status !== 'Requested' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium">Status Updated to {returnData.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(returnData.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                )}

                {returnData.approvedBy && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Return Approved</p>
                      <p className="text-sm text-muted-foreground">
                        Approved by: {returnData.approvedBy}
                      </p>
                      {returnData.approvalRemarks && (
                        <p className="text-sm text-muted-foreground">
                          Remarks: {returnData.approvalRemarks}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {returnData.creditNoteIssued && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Credit Note Issued</p>
                      {returnData.creditNoteId && (
                        <p className="text-sm text-muted-foreground">
                          Credit Note ID: {returnData.creditNoteId}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}