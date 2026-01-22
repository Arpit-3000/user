# Payment API Endpoint Fix

## 🐛 Issue
Payment API endpoints were using incorrect URL pattern.

## ❌ Before (Wrong)
```typescript
/payment/orders/create-payment  ❌
/payment/create-appointment     ❌
/payment/verify                 ❌
/payment/failure                ❌
```

## ✅ After (Correct)
```typescript
/payments/orders/create-payment  ✅
/payments/create-appointment     ✅
/payments/verify                 ✅
/payments/failure                ✅
```

## 🔧 Changes Made

### 1. Create Order Payment
```typescript
// Before
fetch(`${API_BASE_URL}/payment/orders/create-payment`, ...)

// After
fetch(`${API_BASE_URL}/payments/orders/create-payment`, ...)
```

### 2. Create Appointment Payment
```typescript
// Before
fetch(`${API_BASE_URL}/payment/create-appointment`, ...)

// After
fetch(`${API_BASE_URL}/payments/create-appointment`, ...)
```

### 3. Verify Payment
```typescript
// Before
fetch(`${API_BASE_URL}/payment/verify`, ...)

// After
fetch(`${API_BASE_URL}/payments/verify`, ...)
```

### 4. Handle Payment Failure
```typescript
// Before
fetch(`${API_BASE_URL}/payment/failure`, ...)

// After
fetch(`${API_BASE_URL}/payments/failure`, ...)
```

## 📝 File Modified
- `lib/api/payment.ts` - Updated all payment API endpoints

## 🎯 Result
Now all payment API calls will use the correct endpoint URLs with `/payments/` (plural) instead of `/payment/` (singular).

## ✅ Testing
After this fix:
1. Click "Place Order" with online payment
2. API should successfully create payment order
3. Razorpay modal should open
4. Payment can be completed
5. Verification should work correctly

## 🔍 Verification
Check browser console logs:
```
Creating order payment with data: {...}
Create payment response: {status: 201, ok: true, result: {...}}
Payment order created successfully: {...}
```

If you see status 404 or "Not Found", the endpoint URL is still wrong.
If you see status 201 or 200, the endpoint is correct! ✅
