# User Order APIs - Complete Guide

## Base URL
```
http://localhost:5000/api/orders
```

**Note:** All endpoints require authentication with Bearer token.

---

## Table of Contents

### Regular Orders
1. [Place Order from Cart](#1-place-order-from-cart)
2. [Get All Orders](#2-get-all-orders)
3. [Get Order by ID](#3-get-order-by-id)
4. [Get Orders with Filters](#4-get-orders-with-filters)
5. [Cancel Order](#5-cancel-order)
6. [Check Prescription Status](#6-check-prescription-status)
7. [Reorder Previous Order](#7-reorder-previous-order)
8. [Get Order Statistics](#8-get-order-statistics)
9. [Get Order Invoice](#9-get-order-invoice)
10. [Get Lab Test Results](#10-get-lab-test-results)

### Lab Test Orders
11. [Create Lab Test Order](#11-create-lab-test-order)
12. [Get My Lab Test Orders](#12-get-my-lab-test-orders)
13. [Get Lab Test Order by ID](#13-get-lab-test-order-by-id)
14. [Reschedule Lab Test](#14-reschedule-lab-test)

---

## 1. Place Order from Cart

**Endpoint:** `POST /api/orders/place-order`

**Description:** Place an order using items from the cart.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "cartId": "64cart123abc",
  "address": "123 Main Street, Mumbai, Maharashtra, 400001, India",
  "contact": "9876543210",
  "name": "John Doe",
  "paymentMethod": "COD"
}
```

**Alternative - Using Address ID:**
```json
{
  "cartId": "64cart123abc",
  "addressId": "64addr123",
  "contact": "9876543210",
  "paymentMethod": "Online"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| cartId | String | Yes | Cart ID |
| address | String | Conditional | Full address string (required if addressId not provided) |
| addressId | String | Conditional | Address ID from user's saved addresses |
| contact | String | Yes | Contact phone number |
| name | String | No | Custom name (if ordering for someone else) |
| paymentMethod | String | No | "COD" or "Online" (default: "COD") |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "64order123",
    "userId": "64user123",
    "orderNumber": "ORD-1704567890123",
    "items": [
      {
        "_id": "64item123",
        "productType": "medicine",
        "medicineId": "64med123abc",
        "quantity": 2,
        "price": 45
      },
      {
        "_id": "64item456",
        "productType": "labTest",
        "labTestId": "64lab789ghi",
        "quantity": 1,
        "price": 500,
        "isHomeCollection": true,
        "homeCollectionPrice": 100,
        "labTestSampleOTP": "123456",
        "labTestStatus": "pending",
        "labTestRecorder": {
          "name": "Not assigned"
        }
      }
    ],
    "totalAmount": 690,
    "status": "Order Placed",
    "deliveryStatus": "Processing",
    "paymentStatus": "Pending",
    "paymentMethod": "COD",
    "address": "123 Main Street, Mumbai, Maharashtra, 400001, India",
    "contact": "9876543210",
    "hasLabTests": true,
    "deliveryOTP": "654321",
    "orderedAt": "2025-01-15T10:00:00.000Z"
  },
  "prescriptionStatus": {
    "hasPrescriptionRequired": false,
    "prescriptionVerified": false,
    "prescriptionVerificationStatus": "pending",
    "prescriptionRequiredMedicines": [],
    "prescriptionNotRequiredMedicines": [
      {
        "productId": "64med123abc",
        "productName": "Paracetamol 500mg",
        "quantity": 2,
        "price": 45,
        "prescriptionRequired": false,
        "productType": "medicine"
      }
    ],
    "prescriptionRequiredCount": 0,
    "prescriptionNotRequiredCount": 1,
    "message": "✅ This order contains only OTC medicines. No prescription required.",
    "statusMessage": "No prescription verification needed"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**
```json
{
  "success": false,
  "message": "Missing required fields",
  "error": "cartId, address (or addressId), and contact are required"
}
```

**400 Bad Request - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Insufficient stock",
  "error": "Not enough stock for Paracetamol 500mg. Available: 5, Required: 10"
}
```

**403 Forbidden - Cart Access Denied:**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "You can only place orders from your own cart"
}
```

**404 Not Found - Cart Empty:**
```json
{
  "success": false,
  "message": "Cart not found or empty",
  "error": "Invalid cart ID or empty cart"
}
```

**Frontend Integration:**
```javascript
const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/orders/place-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Usage
const result = await placeOrder({
  cartId: '64cart123abc',
  addressId: '64addr123',
  contact: '9876543210',
  paymentMethod: 'COD'
});
```

---

## 2. Get All Orders

**Endpoint:** `GET /api/orders`

**Description:** Get all orders for the authenticated user with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Number | No | Page number (default: 1) |
| limit | Number | No | Items per page (default: 10) |

**Example Requests:**
```
GET /api/orders
GET /api/orders?page=1&limit=10
GET /api/orders?page=2&limit=20
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "64order123",
        "orderNumber": "ORD-1704567890123",
        "status": "Order Placed",
        "deliveryStatus": "Processing",
        "paymentStatus": "Pending",
        "paymentMethod": "COD",
        "totalAmount": 690,
        "orderedAt": "2025-01-15T10:00:00.000Z",
        "deliveredAt": null,
        "deliveryOTP": "654321",
        "hasLabTests": true,
        "items": [
          {
            "_id": "64item123",
            "productType": "medicine",
            "quantity": 2,
            "price": 45,
            "medicine": {
              "_id": "64med123abc",
              "productName": "Paracetamol 500mg",
              "price": 45,
              "image": "https://s3.amazonaws.com/...",
              "category": "Pain Relief"
            }
          },
          {
            "_id": "64item456",
            "productType": "labTest",
            "quantity": 1,
            "price": 500,
            "isHomeCollection": true,
            "homeCollectionPrice": 100,
            "labTestSampleOTP": "123456",
            "labTestStatus": "pending",
            "labTestRecorder": {
              "name": "Not assigned",
              "phone": null,
              "email": null
            },
            "labTest": {
              "_id": "64lab789ghi",
              "testName": "Complete Blood Count (CBC)",
              "description": "Blood test",
              "price": 500
            },
            "labTestId": "64lab789ghi",
            "labTestPatientDetails": {
              "name": "John Doe",
              "phone": "9876543210",
              "gender": "Male",
              "age": 30
            }
          }
        ],
        "address": "123 Main Street, Mumbai, Maharashtra, 400001",
        "contact": "9876543210",
        "prescriptionVerified": false,
        "prescriptionVerificationStatus": "pending",
        "hasPrescriptionRequired": false,
        "medicineSubstitutions": []
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 45,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Frontend Integration:**
```javascript
const getOrders = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Usage
const ordersData = await getOrders(1, 10);
console.log(`Total orders: ${ordersData.data.pagination.totalOrders}`);
```

---

## 3. Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Description:** Get detailed information about a specific order.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Order's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "order": {
    "_id": "64order123",
    "userId": {
      "_id": "64user123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "orderNumber": "ORD-1704567890123",
    "status": "Order Placed",
    "deliveryStatus": "Processing",
    "paymentStatus": "Pending",
    "paymentMethod": "COD",
    "totalAmount": 690,
    "orderedAt": "2025-01-15T10:00:00.000Z",
    "deliveredAt": null,
    "deliveryOTP": "654321",
    "hasLabTests": true,
    "items": [
      {
        "_id": "64item123",
        "productType": "medicine",
        "quantity": 2,
        "price": 45,
        "isHomeCollection": false,
        "homeCollectionPrice": 0,
        "labTestSampleOTP": null,
        "labTestStatus": "pending",
        "labTestRecorder": {
          "name": "Not assigned",
          "phone": null,
          "email": null
        },
        "medicine": {
          "_id": "64med123abc",
          "productName": "Paracetamol 500mg",
          "price": 45,
          "image": "https://s3.amazonaws.com/...",
          "category": "Pain Relief"
        }
      }
    ],
    "address": "123 Main Street, Mumbai, Maharashtra, 400001",
    "contact": "9876543210"
  }
}
```

**Error Responses:**

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "You can only view your own orders"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Order not found",
  "error": "Invalid order ID"
}
```

**Frontend Integration:**
```javascript
const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Usage
const order = await getOrderById('64order123');
```

---

## 4. Get Orders with Filters

**Endpoint:** `GET /api/orders/filter`

**Description:** Get orders with advanced filtering and sorting options.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Number | No | Page number (default: 1) |
| limit | Number | No | Items per page (default: 10) |
| status | String | No | Filter by order status |
| paymentStatus | String | No | Filter by payment status |
| startDate | String | No | Filter orders from date (YYYY-MM-DD) |
| endDate | String | No | Filter orders until date (YYYY-MM-DD) |
| sortBy | String | No | Sort field (default: "orderedAt") |
| sortOrder | String | No | "asc" or "desc" (default: "desc") |

**Example Requests:**
```
GET /api/orders/filter
GET /api/orders/filter?status=Delivered
GET /api/orders/filter?paymentStatus=Completed
GET /api/orders/filter?startDate=2025-01-01&endDate=2025-01-31
GET /api/orders/filter?sortBy=totalAmount&sortOrder=desc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "64order123",
        "orderNumber": "ORD-1704567890123",
        "status": "Delivered",
        "deliveryStatus": "Delivered",
        "paymentStatus": "Completed",
        "totalAmount": 690,
        "orderedAt": "2025-01-15T10:00:00.000Z",
        "deliveredAt": "2025-01-17T14:30:00.000Z",
        "items": [],
        "address": "123 Main Street, Mumbai",
        "contact": "9876543210"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalOrders": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Frontend Integration:**
```javascript
const getOrdersWithFilters = async (filters = {}) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const queryParams = new URLSearchParams(filters);
    
    const response = await fetch(
      `http://localhost:5000/api/orders/filter?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Usage
const deliveredOrders = await getOrdersWithFilters({ status: 'Delivered' });
const recentOrders = await getOrdersWithFilters({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  sortBy: 'orderedAt',
  sortOrder: 'desc'
});
```

---

## 5. Cancel Order

**Endpoint:** `PUT /api/orders/:id/cancel`

**Description:** Cancel an order (only if not shipped or delivered).

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Order's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "64order123",
    "orderNumber": "ORD-1704567890123",
    "status": "Cancelled",
    "totalAmount": 690
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "message": "Cannot cancel a shipped or delivered order"
}
```

**404 Not Found:**
```json
{
  "message": "Order not found"
}
```

**Frontend Integration:**
```javascript
const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}/cancel`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Usage
const result = await cancelOrder('64order123');
```

---

## 6. Check Prescription Status

**Endpoint:** `GET /api/orders/check-prescription/:cartId`

**Description:** Check if cart items require prescription before placing order.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `cartId`: Cart's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Prescription status checked successfully",
  "data": {
    "cartId": "64cart123abc",
    "totalAmount": 590,
    "prescriptionStatus": {
      "hasPrescriptionRequired": true,
      "prescriptionRequiredMedicines": [
        {
          "medicineId": "64med456def",
          "productName": "Amoxicillin 500mg",
          "quantity": 1,
          "price": 150,
          "prescriptionRequired": true,
          "category": "Antibiotics",
          "imageUrl": "https://s3.amazonaws.com/..."
        }
      ],
      "prescriptionNotRequiredMedicines": [
        {
          "medicineId": "64med123abc",
          "productName": "Paracetamol 500mg",
          "quantity": 2,
          "price": 45,
          "prescriptionRequired": false,
          "category": "Pain Relief",
          "imageUrl": "https://s3.amazonaws.com/..."
        }
      ],
      "prescriptionRequiredCount": 1,
      "prescriptionNotRequiredCount": 1,
      "totalItems": 2
    },
    "message": "⚠️ This cart contains 1 prescription medicine(s). You will need a valid prescription to complete the order."
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Cart not found or empty",
  "error": "Invalid cart ID or empty cart"
}
```

**Frontend Integration:**
```javascript
const checkPrescriptionStatus = async (cartId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/check-prescription/${cartId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error checking prescription:', error);
    throw error;
  }
};

// Usage
const prescriptionStatus = await checkPrescriptionStatus('64cart123abc');
if (prescriptionStatus.data.prescriptionStatus.hasPrescriptionRequired) {
  alert('This order requires a prescription!');
}
```

---

## 7. Reorder Previous Order

**Endpoint:** `POST /api/orders/:orderId/reorder`

**Description:** Add items from a previous delivered order to cart for reordering.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `orderId`: Order's MongoDB ObjectId (must be delivered)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Items added to cart for reorder",
  "cartId": "64cart789xyz",
  "items": [
    {
      "productType": "medicine",
      "medicineId": "64med123abc",
      "quantity": 2,
      "price": 45,
      "name": "Paracetamol 500mg",
      "image": "https://s3.amazonaws.com/..."
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Order not found or not eligible for reorder"
}
```

**Frontend Integration:**
```javascript
const reorderOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}/reorder`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error reordering:', error);
    throw error;
  }
};

// Usage
const result = await reorderOrder('64order123');
console.log(`Items added to cart: ${result.cartId}`);
```

---

## 8. Get Order Statistics

**Endpoint:** `GET /api/orders/statistics`

**Description:** Get order statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "statistics": {
    "totalOrders": 45,
    "totalAmount": 25000,
    "pendingOrders": 2,
    "processingOrders": 5,
    "shippedOrders": 3,
    "deliveredOrders": 32,
    "cancelledOrders": 3
  }
}
```

**Frontend Integration:**
```javascript
const getOrderStatistics = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      'http://localhost:5000/api/orders/statistics',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

// Usage
const stats = await getOrderStatistics();
console.log(`Total orders: ${stats.statistics.totalOrders}`);
console.log(`Total spent: ₹${stats.statistics.totalAmount}`);
```

---

## 9. Get Order Invoice

**Endpoint:** `GET /api/orders/:id/invoice`

**Description:** Generate and download PDF invoice for an order.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Order's MongoDB ObjectId

**Success Response (200 OK):**
Returns a PDF file with Content-Type: application/pdf

**Error Responses:**

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Not authorized to view this invoice"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**Frontend Integration:**
```javascript
const downloadInvoice = async (orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}/invoice`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Usage
await downloadInvoice('64order123');
```

---

## 10. Get Lab Test Results

**Endpoint:** `GET /api/orders/my-lab-results`

**Description:** Get all lab test results for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Number | No | Page number (default: 1) |
| limit | Number | No | Items per page (default: 10) |
| status | String | No | Filter by lab test status |

**Example Requests:**
```
GET /api/orders/my-lab-results
GET /api/orders/my-lab-results?page=1&limit=10
GET /api/orders/my-lab-results?status=completed
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Lab test results retrieved successfully",
  "data": [
    {
      "orderId": "64order123",
      "orderNumber": "ORD-1704567890123",
      "orderDate": "2025-01-15T10:00:00.000Z",
      "testDetails": {
        "_id": "64item456",
        "testId": "64lab789ghi",
        "testName": "Complete Blood Count (CBC)",
        "description": "Blood test",
        "category": "Blood Tests",
        "quantity": 1,
        "price": 500,
        "status": "completed"
      },
      "result": {
        "uploadedAt": "2025-01-17T10:00:00.000Z",
        "fileUrl": "https://s3.amazonaws.com/lab-results/result.pdf",
        "contentType": "application/pdf"
      },
      "patient": {
        "name": "John Doe",
        "phone": "9876543210",
        "gender": "Male",
        "age": 30,
        "disease": "Routine checkup",
        "email": "john@example.com",
        "address": "123 Main Street, Mumbai",
        "contact": "9876543210"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalResults": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Frontend Integration:**
```javascript
const getLabTestResults = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/orders/my-lab-results?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab results:', error);
    throw error;
  }
};

// Usage
const results = await getLabTestResults();
results.data.forEach(result => {
  console.log(`Test: ${result.testDetails.testName}`);
  console.log(`Result URL: ${result.result.fileUrl}`);
});
```

---

## Lab Test Orders

### 11. Create Lab Test Order

**Endpoint:** `POST /api/lab-test-orders`

**Description:** Create a new lab test order directly (without cart).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tests": [
    {
      "labTestId": "64lab123abc"
    },
    {
      "labTestId": "64lab456def"
    }
  ],
  "patientName": "John Doe",
  "patientAge": 30,
  "patientGender": "Male",
  "contactPhone": "9876543210",
  "contactEmail": "john@example.com",
  "address": "123 Main Street, Mumbai, Maharashtra, 400001",
  "homeCollection": true,
  "preferredDate": "2025-01-20",
  "preferredSlot": {
    "start": "09:00",
    "end": "11:00"
  },
  "couponCode": "HEALTH10",
  "payment": {
    "method": "online"
  }
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tests | Array | Yes | Array of lab test objects with labTestId |
| patientName | String | Yes | Patient's full name |
| patientAge | Number | Yes | Patient's age |
| patientGender | String | Yes | Patient's gender |
| contactPhone | String | Yes | Contact phone number |
| contactEmail | String | No | Contact email |
| address | String | Yes | Full address for home collection |
| homeCollection | Boolean | No | Enable home collection (default: true) |
| preferredDate | String | Conditional | Required if homeCollection=true (YYYY-MM-DD) |
| preferredSlot | Object | Conditional | Required if homeCollection=true |
| preferredSlot.start | String | Conditional | Start time (HH:MM) |
| preferredSlot.end | String | Conditional | End time (HH:MM) |
| couponCode | String | No | Discount coupon code |
| payment | Object | No | Payment details |
| payment.method | String | No | Payment method (default: "online") |

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "64ltorder123",
    "user": "64user123",
    "tests": [
      {
        "labTest": "64lab123abc",
        "testName": "Complete Blood Count (CBC)",
        "priceSnapshot": 500,
        "discountedPriceSnapshot": 450,
        "_id": "64item123"
      },
      {
        "labTest": "64lab456def",
        "testName": "Lipid Profile",
        "priceSnapshot": 800,
        "discountedPriceSnapshot": 720,
        "_id": "64item456"
      }
    ],
    "patientName": "John Doe",
    "patientAge": 30,
    "patientGender": "Male",
    "contactPhone": "9876543210",
    "contactEmail": "john@example.com",
    "address": "123 Main Street, Mumbai, Maharashtra, 400001",
    "homeCollection": true,
    "preferredDate": "2025-01-20T00:00:00.000Z",
    "preferredSlot": {
      "start": "09:00",
      "end": "11:00"
    },
    "subtotal": 1170,
    "homeCollectionCharge": 100,
    "discountAmount": 0,
    "couponCode": "HEALTH10",
    "couponDiscount": 0,
    "taxAmount": 0,
    "totalAmount": 1270,
    "payment": {
      "method": "online",
      "status": "pending"
    },
    "status": "pending",
    "metadata": {
      "createdBy": "64user123"
    },
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Invalid Tests:**
```json
{
  "message": "One or more lab tests are invalid or inactive"
}
```

**400 Bad Request - Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Patient name is required",
      "param": "patientName",
      "location": "body"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const createLabTestOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/lab-test-orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating lab test order:', error);
    throw error;
  }
};

// Usage
const order = await createLabTestOrder({
  tests: [
    { labTestId: '64lab123abc' },
    { labTestId: '64lab456def' }
  ],
  patientName: 'John Doe',
  patientAge: 30,
  patientGender: 'Male',
  contactPhone: '9876543210',
  contactEmail: 'john@example.com',
  address: '123 Main Street, Mumbai, Maharashtra, 400001',
  homeCollection: true,
  preferredDate: '2025-01-20',
  preferredSlot: {
    start: '09:00',
    end: '11:00'
  },
  payment: {
    method: 'online'
  }
});
```

---

### 12. Get My Lab Test Orders

**Endpoint:** `GET /api/lab-test-orders/my-orders`

**Description:** Get all lab test orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64ltorder123",
      "user": "64user123",
      "tests": [
        {
          "labTest": "64lab123abc",
          "testName": "Complete Blood Count (CBC)",
          "priceSnapshot": 500,
          "discountedPriceSnapshot": 450
        }
      ],
      "patientName": "John Doe",
      "patientAge": 30,
      "patientGender": "Male",
      "contactPhone": "9876543210",
      "address": "123 Main Street, Mumbai",
      "homeCollection": true,
      "preferredDate": "2025-01-20T00:00:00.000Z",
      "preferredSlot": {
        "start": "09:00",
        "end": "11:00"
      },
      "subtotal": 450,
      "homeCollectionCharge": 100,
      "totalAmount": 550,
      "payment": {
        "method": "online",
        "status": "completed"
      },
      "status": "confirmed",
      "results": {
        "reportFiles": [],
        "structured": []
      },
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Frontend Integration:**
```javascript
const getMyLabTestOrders = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/lab-test-orders/my-orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab test orders:', error);
    throw error;
  }
};

// Usage
const orders = await getMyLabTestOrders();
console.log(`You have ${orders.count} lab test orders`);
```

---

### 13. Get Lab Test Order by ID

**Endpoint:** `GET /api/lab-test-orders/:id`

**Description:** Get detailed information about a specific lab test order.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Lab test order's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64ltorder123",
    "user": "64user123",
    "tests": [
      {
        "labTest": "64lab123abc",
        "testName": "Complete Blood Count (CBC)",
        "priceSnapshot": 500,
        "discountedPriceSnapshot": 450,
        "_id": "64item123"
      }
    ],
    "patientName": "John Doe",
    "patientAge": 30,
    "patientGender": "Male",
    "contactPhone": "9876543210",
    "contactEmail": "john@example.com",
    "address": "123 Main Street, Mumbai, Maharashtra, 400001",
    "homeCollection": true,
    "preferredDate": "2025-01-20T00:00:00.000Z",
    "preferredSlot": {
      "start": "09:00",
      "end": "11:00"
    },
    "subtotal": 450,
    "homeCollectionCharge": 100,
    "discountAmount": 0,
    "couponCode": null,
    "couponDiscount": 0,
    "taxAmount": 0,
    "totalAmount": 550,
    "payment": {
      "method": "online",
      "status": "completed",
      "transactionId": "txn_123456",
      "paidAt": "2025-01-15T10:15:00.000Z"
    },
    "status": "ready",
    "results": {
      "reportFiles": [
        {
          "s3Key": "arogyaRx/lab-results/report123.pdf",
          "url": "https://s3.amazonaws.com/arogyaRx/lab-results/report123.pdf",
          "contentType": "application/pdf",
          "_id": "64file123"
        }
      ],
      "structured": [
        {
          "parameter": "Hemoglobin",
          "value": "14.5",
          "unit": "g/dL",
          "normalRange": "13-17",
          "status": "normal"
        }
      ],
      "releasedAt": "2025-01-21T10:00:00.000Z"
    },
    "metadata": {
      "createdBy": "64user123",
      "lastUpdatedBy": "64admin123"
    },
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-21T10:00:00.000Z"
  }
}
```

**Error Responses:**

**403 Forbidden:**
```json
{
  "message": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "message": "Order not found"
}
```

**Frontend Integration:**
```javascript
const getLabTestOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/lab-test-orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching lab test order:', error);
    throw error;
  }
};

// Usage
const order = await getLabTestOrderById('64ltorder123');
console.log(`Order status: ${order.data.status}`);
if (order.data.results.reportFiles.length > 0) {
  console.log('Report available:', order.data.results.reportFiles[0].url);
}
```

---

### 14. Reschedule Lab Test

**Endpoint:** `PUT /api/lab-test-orders/:id/reschedule`

**Description:** Reschedule a lab test order's date and time slot.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Lab test order's MongoDB ObjectId

**Request Body:**
```json
{
  "preferredDate": "2025-01-22",
  "preferredSlot": {
    "start": "14:00",
    "end": "16:00"
  },
  "reason": "Not available on original date"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| preferredDate | String | Yes | New preferred date (YYYY-MM-DD) |
| preferredSlot | Object | Yes | New time slot |
| preferredSlot.start | String | Yes | Start time (HH:MM) |
| preferredSlot.end | String | Yes | End time (HH:MM) |
| reason | String | No | Reason for rescheduling |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64ltorder123",
    "user": "64user123",
    "tests": [
      {
        "labTest": "64lab123abc",
        "testName": "Complete Blood Count (CBC)",
        "priceSnapshot": 500,
        "discountedPriceSnapshot": 450
      }
    ],
    "patientName": "John Doe",
    "preferredDate": "2025-01-22T00:00:00.000Z",
    "preferredSlot": {
      "start": "14:00",
      "end": "16:00"
    },
    "status": "confirmed",
    "metadata": {
      "createdBy": "64user123",
      "lastUpdatedBy": "64user123"
    },
    "updatedAt": "2025-01-16T10:00:00.000Z"
  }
}
```

**Error Responses:**

**403 Forbidden:**
```json
{
  "message": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "message": "Order not found"
}
```

**Frontend Integration:**
```javascript
const rescheduleLabTest = async (orderId, rescheduleData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch(
      `http://localhost:5000/api/lab-test-orders/${orderId}/reschedule`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rescheduleData)
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error rescheduling lab test:', error);
    throw error;
  }
};

// Usage
const result = await rescheduleLabTest('64ltorder123', {
  preferredDate: '2025-01-22',
  preferredSlot: {
    start: '14:00',
    end: '16:00'
  },
  reason: 'Not available on original date'
});
```

**React Component Example:**
```javascript
import React, { useState } from 'react';

const RescheduleLabTest = ({ orderId, currentDate, currentSlot }) => {
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(
        `http://localhost:5000/api/lab-test-orders/${orderId}/reschedule`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            preferredDate: newDate,
            preferredSlot: newSlot,
            reason
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Lab test rescheduled successfully!');
        window.location.reload();
      } else {
        alert('Failed to reschedule');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error rescheduling lab test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reschedule-form">
      <h3>Reschedule Lab Test</h3>
      
      <div className="current-schedule">
        <p>Current Date: {new Date(currentDate).toLocaleDateString()}</p>
        <p>Current Slot: {currentSlot.start} - {currentSlot.end}</p>
      </div>

      <form onSubmit={handleReschedule}>
        <div>
          <label>New Date:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label>New Time Slot:</label>
          <input
            type="time"
            placeholder="Start time"
            value={newSlot.start}
            onChange={(e) => setNewSlot({...newSlot, start: e.target.value})}
            required
          />
          <input
            type="time"
            placeholder="End time"
            value={newSlot.end}
            onChange={(e) => setNewSlot({...newSlot, end: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Reason (optional):</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rescheduling"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Rescheduling...' : 'Reschedule'}
        </button>
      </form>
    </div>
  );
};

export default RescheduleLabTest;
```

---

## Complete Workflow Example

```javascript
const token = localStorage.getItem('userToken');

// 1. Check prescription status before placing order
const prescriptionCheck = await fetch(
  'http://localhost:5000/api/orders/check-prescription/64cart123abc',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());

if (prescriptionCheck.data.prescriptionStatus.hasPrescriptionRequired) {
  alert('Please upload prescription before placing order');
}

// 2. Place order
const orderResponse = await fetch(
  'http://localhost:5000/api/orders/place-order',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId: '64cart123abc',
      addressId: '64addr123',
      contact: '9876543210',
      paymentMethod: 'COD'
    })
  }
).then(r => r.json());

const orderId = orderResponse.order._id;

// 3. Get order details
const orderDetails = await fetch(
  `http://localhost:5000/api/orders/${orderId}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());

// 4. Download invoice
await fetch(
  `http://localhost:5000/api/orders/${orderId}/invoice`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(async response => {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${orderId}.pdf`;
  a.click();
});

// 5. Get all orders
const allOrders = await fetch(
  'http://localhost:5000/api/orders?page=1&limit=10',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());

// 6. Get order statistics
const stats = await fetch(
  'http://localhost:5000/api/orders/statistics',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());
```

---

## Summary

### Regular Order Endpoints:
- `POST /api/orders/place-order` - Place order from cart
- `GET /api/orders` - Get all orders with pagination
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/filter` - Get orders with filters
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/check-prescription/:cartId` - Check prescription status
- `POST /api/orders/:orderId/reorder` - Reorder previous order
- `GET /api/orders/statistics` - Get order statistics
- `GET /api/orders/:id/invoice` - Download order invoice
- `GET /api/orders/my-lab-results` - Get lab test results

### Lab Test Order Endpoints:
- `POST /api/lab-test-orders` - Create lab test order
- `GET /api/lab-test-orders/my-orders` - Get my lab test orders
- `GET /api/lab-test-orders/:id` - Get lab test order by ID
- `PUT /api/lab-test-orders/:id/reschedule` - Reschedule lab test

### Key Features:
✅ Place orders from cart  
✅ Direct lab test ordering  
✅ Support for COD and Online payment  
✅ Prescription verification system  
✅ Lab test orders with home collection  
✅ Lab test rescheduling  
✅ Order tracking with OTP  
✅ Order filtering and sorting  
✅ Order cancellation  
✅ Reorder functionality  
✅ PDF invoice generation  
✅ Lab test results access  
✅ Order statistics  
✅ Patient details for lab tests  
✅ Time slot booking  
✅ Coupon code support  

### Order Status Flow:
1. **Order Placed** - Order created successfully
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched
4. **Delivered** - Order delivered (OTP verified)
5. **Cancelled** - Order cancelled by user

### Payment Methods:
- **COD** (Cash on Delivery) - Stock reduced immediately
- **Online** - Stock reduced after payment verification

---

**Last Updated:** January 2025  
**API Version:** 1.0
