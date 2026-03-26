'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { returnsApi, ReturnItem } from '@/lib/api/returns'
import { Loader2, Package, AlertCircle } from 'lucide-react'

interface OrderItem {
  _id: string
  medicineId?: {
    _id: string
    productName: string
    itemCode: string
  }
  categoryProductId?: {
    _id: string
    productName: string
    itemCode: string
  }
  productType: 'medicine' | 'categoryProduct'
  quantity: number
  batchNumber?: string
  price: number
}

interface ReturnRequestModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    _id: string
    orderNumber: string
    items: OrderItem[]
    orderedAt: string
  }
  onReturnCreated: () => void
}

export function ReturnRequestModal({
  isOpen,
  onClose,
  order,
  onReturnCreated
}: ReturnRequestModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Record<string, ReturnItem>>({})
  const [customReasons, setCustomReasons] = useState<Record<string, string>>({})

  const returnReasons = [
    { value: 'Expired', label: 'Product Expired' },
    { value: 'Damaged', label: 'Product Damaged' },
    { value: 'Wrong Item', label: 'Wrong Item Delivered' },
    { value: 'Other', label: 'Other' }
  ]

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      const orderItem = order.items.find(item => item._id === itemId)
      if (orderItem) {
        // Auto-generate batch number if not available
        const autoBatchNumber = orderItem.batchNumber || `BATCH-${Date.now().toString().slice(-6)}`
        
        setSelectedItems(prev => ({
          ...prev,
          [itemId]: {
            productType: orderItem.productType,
            medicineId: orderItem.medicineId?._id,
            categoryProductId: orderItem.categoryProductId?._id,
            batchNumber: autoBatchNumber,
            returnQuantity: 1,
            returnReason: 'Expired'
          }
        }))
      }
    } else {
      setSelectedItems(prev => {
        const newItems = { ...prev }
        delete newItems[itemId]
        return newItems
      })
    }
  }
  const updateReturnItem = (itemId: string, field: keyof ReturnItem, value: any) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async () => {
    const items = Object.values(selectedItems)
    
    if (items.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to return",
        variant: "destructive"
      })
      return
    }

    // Validate all items have required fields and valid quantities
    const invalidItems = Object.entries(selectedItems).filter(([itemId, item]) => {
      const orderItem = order.items.find(oi => oi._id === itemId);
      const hasValidReason = item.returnReason && 
        (item.returnReason !== 'Other' || (customReasons[itemId] && customReasons[itemId].trim().length > 0));
      
      return (
        !hasValidReason || 
        item.returnQuantity <= 0 ||
        item.returnQuantity > (orderItem?.quantity || 0)
      );
    });

    if (invalidItems.length > 0) {
      toast({
        title: "Invalid return data",
        description: "Please check return quantities don't exceed ordered quantities and select valid return reasons",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Prepare items with custom reasons
      const itemsWithCustomReasons = items.map((item, index) => {
        const itemId = Object.keys(selectedItems)[index];
        return {
          ...item,
          returnReason: item.returnReason === 'Other' 
            ? customReasons[itemId] || 'Other' 
            : item.returnReason
        };
      });

      await returnsApi.createReturn({
        originalOrderId: order._id,
        items: itemsWithCustomReasons
      })

      toast({
        title: "Return request created",
        description: "Your return request has been submitted successfully"
      })

      onReturnCreated()
      onClose()
      setSelectedItems({})
    } catch (error: any) {
      toast({
        title: "Failed to create return",
        description: error.message || "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedItems({})
    setCustomReasons({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Return Request - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">Return Policy</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Returns are only accepted within 48 hours of order delivery. Please ensure items are in original condition.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Items to Return</h3>
            
            {order.items.map((item) => {
              const itemId = item._id
              const isSelected = itemId in selectedItems
              const productName = item.medicineId?.productName || item.categoryProductId?.productName || 'Unknown Product'
              
              // Get original order item data for display
              const orderQuantity = item.quantity
              const orderPrice = item.price

              // Debug: Check if price and quantity are available
              console.log('Item data:', { 
                productName, 
                quantity: orderQuantity, 
                price: orderPrice,
                fullItem: item 
              })

              return (
                <div key={itemId} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleItemSelect(itemId, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{productName}</h4>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Ordered Quantity: {orderQuantity || 'N/A'} | Price: ₹{orderPrice || '0'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`quantity-${itemId}`}>Return Quantity *</Label>
                            <Input
                              id={`quantity-${itemId}`}
                              type="number"
                              min="1"
                              max={orderQuantity}
                              value={selectedItems[itemId]?.returnQuantity || 1}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                // Ensure value doesn't exceed ordered quantity
                                const clampedValue = Math.min(Math.max(1, value), orderQuantity);
                                updateReturnItem(itemId, 'returnQuantity', clampedValue);
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Max: {orderQuantity}
                            </p>
                          </div>

                          <div>
                            <Label htmlFor={`reason-${itemId}`}>Return Reason *</Label>
                            <Select
                              value={selectedItems[itemId]?.returnReason || ''}
                              onValueChange={(value) => updateReturnItem(itemId, 'returnReason', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnReasons.map((reason) => (
                                  <SelectItem key={reason.value} value={reason.value}>
                                    {reason.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Custom reason text box - Show when "Other" is selected */}
                            {selectedItems[itemId]?.returnReason === 'Other' && (
                              <div className="mt-2">
                                <Input
                                  placeholder="Please specify the reason..."
                                  value={customReasons[itemId] || ''}
                                  onChange={(e) => setCustomReasons(prev => ({
                                    ...prev,
                                    [itemId]: e.target.value
                                  }))}
                                  className="text-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Return Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}