# Generic/Formula Search Implementation

## Overview
Added a toggle switch on the medicines page that allows users to search medicines by their generic name or chemical formula/salt composition.

## Features Implemented

### 1. Toggle Switch
- Located below the search bar on `/medicines` page
- Icon: Pill icon to indicate pharmaceutical search
- Label: "Search by Generic Name / Formula"
- When enabled, changes search behavior to use formula-based API

### 2. Search Modes

#### Normal Mode (Toggle OFF)
- Uses unified search API: `/api/medicines/search`
- Searches across product names, brand names, and general text
- Default behavior for general medicine browsing

#### Generic/Formula Mode (Toggle ON)
- Uses formula search API: `/api/medicines/search/by-formula`
- Searches by:
  - Generic names (e.g., "Paracetamol", "Amoxicillin")
  - Chemical formulas (e.g., "Paracetamol + Caffeine")
  - Active ingredients/salts
- Placeholder text changes to guide users
- Returns medicines grouped by their chemical composition

### 3. Visual Indicators

#### Search Bar Placeholder
- **Normal mode**: "Search all medicines..." or "Search in [Letter] medicines..."
- **Generic mode**: "Search by generic name or formula (e.g., Paracetamol, Amoxicillin + Clavulanic)"

#### Active Filters Badge
- Shows "Generic/Formula: [search term]" when searching in generic mode
- Shows "Generic Search Mode" badge when toggle is enabled
- Helps users understand which search mode is active

### 4. API Integration

#### Formula Search API
```typescript
medicinesApi.searchByFormula({
  formula: searchQuery,
  page: currentPage,
  limit: itemsPerPage,
})
```

**Endpoint**: `GET /api/medicines/search/by-formula?formula={query}&page={page}&limit={limit}`

**Response Structure**:
```json
{
  "success": true,
  "message": "Found X medicines with formula 'Y'",
  "formula": "Paracetamol",
  "data": [...medicines],
  "metadata": {
    "totalMedicines": 25,
    "manufacturers": [...],
    "priceRange": {...}
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalResults": 25,
    "resultsPerPage": 20
  }
}
```

### 5. User Experience

#### Workflow
1. User visits `/medicines` page
2. User enables "Search by Generic Name / Formula" toggle
3. Search bar placeholder updates to show example searches
4. User types generic name (e.g., "Paracetamol") or formula (e.g., "Amoxicillin + Clavulanic")
5. System searches using formula API after 1-second debounce
6. Results show all medicines containing that generic/formula
7. User can compare different brands of the same generic medicine

#### Benefits
- Find all brands of a specific generic medicine
- Compare prices across different manufacturers
- Search by chemical composition
- Useful for finding alternatives to prescribed medicines
- Better for healthcare professionals and informed users

### 6. Filter Behavior

When generic search is enabled:
- Letter filters still work
- Category filters still work
- Prescription filters still work
- All filters can be cleared together with "Clear All" button
- Generic toggle resets when "Clear All" is clicked

### 7. Console Logging

Added detailed console logs for debugging:
```javascript
console.log("=== GENERIC/FORMULA SEARCH API REQUEST ===")
console.log("Query:", searchQuery)
console.log("Mode: Generic/Formula Search")
console.log("==========================================")
```

## Technical Implementation

### State Management
```typescript
const [genericSearch, setGenericSearch] = React.useState(false)
```

### Search Logic
```typescript
if (genericSearch) {
  // Use formula search API
  const response = await medicinesApi.searchByFormula({...})
} else {
  // Use unified search API
  const response = await searchApi.searchMedicines(...)
}
```

### API Cleanup
- Removed duplicate `searchByFormula` function from `lib/api/medicines.ts`
- Kept the version that uses correct endpoint: `/medicines/search/by-formula`

## Files Modified

1. **app/medicines/page.tsx**
   - Added toggle switch UI
   - Updated search placeholder logic
   - Added generic search badge in active filters
   - Updated clearFilters to reset toggle

2. **lib/api/medicines.ts**
   - Removed duplicate `searchByFormula` function
   - Kept proper implementation with correct endpoint

## Testing Recommendations

1. **Basic Search**
   - Enable toggle and search "Paracetamol"
   - Should return all medicines with Paracetamol

2. **Combination Formula**
   - Search "Paracetamol + Caffeine"
   - Should return combination medicines

3. **Toggle Behavior**
   - Switch between modes while searching
   - Verify results update correctly

4. **Filter Interaction**
   - Enable generic search + category filter
   - Verify both filters work together

5. **Clear Filters**
   - Enable generic search and add filters
   - Click "Clear All"
   - Verify toggle resets to OFF

## Future Enhancements

1. **Autocomplete**: Add formula suggestions dropdown
2. **Popular Generics**: Show list of common generic names
3. **Formula Browser**: Dedicated page to browse by formula
4. **Comparison View**: Side-by-side comparison of same generic from different brands
5. **Save Searches**: Allow users to save favorite generic searches

## API Documentation Reference

See `UserDocs/USER_MEDICINE_API.md` for complete API documentation including:
- `/api/medicines/generic/:genericName` - Search by generic name
- `/api/medicines/search/by-formula` - Search by formula/salt
- `/api/medicines/search/unified` - Unified search (all fields)
- `/api/medicines/search/formulas` - Get all available formulas
