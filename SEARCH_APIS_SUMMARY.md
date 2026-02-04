# Search APIs Summary - Complete Overview

## 📊 Search Bars & Their API Calls

### 1️⃣ **Navbar Search Bar** (`components/navbar.tsx`)

**API Used:** Unified Search API
```javascript
searchApi.search(searchQuery, { limit: 10, page: 1 })
```

**Endpoint:**
```
GET /api/search?q={query}&limit=10&page=1
```

**Features:**
- ✅ Searches across ALL categories (Medicines, Lab Tests, Products, Doctors, Categories)
- ✅ Returns 10 results per category
- ✅ Debounce: 300ms
- ✅ Shows dropdown with categorized results
- ✅ "View All" button redirects to `/search` page

**Response Structure:**
```json
{
  "success": true,
  "query": "paracetamol",
  "page": 1,
  "limit": 10,
  "totalResults": 45,
  "results": {
    "medicines": { "count": 10, "total": 25, "hasMore": true, "data": [...] },
    "labTests": { "count": 5, "total": 12, "hasMore": true, "data": [...] },
    "categoryProducts": { "count": 3, "total": 8, "hasMore": false, "data": [...] },
    "categories": { "count": 2, "total": 2, "hasMore": false, "data": [...] },
    "doctors": { "count": 0, "total": 0, "hasMore": false, "data": [] }
  }
}
```

---

### 2️⃣ **Medicines Page Search Bar** (`app/medicines/page.tsx`)

**APIs Used:** 
1. **With Search Query:** Unified Search API (Medicine-specific)
2. **Without Search Query:** Medicines API

#### When User Searches:
```javascript
searchApi.searchMedicines(searchQuery, { 
  limit: 20, 
  page: 1,
  letter: selectedLetter // if selected
})
```

**Endpoint:**
```
GET /api/search?q={query}&types=medicine&limit=20&page=1&letter=A
```

#### When Browsing (No Search):
```javascript
medicinesApi.getMedicines({
  page: 1,
  limit: 20,
  letter: 'A',
  category: 'Pain Relief',
  prescriptionRequired: false
})
```

**Endpoint:**
```
GET /api/medicines?page=1&limit=20&letter=A&category=Pain%20Relief&prescriptionRequired=false
```

**Features:**
- ✅ Debounce: 1000ms (1 second)
- ✅ Alphabet filter support
- ✅ Category filter
- ✅ Prescription filter
- ✅ Pagination (20 items per page)
- ✅ Smart switching between search and browse APIs

**Response Structure (Search):**
```json
{
  "success": true,
  "query": "paracetamol",
  "results": {
    "medicines": {
      "count": 20,
      "total": 45,
      "hasMore": true,
      "data": [
        {
          "_id": "...",
          "productName": "Paracetamol 500mg",
          "genericName": "Acetaminophen",
          "brandName": "Crocin",
          "pricing": { "mrp": 50, "sellingPrice": 45, "discount": 10 },
          "stock": { "quantity": 100, "available": true },
          "images": ["..."],
          "prescriptionRequired": false
        }
      ]
    }
  }
}
```

**Response Structure (Browse):**
```json
{
  "success": true,
  "count": 20,
  "totalMedicines": 150,
  "totalPages": 8,
  "currentPage": 1,
  "letter": "A",
  "data": [...]
}
```

---

### 3️⃣ **Lab Tests Page Search Bar** (`app/lab-tests/page.tsx`)

**API Used:** Lab Tests API (with search parameter)
```javascript
labTestsApi.getAllTypes({
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: 'asc',
  search: searchQuery,
  category: 'Blood Tests',
  isHomeCollection: true,
  isPopular: true,
  isRecommended: true
})
```

**Endpoint:**
```
GET /api/lab-tests/all-types?page=1&limit=20&search={query}&category=Blood%20Tests&isHomeCollection=true
```

**Features:**
- ✅ No debouncing (direct search)
- ✅ Category filter
- ✅ Home collection filter
- ✅ Popular/Recommended filters
- ✅ Sorting options
- ✅ Pagination (20 items per page)

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "_id": "...",
        "testName": "Complete Blood Count",
        "category": "Blood Tests",
        "price": 500,
        "discountedPrice": 450,
        "discount": 10,
        "isHomeCollection": true,
        "homeCollectionPrice": 50,
        "isPopular": true,
        "isRecommended": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTests": 95,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "statistics": {
      "totalTests": 95,
      "homeCollectionTests": 80,
      "popularTests": 25
    }
  }
}
```

---

### 4️⃣ **Products Page Search Bar** (`app/products/page.tsx`)

**API Used:** Category Products API (with search parameter)
```javascript
categoryProductsApi.getAll({
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: 'asc',
  search: searchQuery,
  categoryId: selectedCategory,
  inStock: true,
  prescriptionRequired: false,
  minPrice: 100,
  maxPrice: 1000
})
```

**Endpoint:**
```
GET /api/category-products/category/category-products?page=1&limit=20&search={query}&categoryId={id}&inStock=true
```

**Features:**
- ✅ No debouncing (direct search)
- ✅ Category filter (required)
- ✅ Stock filter
- ✅ Prescription filter
- ✅ Price range filter
- ✅ Sorting options
- ✅ Pagination (20 items per page)

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "productName": "Face Cream",
      "category": { "_id": "...", "name": "Skincare" },
      "pricing": {
        "mrp": 500,
        "sellingPrice": 450,
        "discount": 10
      },
      "stock": {
        "quantity": 50,
        "available": true
      },
      "images": ["..."],
      "prescriptionRequired": false
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProducts": 55,
    "hasNextPage": true
  }
}
```

---

## 🔄 API Comparison Table

| Search Bar | API Endpoint | Debounce | Multi-Category | Filters | Pagination |
|------------|-------------|----------|----------------|---------|------------|
| **Navbar** | `/api/search` | 300ms | ✅ Yes (All) | ❌ No | ✅ Yes |
| **Medicines** | `/api/search` (search)<br>`/api/medicines` (browse) | 1000ms | ❌ No (Medicines only) | ✅ Yes | ✅ Yes |
| **Lab Tests** | `/api/lab-tests/all-types` | ❌ No | ❌ No (Lab Tests only) | ✅ Yes | ✅ Yes |
| **Products** | `/api/category-products/...` | ❌ No | ❌ No (Products only) | ✅ Yes | ✅ Yes |

---

## 📝 Key Differences

### Navbar Search:
- **Purpose:** Quick global search across all categories
- **Use Case:** User wants to find anything quickly
- **Result:** Shows limited results (10 per category) with "View All" option
- **API:** Unified Search API (`/api/search`)

### Medicines Page Search:
- **Purpose:** Detailed medicine search with filters
- **Use Case:** User browsing medicines with specific criteria
- **Result:** Full paginated results (20 per page)
- **API:** Switches between Unified Search (when searching) and Medicines API (when browsing)

### Lab Tests Page Search:
- **Purpose:** Search within lab tests with filters
- **Use Case:** User looking for specific tests
- **Result:** Full paginated results (20 per page)
- **API:** Lab Tests API with search parameter

### Products Page Search:
- **Purpose:** Search within category products
- **Use Case:** User browsing products in a category
- **Result:** Full paginated results (20 per page)
- **API:** Category Products API with search parameter

---

## 🎯 Search Flow Diagram

```
User Types in Search Bar
         ↓
    Debounce Timer
         ↓
┌────────┴────────┐
│                 │
Navbar Search     Page-Specific Search
     ↓                    ↓
/api/search          Page-Specific API
     ↓                    ↓
All Categories      Single Category
     ↓                    ↓
10 results/cat      20 results/page
     ↓                    ↓
View All Button     Pagination
     ↓
/search page
```

---

## 💡 Best Practices

1. **Navbar Search:** Use for quick global search
2. **Page Search:** Use for detailed, filtered search within a category
3. **Debouncing:** Reduces API calls, improves performance
4. **Pagination:** Handles large result sets efficiently
5. **Filters:** Allows users to narrow down results

---

## 🚀 Performance Optimization

- **Navbar:** 300ms debounce, 10 results limit
- **Medicines:** 1000ms debounce, smart API switching
- **Lab Tests:** Direct search, efficient filtering
- **Products:** Direct search, category-based optimization

All search implementations are optimized for performance and user experience!
