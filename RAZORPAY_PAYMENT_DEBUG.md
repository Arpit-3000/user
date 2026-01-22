# Razorpay Payment Integration - Debug Guide

## 🔍 Issue
When clicking "Place Order" with online payment option, Razorpay modal needs to open but might not be working.

## ✅ Fixes Applied

### 1. Enhanced Error Handling in Checkout Page
Added comprehensive try-catch blocks and logging:

```typescript
if (paymentMethod === 'Online') {
  try {
    console.log('Creating Razorpay payment order with payload:', {
      cartId,
      address: addressString,
      contact,
    });

    const paymentData = await createOrderPayment({
      cartId,
      address: addressString,
      contact,
    });

    console.log('Payment order created successfully:', paymentData);
    
    // ... rest of the code
  } catch (error: any) {
    console.error('Error in online payment flow:', error);
    toast({
      title: 'Payment Error',
      description: error.message || 'Failed to initiate payment',
      variant: 'destructive',
    });
    setPlacing(false);
  }
}
```

### 2. Enhanced Payment API Logging
Added detailed logging in `createOrderPayment`:

```typescript
console.log('Creating order payment with data:', data);

const response = await fetch(`${API_BASE_URL}/payment/orders/create-payment`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

const result = await response.json();

console.log('Create payment response:', {
  status: response.status,
  ok: response.ok,
  result
});
```

### 3. Improved Razorpay Script Loader
Enhanced script loading with better error handling:

```typescript
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      console.log('Razorpay already loaded');
      resolve(true);
      return;
    }

    // Check if script tag exists
    const existingScript = document.querySelector('script[src*="razorpay"]');
    if (existingScript) {
      console.log('Razorpay script tag exists, waiting for load...');
      setTimeout(() => {
        if ((window as any).Razorpay) {
          console.log('Razorpay loaded from existing script');
          resolve(true);
        } else {
          console.error('Razorpay script exists but not loaded');
          resolve(false);
        }
      }, 1000);
      return;
    }

    // Load new script
    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
```

### 4. Enhanced Razorpay Modal Initialization
Added comprehensive logging and error handling:

```typescript
export async function initiateRazorpayPayment(...) {
  console.log('Initiating Razorpay payment with data:', paymentData);
  
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    console.error('Razorpay script failed to load');
    onFailure('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  console.log('Razorpay script loaded successfully');

  // Check if Razorpay is available
  if (typeof window === 'undefined' || !(window as any).Razorpay) {
    console.error('Razorpay not available on window object');
    onFailure('Razorpay SDK not available. Please refresh the page.');
    return;
  }

  const options = {
    key: paymentData.razorpayKeyId,
    amount: paymentData.amount,
    currency: paymentData.currency,
    name: 'ArogyaRx',
    description: 'orderNumber' in paymentData ? `Order ${paymentData.orderNumber}` : 'Appointment Booking',
    order_id: paymentData.razorpayOrderId,
    handler: async function (response: any) {
      console.log('Razorpay payment successful:', response);
      // ... verification code
    },
    modal: {
      ondismiss: async function () {
        console.log('Razorpay modal dismissed by user');
        // ... cancellation handling
      },
    },
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
    },
    theme: {
      color: '#0ea5e9',
    },
  };

  console.log('Opening Razorpay modal with options:', options);

  try {
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
    console.log('Razorpay modal opened successfully');
  } catch (error) {
    console.error('Error opening Razorpay modal:', error);
    onFailure('Failed to open payment modal. Please try again.');
  }
}
```

## 🐛 Debugging Steps

### 1. Open Browser Console
Press `F12` or right-click → Inspect → Console tab

### 2. Check Console Logs
When you click "Place Order" with online payment, you should see:

```
Creating Razorpay payment order with payload: {cartId: "...", address: "...", contact: "..."}
Creating order payment with data: {cartId: "...", address: "...", contact: "..."}
Create payment response: {status: 201, ok: true, result: {...}}
Payment order created successfully: {razorpayOrderId: "...", razorpayKeyId: "...", ...}
Initiating Razorpay payment with data: {...}
Razorpay already loaded (or) Loading Razorpay script...
Razorpay script loaded successfully
Opening Razorpay modal with options: {...}
Razorpay modal opened successfully
```

### 3. Common Issues & Solutions

#### Issue 1: "Razorpay script failed to load"
**Cause:** Network issue or script blocked
**Solution:** 
- Check internet connection
- Check if browser is blocking scripts
- Try disabling ad blockers

#### Issue 2: "Razorpay SDK not available"
**Cause:** Script loaded but Razorpay object not created
**Solution:**
- Refresh the page
- Clear browser cache
- Check browser console for script errors

#### Issue 3: API Error (400/401/500)
**Cause:** Backend API issue
**Solution:**
- Check the "Create payment response" log
- Verify API_BASE_URL is correct
- Check authentication token
- Verify backend API is running

#### Issue 4: "Failed to create payment order"
**Cause:** Invalid payload or backend validation error
**Solution:**
- Check payload in console logs
- Verify cartId exists
- Verify address and contact are valid
- Check backend logs for detailed error

## 📋 Checklist

Before testing, verify:

- [ ] Razorpay script is loaded in layout.tsx (`<script src="https://checkout.razorpay.com/v1/checkout.js" async></script>`)
- [ ] API_BASE_URL is correctly set in environment variables
- [ ] User is authenticated (has valid token)
- [ ] Cart has items
- [ ] Address is selected or entered
- [ ] Contact number is entered
- [ ] Backend API is running and accessible
- [ ] Razorpay keys are configured on backend

## 🧪 Test Flow

1. **Add items to cart**
2. **Go to checkout page**
3. **Select/enter delivery address**
4. **Enter contact number**
5. **Select "Online Payment" option**
6. **Click "Place Order"**
7. **Check console logs** (should see all the logs mentioned above)
8. **Razorpay modal should open**
9. **Complete payment** (use test card details in test mode)
10. **Payment verification** should happen automatically
11. **Redirect to order details page**

## 🔑 Test Card Details (Razorpay Test Mode)

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

## 📝 Expected API Response

### Create Payment Order Response:
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "razorpayOrderId": "order_MNOPqrstuvwxyz",
  "razorpayKeyId": "rzp_test_1234567890",
  "amount": 9000,
  "currency": "INR",
  "orderId": "64f8a1b2c3d4e5f6g7h8i9j2",
  "orderNumber": "ORD-1234567890"
}
```

### Verify Payment Response:
```json
{
  "success": true,
  "message": "Order payment verified successfully",
  "order": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j2",
    "orderNumber": "ORD-1234567890",
    "status": "Order Placed",
    "paymentStatus": "Completed",
    "totalAmount": 90
  }
}
```

## 🎯 Success Indicators

✅ Console shows all expected logs
✅ No errors in console
✅ Razorpay modal opens
✅ Payment can be completed
✅ Success toast appears
✅ Redirects to order details page
✅ Order shows "Payment Completed" status

## 📞 If Still Not Working

1. Share the console logs (all of them)
2. Share any error messages
3. Share the network tab (XHR/Fetch requests)
4. Check if backend API is returning correct response
5. Verify Razorpay keys are configured correctly on backend

## 🔧 Files Modified

- `app/checkout/page.tsx` - Added error handling and logging
- `lib/api/payment.ts` - Enhanced all payment functions with logging
- Both files now have comprehensive error handling and debugging support
