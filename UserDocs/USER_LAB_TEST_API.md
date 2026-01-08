# User Lab Test APIs - Complete Guide

## Base URL
```
http://localhost:5000/api/lab-tests
```

**Note:** All endpoints are public and do not require authentication.

---

## Table of Contents
1. [Get All Lab Tests](#1-get-all-lab-tests)
2. [Get Lab Test by ID](#2-get-lab-test-by-id)
3. [Get All Lab Test Types (Advanced)](#3-get-all-lab-test-types-advanced)
4. [Search Lab Tests](#4-search-lab-tests)
5. [Get Lab Test Categories](#5-get-lab-test-categories)

---

## Overview

Lab tests can be browsed, searched, and filtered by various criteria:
- **Category** - Blood Tests, Urine Tests, Imaging, etc.
- **Price Range** - Filter by minimum and maximum price
- **Home Collection** - Tests available for home sample collection
- **Popular Tests** - Frequently ordered tests
- **Recommended Tests** - Doctor-recommended tests

---

## 1. Get All Lab Tests

**Endpoint:** `GET /api/lab-tests`

**Description:** Get all lab tests with pagination, sorting, and filtering.

**Headers:**
```
None (Public endpoint)
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Number | No | Page number (default: 1) |
| limit | Number | No | Items per page (default: 10) |
| sort | String | No | Sort field (e.g., "price", "-createdAt") |
| fields | String | No | Fields to include (comma-separated) |
| category | String | No | Filter by category |
| isHomeCollectionAvailable | Boolean | No | Filter by home collection availability |

**Example Requests:**
```
GET /api/lab-tests
GET /api/lab-tests?page=1&limit=20
GET /api/lab-tests?category=Blood Tests
GET /api/lab-tests?isHomeCollectionAvailable=true
GET /api/lab-tests?sort=-price&limit=10
GET /api/lab-tests?fields=testName,price,category
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    }
  },
  "data": [
    {
      "_id": "64lab123abc",
      "testName": "Complete Blood Count (CBC)",
      "testCode": "CBC001",
      "category": "Blood Tests",
      "description": "Comprehensive blood analysis including RBC, WBC, platelets",
      "price": 500,
      "discount": 10,
      "discountedPrice": 450,
      "isHomeCollectionAvailable": true,
      "homeCollectionPrice": 100,
      "preparationInstructions": "Fasting for 8-12 hours required",
      "reportDeliveryTime": "24 hours",
      "parameters": [
        {
          "name": "Hemoglobin",
          "unit": "g/dL",
          "normalRange": "13-17 (Male), 12-15 (Female)"
        },
        {
          "name": "WBC Count",
          "unit": "cells/μL",
          "normalRange": "4000-11000"
        }
      ],
      "isPopular": true,
      "isRecommended": false,
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const getLabTests = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams(options);
    
    const response = await fetch(
      `http://localhost:5000/api/lab-tests?${queryParams}`
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    throw error;
  }
};

// Usage Examples
const allTests = await getLabTests();
const bloodTests = await getLabTests({ category: 'Blood Tests' });
const homeCollectionTests = await getLabTests({ isHomeCollectionAvailable: true });
const sortedByPrice = await getLabTests({ sort: 'price', limit: 20 });
```

---

## 2. Get Lab Test by ID

**Endpoint:** `GET /api/lab-tests/:id`

**Description:** Get detailed information about a specific lab test.

**Headers:**
```
None (Public endpoint)
```

**URL Parameters:**
- `id`: Lab test's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64lab123abc",
    "testName": "Complete Blood Count (CBC)",
    "testCode": "CBC001",
    "category": "Blood Tests",
    "description": "Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels",
    "price": 500,
    "discount": 10,
    "discountedPrice": 450,
    "isHomeCollectionAvailable": true,
    "homeCollectionPrice": 100,
    "preparationInstructions": "Fasting for 8-12 hours required. Avoid alcohol 24 hours before test.",
    "reportDeliveryTime": "24 hours",
    "sampleType": "Blood",
    "sampleVolume": "5 mL",
    "parameters": [
      {
        "name": "Hemoglobin",
        "unit": "g/dL",
        "normalRange": "13-17 (Male), 12-15 (Female)",
        "description": "Measures oxygen-carrying capacity"
      },
      {
        "name": "WBC Count",
        "unit": "cells/μL",
        "normalRange": "4000-11000",
        "description": "White blood cell count"
      },
      {
        "name": "Platelet Count",
        "unit": "cells/μL",
        "normalRange": "150000-450000",
        "description": "Blood clotting cells"
      }
    ],
    "isPopular": true,
    "isRecommended": false,
    "status": "active",
    "metadata": {
      "createdBy": "64admin123",
      "lastUpdated": "2024-01-15T10:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Lab test not found"
}
```

**Frontend Integration:**
```javascript
const getLabTestById = async (testId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/lab-tests/${testId}`
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab test:', error);
    throw error;
  }
};

// Usage
const test = await getLabTestById('64lab123abc');
console.log(`Test: ${test.data.testName}`);
console.log(`Price: ₹${test.data.discountedPrice}`);
```

---

## 3. Get All Lab Test Types (Advanced)

**Endpoint:** `GET /api/lab-tests/all-types`

**Description:** Get lab tests with comprehensive filtering, sorting, and statistics.

**Headers:**
```
None (Public endpoint)
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Number | No | Page number (default: 1) |
| limit | Number | No | Items per page (default: 20) |
| category | String/Array | No | Filter by category |
| isHomeCollection | Boolean | No | Filter by home collection |
| isPopular | Boolean | No | Filter popular tests |
| isRecommended | Boolean | No | Filter recommended tests |
| status | String | No | Filter by status (default: "active") |
| search | String | No | Search in name, description, code |
| sortBy | String | No | Sort field |
| sortOrder | String | No | "asc" or "desc" |

**Example Requests:**
```
GET /api/lab-tests/all-types
GET /api/lab-tests/all-types?page=1&limit=20
GET /api/lab-tests/all-types?category=Blood Tests
GET /api/lab-tests/all-types?isHomeCollection=true
GET /api/lab-tests/all-types?isPopular=true
GET /api/lab-tests/all-types?search=diabetes
GET /api/lab-tests/all-types?sortBy=discountedPrice&sortOrder=asc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Lab tests retrieved successfully",
  "data": {
    "tests": [
      {
        "_id": "64lab123abc",
        "testName": "Complete Blood Count (CBC)",
        "testCode": "CBC001",
        "category": "Blood Tests",
        "description": "Comprehensive blood analysis",
        "price": 500,
        "discount": 10,
        "discountedPrice": 450,
        "isHomeCollectionAvailable": true,
        "homeCollectionPrice": 100,
        "preparationInstructions": "Fasting for 8-12 hours",
        "reportDeliveryTime": "24 hours",
        "sampleType": "Blood",
        "parameters": [
          {
            "name": "Hemoglobin",
            "unit": "g/dL",
            "normalRange": "13-17 (Male), 12-15 (Female)"
          }
        ],
        "isPopular": true,
        "isRecommended": false,
        "status": "active",
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTests": 95,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 20,
      "nextPage": 2
    },
    "statistics": {
      "categories": [
        {
          "_id": "Blood Tests",
          "count": 45,
          "avgPrice": 550,
          "minPrice": 200,
          "maxPrice": 2000
        },
        {
          "_id": "Urine Tests",
          "count": 20,
          "avgPrice": 300,
          "minPrice": 150,
          "maxPrice": 800
        }
      ],
      "priceRange": {
        "minPrice": 150,
        "maxPrice": 5000,
        "avgPrice": 650,
        "totalTests": 95
      }
    },
    "filters": {
      "appliedFilters": {
        "category": null,
        "isHomeCollection": null,
        "isPopular": null,
        "isRecommended": null,
        "status": "active",
        "search": null
      },
      "availableCategories": [
        "Blood Tests",
        "Urine Tests",
        "Imaging",
        "Cardiac Tests",
        "Diabetes Tests"
      ],
      "availableStatuses": [
        "active",
        "inactive",
        "temporarily_unavailable"
      ]
    }
  }
}
```

**Frontend Integration:**
```javascript
const getAllLabTestTypes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    
    const response = await fetch(
      `http://localhost:5000/api/lab-tests/all-types?${queryParams}`
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    throw error;
  }
};

// Usage Examples
const allTests = await getAllLabTestTypes();
const popularTests = await getAllLabTestTypes({ isPopular: true });
const homeCollectionTests = await getAllLabTestTypes({ isHomeCollection: true });
const bloodTests = await getAllLabTestTypes({ category: 'Blood Tests' });
const searchResults = await getAllLabTestTypes({ search: 'diabetes' });
const sortedByPrice = await getAllLabTestTypes({ 
  sortBy: 'discountedPrice', 
  sortOrder: 'asc' 
});
```

**React Component Example:**
```javascript
import React, { useState, useEffect } from 'react';

const LabTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    isHomeCollection: '',
    isPopular: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchTests();
  }, [filters]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(
        `http://localhost:5000/api/lab-tests/all-types?${queryParams}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setTests(data.data.tests);
        setPagination(data.data.pagination);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading lab tests...</div>;

  return (
    <div className="lab-test-list">
      <h2>Lab Tests</h2>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search tests..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}
        >
          <option value="">All Categories</option>
          <option value="Blood Tests">Blood Tests</option>
          <option value="Urine Tests">Urine Tests</option>
          <option value="Imaging">Imaging</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={filters.isHomeCollection === 'true'}
            onChange={(e) => setFilters({
              ...filters, 
              isHomeCollection: e.target.checked ? 'true' : '',
              page: 1
            })}
          />
          Home Collection Available
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.isPopular === 'true'}
            onChange={(e) => setFilters({
              ...filters, 
              isPopular: e.target.checked ? 'true' : '',
              page: 1
            })}
          />
          Popular Tests
        </label>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="statistics">
          <p>Price Range: ₹{statistics.priceRange.minPrice} - ₹{statistics.priceRange.maxPrice}</p>
          <p>Average Price: ₹{Math.round(statistics.priceRange.avgPrice)}</p>
        </div>
      )}

      {/* Test Grid */}
      <div className="test-grid">
        {tests.map(test => (
          <div key={test._id} className="test-card">
            <h3>{test.testName}</h3>
            <p className="category">{test.category}</p>
            <p className="description">{test.description}</p>
            
            <div className="pricing">
              <span className="price">₹{test.discountedPrice}</span>
              {test.discount > 0 && (
                <>
                  <span className="original-price">₹{test.price}</span>
                  <span className="discount">{test.discount}% OFF</span>
                </>
              )}
            </div>

            {test.isHomeCollectionAvailable && (
              <div className="home-collection">
                <span>🏠 Home Collection Available</span>
                <span>+₹{test.homeCollectionPrice}</span>
              </div>
            )}

            <div className="details">
              <span>📋 {test.parameters?.length || 0} Parameters</span>
              <span>⏱️ {test.reportDeliveryTime}</span>
            </div>

            {test.isPopular && <span className="badge popular">Popular</span>}
            {test.isRecommended && <span className="badge recommended">Recommended</span>}

            <button onClick={() => window.location.href = `/lab-tests/${test._id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setFilters({...filters, page: pagination.prevPage})}
          >
            Previous
          </button>
          
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters({...filters, page: pagination.nextPage})}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LabTestList;
```

---

## 4. Search Lab Tests

**Endpoint:** `GET /api/lab-tests/search`

**Description:** Search lab tests with text search and filters.

**Headers:**
```
None (Public endpoint)
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | String | No | Search query (text search) |
| category | String | No | Filter by category |
| minPrice | Number | No | Minimum price filter |
| maxPrice | Number | No | Maximum price filter |
| isHomeCollection | Boolean | No | Filter by home collection |

**Example Requests:**
```
GET /api/lab-tests/search?q=blood
GET /api/lab-tests/search?q=diabetes&category=Blood Tests
GET /api/lab-tests/search?minPrice=200&maxPrice=1000
GET /api/lab-tests/search?isHomeCollection=true
GET /api/lab-tests/search?q=thyroid&minPrice=300&maxPrice=800
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64lab123abc",
      "testName": "Complete Blood Count (CBC)",
      "testCode": "CBC001",
      "category": "Blood Tests",
      "description": "Comprehensive blood analysis",
      "price": 500,
      "discount": 10,
      "discountedPrice": 450,
      "isHomeCollectionAvailable": true,
      "homeCollectionPrice": 100,
      "isPopular": true,
      "status": "active"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const searchLabTests = async (searchParams) => {
  try {
    const queryParams = new URLSearchParams(searchParams);
    
    const response = await fetch(
      `http://localhost:5000/api/lab-tests/search?${queryParams}`
    );

    return await response.json();
  } catch (error) {
    console.error('Error searching lab tests:', error);
    throw error;
  }
};

// Usage Examples
const results1 = await searchLabTests({ q: 'blood' });
const results2 = await searchLabTests({ 
  q: 'diabetes', 
  category: 'Blood Tests' 
});
const results3 = await searchLabTests({ 
  minPrice: 200, 
  maxPrice: 1000,
  isHomeCollection: true
});
```

---

## 5. Get Lab Test Categories

**Endpoint:** `GET /api/lab-tests/categories`

**Description:** Get all unique lab test categories.

**Headers:**
```
None (Public endpoint)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    "Blood Tests",
    "Urine Tests",
    "Imaging",
    "Cardiac Tests",
    "Diabetes Tests",
    "Thyroid Tests",
    "Liver Function Tests",
    "Kidney Function Tests"
  ]
}
```

**Frontend Integration:**
```javascript
const getLabTestCategories = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/lab-tests/categories'
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Usage
const categories = await getLabTestCategories();
console.log('Available categories:', categories.data);
```

---

## Complete Workflow Examples

### Browse and Filter Lab Tests
```javascript
// 1. Get all categories
const categories = await fetch('http://localhost:5000/api/lab-tests/categories')
  .then(r => r.json());

// 2. Get tests by category
const bloodTests = await fetch(
  'http://localhost:5000/api/lab-tests/all-types?category=Blood Tests'
).then(r => r.json());

// 3. Filter by home collection
const homeCollectionTests = await fetch(
  'http://localhost:5000/api/lab-tests/all-types?isHomeCollection=true'
).then(r => r.json());

// 4. Search for specific test
const searchResults = await fetch(
  'http://localhost:5000/api/lab-tests/search?q=diabetes'
).then(r => r.json());

// 5. Get test details
const testId = searchResults.data[0]._id;
const testDetails = await fetch(
  `http://localhost:5000/api/lab-tests/${testId}`
).then(r => r.json());
```

### Price Comparison
```javascript
// Get tests sorted by price
const cheapestTests = await fetch(
  'http://localhost:5000/api/lab-tests/all-types?sortBy=discountedPrice&sortOrder=asc&limit=10'
).then(r => r.json());

// Get tests in price range
const affordableTests = await fetch(
  'http://localhost:5000/api/lab-tests/search?minPrice=200&maxPrice=500'
).then(r => r.json());

// Get statistics
const allTests = await fetch(
  'http://localhost:5000/api/lab-tests/all-types'
).then(r => r.json());

console.log('Price range:', allTests.data.statistics.priceRange);
console.log('Category stats:', allTests.data.statistics.categories);
```

---

## Summary

### Endpoints:
- `GET /api/lab-tests` - Get all lab tests with basic filtering
- `GET /api/lab-tests/:id` - Get lab test by ID
- `GET /api/lab-tests/all-types` - Get tests with advanced filtering and statistics
- `GET /api/lab-tests/search` - Search lab tests
- `GET /api/lab-tests/categories` - Get all categories

### Key Features:
✅ Browse all lab tests  
✅ Advanced filtering (category, price, home collection)  
✅ Search by name, description, test code  
✅ Sort by price, popularity, date  
✅ Pagination support  
✅ Category statistics  
✅ Price range statistics  
✅ Popular and recommended tests  
✅ Home collection availability  
✅ Detailed test parameters  
✅ Preparation instructions  
✅ Report delivery time  

### Filter Options:
- Category (Blood Tests, Urine Tests, etc.)
- Price range (min/max)
- Home collection availability
- Popular tests
- Recommended tests
- Status (active, inactive)
- Text search

---

**Last Updated:** January 2025  
**API Version:** 1.0
