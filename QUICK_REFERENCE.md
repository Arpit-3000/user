# Generic Medicine Search - Quick Reference

## API Endpoints (Corrected ✅)

```
GET /api/medicines/generic/:name     - Search by generic name
GET /api/medicines/formula           - Search by formula/salt
GET /api/medicines/search            - Unified search (all fields)
GET /api/medicines/formulas          - Get all formulas list
```

## Frontend Usage

### Enable Generic Search
```typescript
// User toggles switch ON
setGenericSearch(true)

// API call
const response = await medicinesApi.searchByFormula({
  formula: "Paracetamol",
  page: 1,
  limit: 20
})

// Access data
const medicines = response.data
const total = response.metadata.totalResults
```

### Normal Search
```typescript
// User toggles switch OFF
setGenericSearch(false)

// API call
const response = await searchApi.searchMedicines("Crocin", {
  page: 1,
  limit: 20
})

// Access data
const medicines = response.results.medicines.data
```

## Common Search Examples

| Search Term | Mode | Results |
|-------------|------|---------|
| "Paracetamol" | Generic ON | All Paracetamol brands |
| "Paracetamol + Caffeine" | Generic ON | Combination medicines |
| "Crocin" | Generic OFF | Crocin brand products |
| "Pain" | Generic OFF | All pain-related medicines |

## Response Structure

### Formula Search
```json
{
  "success": true,
  "formula": "Paracetamol",
  "data": [...medicines],
  "metadata": {
    "totalResults": 25,
    "currentPage": 1,
    "totalPages": 3
  }
}
```

### Unified Search
```json
{
  "success": true,
  "query": "Paracetamol",
  "data": [...medicines],
  "categorizedResults": {
    "exactNameMatch": 5,
    "partialNameMatch": 20,
    "formulaMatch": 15,
    "genericMatch": 5
  },
  "metadata": {
    "totalResults": 45,
    "currentPage": 1
  }
}
```

## Error Handling

```typescript
try {
  const response = await medicinesApi.searchByFormula({...})
  if (response.success) {
    setMedicines(response.data)
  }
} catch (error) {
  toast({
    title: "Error",
    description: error.message || "Search failed",
    variant: "destructive"
  })
}
```

## Authentication

All search APIs require JWT token:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Files to Check

- **UI**: `app/medicines/page.tsx`
- **API**: `lib/api/medicines.ts`
- **Cart**: `app/cart/page.tsx`
- **Lab Tests**: `app/lab-tests/page.tsx`

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Access Denied" | Check if user is logged in, token exists |
| "Cannot read _id" | Fixed - null checks added |
| Wrong endpoint | Fixed - endpoints corrected |
| No results | Check if backend has data for that formula |

## Status: ✅ READY FOR USE

All features implemented, tested, and documented.
