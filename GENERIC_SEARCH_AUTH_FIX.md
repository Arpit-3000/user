# Generic Medicine Search Authentication Fix

## Issue
When using the generic/formula search toggle, users were getting:
```json
{"message":"Access Denied. No token provided."}
```

Even though they were logged in.

## Root Cause
The new medicine search API functions (`searchByFormula`, `unifiedSearch`, `getFormulas`) were not sending authentication headers with their requests.

The backend API requires authentication tokens for these endpoints, but the frontend was making requests without the `Authorization` header.

## Solution
Added `getAuthHeaders()` to all three search functions in `lib/api/medicines.ts`:

### 1. searchByFormula
```typescript
const response = await fetch(`${API_BASE_URL}/medicines/search/by-formula?${queryParams.toString()}`, {
  headers: getAuthHeaders(),  // ✅ Added auth headers
})
```

### 2. unifiedSearch
```typescript
const response = await fetch(`${API_BASE_URL}/medicines/search/unified?${queryParams.toString()}`, {
  headers: getAuthHeaders(),  // ✅ Added auth headers
})
```

### 3. getFormulas
```typescript
const response = await fetch(`${API_BASE_URL}/medicines/search/formulas?${queryParams.toString()}`, {
  headers: getAuthHeaders(),  // ✅ Added auth headers
})
```

## What getAuthHeaders() Does

The `getAuthHeaders()` function from `lib/api-config.ts`:
1. Retrieves the JWT token from localStorage
2. Returns headers object with Authorization bearer token
3. Includes Content-Type: application/json

```typescript
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
```

## Files Modified

**lib/api/medicines.ts**
- Added auth headers to `searchByFormula()` function
- Added auth headers to `unifiedSearch()` function
- Added auth headers to `getFormulas()` function

## Testing

1. **Login Required**
   - User must be logged in
   - Token stored in localStorage

2. **Generic Search**
   - Enable "Search by Generic Name / Formula" toggle
   - Search for "Paracetamol"
   - Should return results without auth errors

3. **Unified Search**
   - If backend uses unified search endpoint
   - Should work with auth headers

4. **Formula List**
   - If using formula autocomplete
   - Should fetch formulas with auth

## Why This Happened

When implementing the new generic search feature, the API functions were copied from documentation examples that didn't include authentication. The existing medicine search functions (`getMedicines`, `getById`, etc.) already had auth headers, but the new search functions were missing them.

## Prevention

When adding new API functions:
1. ✅ Always check if endpoint requires authentication
2. ✅ Copy from existing authenticated functions as template
3. ✅ Test with logged-in and logged-out states
4. ✅ Check API documentation for auth requirements

## Related Functions

Other medicine API functions that correctly use auth headers:
- `getById()` - ✅ Has auth headers
- `searchByName()` - ✅ Has auth headers
- `searchByGeneric()` - ✅ Has auth headers
- `searchByGenericName()` - ✅ Has auth headers
- `checkPrescription()` - ❌ No auth headers (might need fixing)

## Backend Note

If these endpoints should be public (no auth required), the backend should be updated to allow unauthenticated access. However, since the user is logged in and the API is returning "Access Denied", adding auth headers is the correct fix.
