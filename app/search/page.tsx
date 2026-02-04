"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, ChevronLeft, ChevronRight, Pill, FlaskConical, Package, Stethoscope, X } from "lucide-react"
import Link from "next/link"
import { searchApi } from "@/lib/api/search"
import { useToast } from "@/hooks/use-toast"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "")
  const [results, setResults] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState("all")
  const itemsPerPage = 20

  React.useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query, 1)
    }
  }, [searchParams])

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await searchApi.search(query, { limit: itemsPerPage, page })
      if (data.success) {
        setResults(data.results)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handlePageChange = (page: number) => {
    performSearch(searchQuery, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getTotalResults = () => {
    if (!results) return 0
    return (
      (results.medicines?.total || 0) +
      (results.labTests?.total || 0) +
      (results.categoryProducts?.total || 0) +
      (results.categories?.total || 0) +
      (results.doctors?.total || 0)
    )
  }

  const getTabCount = (tab: string) => {
    if (!results) return 0
    switch (tab) {
      case "medicines":
        return results.medicines?.total || 0
      case "labTests":
        return results.labTests?.total || 0
      case "products":
        return results.categoryProducts?.total || 0
      case "doctors":
        return results.doctors?.total || 0
      default:
        return getTotalResults()
    }
  }

  const getTotalPages = (categoryData: any) => {
    if (!categoryData || !categoryData.total) return 1
    return Math.ceil(categoryData.total / itemsPerPage)
  }

  if (!searchQuery) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Search ArogyaRx</h2>
            <p className="text-muted-foreground">Enter a search term to find medicines, tests, and more</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      {/* Search Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines, tests, doctors..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>

        {!loading && results && (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <Badge variant="secondary">{getTotalResults()} results</Badge>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Searching...</p>
          </div>
        </div>
      ) : results && getTotalResults() > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({getTotalResults()})
            </TabsTrigger>
            <TabsTrigger value="medicines">
              <Pill className="h-4 w-4 mr-1" />
              Medicines ({getTabCount("medicines")})
            </TabsTrigger>
            <TabsTrigger value="labTests">
              <FlaskConical className="h-4 w-4 mr-1" />
              Tests ({getTabCount("labTests")})
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-1" />
              Products ({getTabCount("products")})
            </TabsTrigger>
            <TabsTrigger value="doctors">
              <Stethoscope className="h-4 w-4 mr-1" />
              Doctors ({getTabCount("doctors")})
            </TabsTrigger>
          </TabsList>

          {/* All Results Tab */}
          <TabsContent value="all" className="mt-6">
            <div className="space-y-8">
              {/* Medicines Section */}
              {results.medicines?.count > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Medicines
                    <Badge variant="secondary">{results.medicines.total}</Badge>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.medicines.data.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Link href={`/medicines/${item.id}`}>
                            <div className="flex gap-3">
                              <img
                                src={item.images?.[0] || "/placeholder.svg"}
                                alt={item.name}
                                className="h-20 w-20 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">{item.brandName}</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-lg font-bold">₹{item.pricing?.sellingPrice}</span>
                                  {item.pricing?.discount > 0 && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      ₹{item.pricing?.mrp}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {results.medicines.hasMore && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("medicines")}
                    >
                      View All Medicines →
                    </Button>
                  )}
                </div>
              )}

              {/* Lab Tests Section */}
              {results.labTests?.count > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Lab Tests
                    <Badge variant="secondary">{results.labTests.total}</Badge>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.labTests.data.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Link href={`/lab-tests/${item.id}`}>
                            <div className="flex gap-3">
                              <div className="h-20 w-20 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                <FlaskConical className="h-8 w-8 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {typeof item.category === 'object' ? item.category?.name : item.category}
                                </p>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-lg font-bold">₹{item.discountedPrice}</span>
                                  {item.discount > 0 && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      ₹{item.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {results.labTests.hasMore && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("labTests")}
                    >
                      View All Lab Tests →
                    </Button>
                  )}
                </div>
              )}

              {/* Products Section */}
              {results.categoryProducts?.count > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products
                    <Badge variant="secondary">{results.categoryProducts.total}</Badge>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.categoryProducts.data.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Link href={`/products/${item.id}`}>
                            <div className="flex gap-3">
                              <img
                                src={item.images?.[0] || "/placeholder.svg"}
                                alt={item.name}
                                className="h-20 w-20 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {typeof item.category === 'object' ? item.category?.name : item.category}
                                </p>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-lg font-bold">₹{item.pricing?.sellingPrice}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {results.categoryProducts.hasMore && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("products")}
                    >
                      View All Products →
                    </Button>
                  )}
                </div>
              )}

              {/* Doctors Section */}
              {results.doctors?.count > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Doctors
                    <Badge variant="secondary">{results.doctors.total}</Badge>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.doctors.data.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Link href={`/doctors/${item.id}`}>
                            <div className="flex gap-3">
                              <img
                                src={item.profileImage || "/placeholder.svg"}
                                alt={item.name}
                                className="h-20 w-20 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm hover:text-primary">
                                  Dr. {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">{item.specialization}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.experience} years exp.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {results.doctors.hasMore && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("doctors")}
                    >
                      View All Doctors →
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Individual Category Tabs with Pagination */}
          {["medicines", "labTests", "products", "doctors"].map((category) => {
            const categoryKey = category === "products" ? "categoryProducts" : category
            const categoryData = results[categoryKey]
            
            if (!categoryData || categoryData.total === 0) return null

            return (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryData.data.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Link href={`/${category}/${item.id}`}>
                            <div className="flex gap-3">
                              {category === "doctors" ? (
                                <img
                                  src={item.profileImage || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-20 w-20 rounded-full object-cover"
                                />
                              ) : category === "labTests" ? (
                                <div className="h-20 w-20 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                  <FlaskConical className="h-8 w-8 text-primary" />
                                </div>
                              ) : (
                                <img
                                  src={item.images?.[0] || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-20 w-20 rounded object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                                  {category === "doctors" ? `Dr. ${item.name}` : item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.brandName || 
                                   (typeof item.category === 'object' ? item.category?.name : item.category) || 
                                   item.specialization}
                                </p>
                                {category !== "doctors" && (
                                  <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-lg font-bold">
                                      ₹{item.pricing?.sellingPrice || item.discountedPrice}
                                    </span>
                                    {(item.pricing?.discount > 0 || item.discount > 0) && (
                                      <span className="text-xs text-muted-foreground line-through">
                                        ₹{item.pricing?.mrp || item.price}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {getTotalPages(categoryData) > 1 && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {getTotalPages(categoryData)} • Total: {categoryData.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!categoryData.hasMore}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      ) : results ? (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            No results found for "{searchQuery}". Try different keywords.
          </p>
        </Card>
      ) : null}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-8 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
