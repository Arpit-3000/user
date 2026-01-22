# Medicine "Currently Unavailable" Debug Guide

## 🐛 Issue
Medicine showing "Currently Unavailable" badge on detail page but "Add to Cart" button is enabled and working.

## 🔍 Possible Causes

### 1. **Stale/Cached Data**
The page might be showing old cached data where the medicine was out of stock.

### 2. **API Response Format Issue**
The API might be returning stock data in a different format than expected.

### 3. **State Update Issue**
The `inStock` variable might not be updating when medicine data changes.

## 🧪 Debug Steps

### Step 1: Open Browser Console
Press `F12` or right-click → Inspect → Console tab

### Step 2: Navigate to Medicine Detail Page
Click on the medicine that shows "Currently Unavailable"

### Step 3: Check Console Logs
You should see detailed logs like:

```
=== MEDICINE API RESPONSE ===
Full Response: {...}
Response Data: {...}
Direct Response: {...}
============================

=== PROCESSED MEDICINE DATA ===
Medicine Data: {...}
Stock: {quantity: 50, unit: "strips", ...}
Stock Quantity: 50
===============================

=== MEDICINE DETAIL STOCK CHECK ===
Medicine: 12 M FORTE CAP 1*10
Stock Data: {quantity: 50, unit: "strips"}
Stock Quantity: 50
In Stock: true
===================================
```

### Step 4: Analyze the Logs

#### ✅ If Stock Quantity > 0 and In Stock = true:
The logic is working correctly. The issue might be:
- **Browser cache**: Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- **React state not updating**: The component might not be re-rendering

#### ❌ If Stock Quantity = 0 or undefined:
The API is not returning stock data correctly:
- Check backend API response
- Verify medicine has stock in database
- Check if API is populating stock field

#### ❌ If Stock Quantity > 0 but In Stock = false:
There's a logic error (shouldn't happen with current code)

## 🔧 Quick Fixes

### Fix 1: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```
This clears browser cache and reloads the page.

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check API Response
Open Network tab in DevTools:
1. Go to Network tab
2. Reload the page
3. Find the API call to `/medicines/{id}`
4. Check the response:
   ```json
   {
     "stock": {
       "quantity": 50,  // Should be > 0
       "unit": "strips"
     }
   }
   ```

## 📊 Expected Behavior

### When Stock Quantity > 0:
- ✅ Badge shows: "In Stock"
- ✅ Shows: "50 units available"
- ✅ Button shows: "Add to Cart"
- ✅ Button is enabled

### When Stock Quantity = 0:
- ✅ Badge shows: "Currently Unavailable"
- ✅ Button shows: "Out of Stock"
- ✅ Button is disabled

## 🎯 Current Implementation

### Stock Check Logic:
```typescript
const stockData = medicine.stock || {}
const stockQuantity = stockData.quantity ?? 0
const inStock = stockQuantity > 0
```

### Display Logic:
```typescript
{inStock ? (
  <Badge variant="secondary" className="bg-green-100 text-green-800">
    In Stock
  </Badge>
) : (
  <Badge variant="destructive">Currently Unavailable</Badge>
)}
```

### Button Logic:
```typescript
<Button
  disabled={!inStock || addingToCart}
  onClick={handleAddToCart}
>
  Add to Cart
</Button>
```

## 🔍 What to Share for Debugging

If the issue persists, share:

1. **Console Logs**: All three log blocks from console
2. **Network Response**: The API response from Network tab
3. **Screenshot**: Current state of the page
4. **Medicine ID**: The ID of the medicine showing the issue

## 💡 Common Issues & Solutions

### Issue 1: Badge shows "Unavailable" but button works
**Cause**: React state not updating after API call
**Solution**: 
- Hard refresh the page
- Check if `setMedicine()` is being called
- Verify `medicine` state is updated

### Issue 2: API returns stock but shows unavailable
**Cause**: Stock data format mismatch
**Solution**:
- Check console logs for stock data structure
- Verify `stockData.quantity` is accessible
- Check if quantity is a number (not string)

### Issue 3: Inconsistent behavior
**Cause**: Browser caching
**Solution**:
- Clear browser cache
- Disable cache in DevTools (Network tab → Disable cache checkbox)
- Use incognito/private window

## 🎉 Expected Result

After debugging, you should see:
- ✅ Console shows correct stock quantity
- ✅ `In Stock` badge appears
- ✅ Stock quantity displayed (e.g., "50 units available")
- ✅ "Add to Cart" button enabled
- ✅ No "Currently Unavailable" badge

## 📞 Next Steps

1. Open the medicine detail page
2. Check browser console
3. Share the console logs
4. I'll help identify the exact issue based on the logs
