# User Payment APIs - Complete Guide

## Base URL
```
http://localhost:5000/api/payment
```

**Note:** All endpoints require authentication with Bearer token.

---

## Table of Contents
1. [Create Order Payment](#1-create-order-payment)
2. [Create Appointment Payment](#2-create-appointment-payment)
3. [Verify Payment](#3-verify-payment)
4. [Handle Payment Failure](#4-handle-payment-failure)

---

## Overview

The payment system uses **Razorpay** for processing online payments. The flow is:
1. Create a payment order (gets Razorpay order ID)
2. User completes payment on Razorpay
3. Verify payment signature
4. Update order/appointment status

**Payment Methods:**
- **Online Payment** - Razorpay (Credit/Debit Card, UPI, Net Banking, Wallets)
- **COD** - Cash on Delivery (handled in order placement, not here)

---

## 1. Create Order Payment

**Endpoint:** `POST /api/payment/create-order`

**Description:** Create a Razorpay payment order for cart items.

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
  "contact": "9876543210"
}
```

**Alternative - Using Address ID:**
```json
{
  "cartId": "64cart123abc",
  "addressId": "64addr123",
  "contact": "9876543210"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| cartId | String | Yes | Cart ID containing items |
| address | String | Conditional | Full address string (required if addressId not provided) |
| addressId | String | Conditional | Address ID from saved addresses |
| contact | String | Yes | Contact phone number |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "razorpayOrderId": "order_MNOPqrstuvwxyz",
  "razorpayKeyId": "rzp_test_1234567890",
  "amount": 69000,
  "currency": "INR",
  "orderId": "64order123abc",
  "orderNumber": "ORD-1704567890123"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| razorpayOrderId | String | Razorpay order ID (use for payment) |
| razorpayKeyId | String | Razorpay key ID (use for payment) |
| amount | Number | Amount in paise (₹690 = 69000 paise) |
| currency | String | Currency code (INR) |
| orderId | String | Database order ID |
| orderNumber | String | Human-readable order number |

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

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "You can only create payments from your own cart"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Cart not found or empty",
  "error": "Invalid cart ID or empty cart"
}
```

**Frontend Integration:**
```javascript
const createOrderPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Usage
const paymentOrder = await createOrderPayment({
  cartId: '64cart123abc',
  addressId: '64addr123',
  contact: '9876543210'
});
```

---

## 2. Create Appointment Payment

**Endpoint:** `POST /api/payment/create-appointment`

**Description:** Create a Razorpay payment order for doctor appointment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "appointmentId": "64appt123abc"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "razorpayOrderId": "order_ABCDefghijklmn",
  "razorpayKeyId": "rzp_test_1234567890",
  "amount": 50000,
  "currency": "INR",
  "appointmentId": "64appt123abc"
}
```

**Error Responses:**

**400 Bad Request - Missing Appointment ID:**
```json
{
  "success": false,
  "message": "Appointment ID is required"
}
```

**400 Bad Request - Already Paid:**
```json
{
  "success": false,
  "message": "Appointment is already confirmed or paid"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**Frontend Integration:**
```javascript
const createAppointmentPayment = async (appointmentId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/payment/create-appointment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ appointmentId })
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating appointment payment:', error);
    throw error;
  }
};

// Usage
const paymentOrder = await createAppointmentPayment('64appt123abc');
```

---

## 3. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Description:** Verify Razorpay payment signature after successful payment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_MNOPqrstuvwxyz",
  "razorpay_payment_id": "pay_XYZabcdefghijk",
  "razorpay_signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| razorpay_order_id | String | Yes | Razorpay order ID |
| razorpay_payment_id | String | Yes | Razorpay payment ID |
| razorpay_signature | String | Yes | Payment signature from Razorpay |

**Success Response (200 OK) - Order Payment:**
```json
{
  "success": true,
  "message": "Order payment verified successfully",
  "order": {
    "id": "64order123abc",
    "orderNumber": "ORD-1704567890123",
    "status": "Order Placed",
    "paymentStatus": "Completed",
    "totalAmount": 690
  }
}
```

**Success Response (200 OK) - Appointment Payment:**
```json
{
  "success": true,
  "message": "Appointment payment verified successfully",
  "appointment": {
    "id": "64appt123abc",
    "status": "confirmed",
    "paymentStatus": "completed",
    "consultationFee": 500
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Data:**
```json
{
  "success": false,
  "message": "Missing payment verification data"
}
```

**400 Bad Request - Invalid Signature:**
```json
{
  "success": false,
  "message": "Invalid payment signature"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Order or appointment not found"
}
```

**Frontend Integration:**
```javascript
const verifyPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/payment/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Usage
const verification = await verifyPayment({
  razorpay_order_id: 'order_MNOPqrstuvwxyz',
  razorpay_payment_id: 'pay_XYZabcdefghijk',
  razorpay_signature: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
});
```

---

## 4. Handle Payment Failure

**Endpoint:** `POST /api/payment/failure`

**Description:** Handle payment failure and update order status.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_MNOPqrstuvwxyz",
  "error_description": "Payment failed due to insufficient funds"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment failure handled",
  "data": {
    "orderId": "64order123abc",
    "orderNumber": "ORD-1704567890123",
    "status": "Order Rejected",
    "paymentStatus": "Failed"
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Missing order ID"
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
const handlePaymentFailure = async (orderId, errorDescription) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/payment/failure', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        error_description: errorDescription
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
};

// Usage
const result = await handlePaymentFailure(
  'order_MNOPqrstuvwxyz',
  'Payment cancelled by user'
);
```

---

## Complete Payment Flow

### Order Payment Flow

```javascript
// Step 1: Create payment order
const createPayment = async (cartId, addressId, contact) => {
  const token = localStorage.getItem('userToken');
  
  const response = await fetch('http://localhost:5000/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cartId, addressId, contact })
  });
  
  return await response.json();
};

// Step 2: Initialize Razorpay
const initiateRazorpayPayment = (paymentData) => {
  const options = {
    key: paymentData.razorpayKeyId,
    amount: paymentData.amount,
    currency: paymentData.currency,
    name: 'ArogyaRx',
    description: `Order ${paymentData.orderNumber}`,
    order_id: paymentData.razorpayOrderId,
    handler: async function (response) {
      // Step 3: Verify payment
      await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });
      
      alert('Payment successful!');
      window.location.href = '/orders';
    },
    modal: {
      ondismiss: async function() {
        // Step 4: Handle payment failure/cancellation
        await handlePaymentFailure(
          paymentData.razorpayOrderId,
          'Payment cancelled by user'
        );
      }
    },
    prefill: {
      name: 'John Doe',
      email: 'john@example.com',
      contact: '9876543210'
    },
    theme: {
      color: '#556B2F'
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// Complete flow
const processOrderPayment = async () => {
  try {
    // Create payment order
    const paymentData = await createPayment(
      '64cart123abc',
      '64addr123',
      '9876543210'
    );
    
    if (paymentData.success) {
      // Open Razorpay payment modal
      initiateRazorpayPayment(paymentData);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};
```

### React Payment Component

```javascript
import React, { useState } from 'react';

const PaymentComponent = ({ cartId, addressId, contact }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load');
        return;
      }

      // Create payment order
      const token = localStorage.getItem('userToken');
      
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartId, addressId, contact })
      });

      const paymentData = await response.json();

      if (!paymentData.success) {
        alert(paymentData.message);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'ArogyaRx',
        description: `Order ${paymentData.orderNumber}`,
        order_id: paymentData.razorpayOrderId,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert('Payment successful!');
            window.location.href = '/orders';
          } else {
            alert('Payment verification failed');
          }
        },
        modal: {
          ondismiss: async function() {
            // Handle payment cancellation
            await fetch('http://localhost:5000/api/payment/failure', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: paymentData.razorpayOrderId,
                error_description: 'Payment cancelled by user'
              })
            });
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: contact
        },
        theme: {
          color: '#556B2F'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-component">
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentComponent;
```

---

## Payment Status Flow

### Order Payment Status:
1. **Pending** - Payment order created, awaiting payment
2. **Completed** - Payment successful, order placed
3. **Failed** - Payment failed or cancelled

### Order Status After Payment:
1. **Pending** - Initial state (before payment)
2. **Order Placed** - Payment successful
3. **Order Rejected** - Payment failed

### Stock Reduction:
- **COD Orders** - Stock reduced immediately on order placement
- **Online Payment** - Stock reduced after payment verification

---

## Important Notes

### Razorpay Integration:
1. Include Razorpay SDK in your HTML:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

2. Use test credentials for development:
```
Key ID: rzp_test_xxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxxx
```

3. Amount is in **paise** (₹1 = 100 paise)

### Security:
- All payment endpoints require authentication
- Payment signature is verified server-side
- Webhook signature is verified for security
- Cart ownership is validated before payment

### Error Handling:
- Handle payment failures gracefully
- Update order status on failure
- Clear cart only after successful payment
- Send notifications on payment success

---

## Summary

### Endpoints:
- `POST /api/payment/create-order` - Create order payment
- `POST /api/payment/create-appointment` - Create appointment payment
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/payment/failure` - Handle payment failure

### Payment Flow:
1. Create payment order → Get Razorpay order ID
2. Open Razorpay payment modal
3. User completes payment
4. Verify payment signature
5. Update order/appointment status
6. Reduce stock (for orders)
7. Clear cart (for orders)
8. Send confirmation notification

### Key Features:
✅ Razorpay integration  
✅ Secure payment verification  
✅ Order and appointment payments  
✅ Stock management  
✅ Cart clearing after payment  
✅ Payment failure handling  
✅ Webhook support  
✅ Notification system  

---

**Last Updated:** January 2025  
**API Version:** 1.0
