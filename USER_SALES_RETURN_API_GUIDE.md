# User-Side Sales Return APIs Guide

## Overview
This document provides complete API documentation for user-side sales return functionality. Users can create return requests, view their return history, and track return status through these APIs.

## Base URL
All return APIs are mounted at: `/api/returns`

## Authentication
All user-side APIs require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## User-Side Endpoints (3 APIs)

### 1. Create Sales Return
**Endpoint:** `POST /api/returns/sales`  
**Authentication:** Required (User token)  
**Description:** Create a new sales return request

#### Request Body:
```json
{
  "originalOrderId": "64a1b2c3d4e5f6789012345a",
  "items": [
    {
      "productType": "medicine", // or "categoryProduct"
      "medicineId": "64a1b2c3d4e5f6789012345b", // required if productType is "medicine"
      "categoryProductId": "64a1b2c3d4e5f6789012345c", // required if productType is "categoryProduct"
      "batchNumber": "BATCH001",
      "returnQuantity": 2,
      "unitBilled": "Primary", // optional, defaults to "Primary"
      "unitConversion": 1, // optional, defaults to 1
      "returnReason": "Expired" // "Expired", "Damaged", "Wrong Item", "Customer Refusal"
    }
  ]
}
```

#### Response:
```json
{
  "success": true,
  "message": "Sales return requested successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345d",
    "userId": "64a1b2c3d4e5f6789012345e",
    "originalOrderId": "64a1b2c3d4e5f6789012345a",
    "returnNumber": "SRTN-202603-0001",
    "items": [
      {
        "productType": "medicine",
        "medicineId": "64a1b2c3d4e5f6789012345b",
        "batchNumber": "BATCH001",
        "returnQuantity": 2,
        "unitBilled": "Primary",
        "unitConversion": 1,
        "returnReason": "Expired",
        "unitPriceAtSale": 50.00,
        "taxAmountAtSale": 9.00
      }
    ],
    "totalReturnAmount": 118.00,
    "status": "Requested",
    "qcStatus": "Pending",
    "creditNoteIssued": false,
    "createdAt": "2026-03-26T10:30:00.000Z",
    "updatedAt": "2026-03-26T10:30:00.000Z"
  }
}
```

---

### 2. Get User's Sales Returns (with pagination & filters)
**Endpoint:** `GET /api/returns/sales`  
**Authentication:** Required (User token)  
**Description:** Get all sales returns for the authenticated user

#### Query Parameters:
```
?status=Requested&qcStatus=Pending&fromDate=2026-01-01&toDate=2026-03-26&page=1&limit=20
```

- `status` (optional): Filter by status - "Requested", "In Transit", "Received", "QC Completed", "Rejected"
- `qcStatus` (optional): Filter by QC status - "Pending", "Passed (Restockable)", "Failed (Scrap)"
- `fromDate` (optional): Filter from date (YYYY-MM-DD format)
- `toDate` (optional): Filter to date (YYYY-MM-DD format)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### Response:
```json
{
  "success": true,
  "total": 25,
  "totalPages": 2,
  "currentPage": 1,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345d",
      "userId": {
        "_id": "64a1b2c3d4e5f6789012345e",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "originalOrderId": {
        "_id": "64a1b2c3d4e5f6789012345a",
        "orderNumber": "ORD-202603-0001",
        "orderedAt": "2026-03-20T10:30:00.000Z",
        "totalAmount": 500.00
      },
      "returnNumber": "SRTN-202603-0001",
      "items": [
        {
          "productType": "medicine",
          "medicineId": {
            "_id": "64a1b2c3d4e5f6789012345b",
            "productName": "Paracetamol 500mg",
            "itemCode": "MED001"
          },
          "batchNumber": "BATCH001",
          "returnQuantity": 2,
          "returnReason": "Expired",
          "unitPriceAtSale": 50.00,
          "taxAmountAtSale": 9.00
        }
      ],
      "totalReturnAmount": 118.00,
      "status": "Requested",
      "qcStatus": "Pending",
      "creditNoteIssued": false,
      "approvedBy": null,
      "creditNoteId": null,
      "createdAt": "2026-03-26T10:30:00.000Z",
      "updatedAt": "2026-03-26T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Sales Return Details
**Endpoint:** `GET /api/returns/sales/:id`  
**Authentication:** Required (User token)  
**Description:** Get detailed information about a specific sales return

#### URL Parameters:
- `id`: Sales return ID

#### Response:
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345d",
    "userId": {
      "_id": "64a1b2c3d4e5f6789012345e",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "originalOrderId": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "orderNumber": "ORD-202603-0001",
      "orderedAt": "2026-03-20T10:30:00.000Z",
      "totalAmount": 500.00,
      "items": [
        {
          "medicineId": "64a1b2c3d4e5f6789012345b",
          "price": 50.00,
          "quantity": 5,
          "cgstAmount": 4.50,
          "sgstAmount": 4.50,
          "igstAmount": 0
        }
      ]
    },
    "returnNumber": "SRTN-202603-0001",
    "items": [
      {
        "productType": "medicine",
        "medicineId": {
          "_id": "64a1b2c3d4e5f6789012345b",
          "productName": "Paracetamol 500mg",
          "itemCode": "MED001",
          "manufacturer": "ABC Pharma",
          "category": "Pain Relief"
        },
        "batchNumber": "BATCH001",
        "returnQuantity": 2,
        "unitBilled": "Primary",
        "unitConversion": 1,
        "returnReason": "Expired",
        "unitPriceAtSale": 50.00,
        "taxAmountAtSale": 9.00
      }
    ],
    "totalReturnAmount": 118.00,
    "status": "Requested",
    "qcStatus": "Pending",
    "creditNoteIssued": false,
    "creditNoteId": null,
    "approvalRemarks": null,
    "approvedBy": null,
    "createdAt": "2026-03-26T10:30:00.000Z",
    "updatedAt": "2026-03-26T10:30:00.000Z"
  }
}
```

---

## Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

### Common HTTP Status Codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (user can't access this resource)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Return Reasons Available
- `"Expired"`: Product has expired
- `"Damaged"`: Product is damaged
- `"Wrong Item"`: Wrong product was delivered
- `"Customer Refusal"`: Customer refused the product

---

## Return Status Flow
1. `"Requested"`: Initial status when return is created
2. `"In Transit"`: Return is being shipped back
3. `"Received"`: Return has been received by the pharmacy
4. `"QC Completed"`: Quality check completed
5. `"Rejected"`: Return was rejected

---

## QC Status Options
- `"Pending"`: Quality check not yet performed
- `"Passed (Restockable)"`: Items passed QC and can be restocked
- `"Failed (Scrap)"`: Items failed QC and will be scrapped

---

## Frontend Integration Examples

### JavaScript/Axios Examples:

#### 1. Create Sales Return
```javascript
const createSalesReturn = async (returnData) => {
  try {
    const response = await axios.post('/api/returns/sales', returnData, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating return:', error.response.data);
    throw error;
  }
};

// Usage
const returnData = {
  originalOrderId: "64a1b2c3d4e5f6789012345a",
  items: [{
    productType: "medicine",
    medicineId: "64a1b2c3d4e5f6789012345b",
    batchNumber: "BATCH001",
    returnQuantity: 2,
    returnReason: "Expired"
  }]
};

createSalesReturn(returnData);
```

#### 2. Get Returns with Filters
```javascript
const getUserReturns = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`/api/returns/sales?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching returns:', error.response.data);
    throw error;
  }
};

// Usage
const filters = {
  status: 'Requested',
  page: 1,
  limit: 10,
  fromDate: '2026-01-01'
};

getUserReturns(filters);
```

#### 3. Get Single Return Details
```javascript
const getReturnDetails = async (returnId) => {
  try {
    const response = await axios.get(`/api/returns/sales/${returnId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching return details:', error.response.data);
    throw error;
  }
};

// Usage
getReturnDetails("64a1b2c3d4e5f6789012345d");
```

---

## Summary

These 3 APIs provide complete functionality for users to:
1. **Create returns** for their orders with specific items and reasons
2. **View return history** with filtering and pagination capabilities
3. **Get detailed information** about specific returns including status updates

The APIs are designed to be user-friendly and provide all necessary information for frontend integration while maintaining proper authentication and authorization.