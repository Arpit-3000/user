'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { returnsApi, returnUtils, SalesReturn } from '@/lib/api/returns'
import { Loader2, Package, Calendar, Eye, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'

interface ReturnsListProps {
  onViewReturn: (returnData: SalesReturn) => void
}

export function ReturnsList({ onViewReturn }: ReturnsListProps) {
  const { toast } = useToast()
  const [returns, setReturns] = useState<SalesReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    qcStatus: '',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  })

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Requested', label: 'Requested' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Received', label: 'Received' },
    { value: 'QC Completed', label: 'QC Completed' },
    { value: 'Rejected', label: 'Rejected' }
  ]

  const qcStatusOptions = [
    { value: '', label: 'All QC Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Passed (Restockable)', label: 'Passed (Restockable)' },
    { value: 'Failed (Scrap)', label: 'Failed (Scrap)' }
  ]

  const fetchReturns = async () => {
    setLoading(true)
    try {
      const response = await returnsApi.getReturns(filters)
      setReturns(response.data)
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      })
    } catch (error: any) {
      toast({
        title: "Failed to fetch returns",
        description: error.message || "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReturns()
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading returns...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">QC Status</label>
              <Select value={filters.qcStatus} onValueChange={(value) => handleFilterChange('qcStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select QC status" />
                </SelectTrigger>
                <SelectContent>
                  {qcStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns List */}
      {returns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Returns Found</h3>
            <p className="text-muted-foreground">You haven't created any return requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <Card key={returnItem._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{returnItem.returnNumber}</h3>
                      <Badge className={returnUtils.getStatusColor(returnItem.status)}>
                        {returnItem.status}
                      </Badge>
                      <Badge className={returnUtils.getQcStatusColor(returnItem.qcStatus)}>
                        QC: {returnItem.qcStatus}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Original Order: {returnItem.originalOrderId.orderNumber}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(returnItem.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span>Items: {returnItem.items.length}</span>
                      <span className="font-medium text-foreground">
                        Amount: ₹{returnItem.totalReturnAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {returnItem.items.slice(0, 2).map((item, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          {item.medicineId?.productName || item.categoryProductId?.productName || 'Unknown Product'}
                        </span>
                      ))}
                      {returnItem.items.length > 2 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          +{returnItem.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReturn(returnItem)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.total)} of{' '}
                {pagination.total} returns
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="flex items-center px-3 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}