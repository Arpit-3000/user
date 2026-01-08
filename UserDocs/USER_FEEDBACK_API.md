# User Feedback & Reviews API Documentation

## Overview
This document provides comprehensive API documentation for the user-side feedback and review system. Users can submit reviews for category products they've purchased, view product reviews, and manage their review history.

**Base URL**: `/api`

---

## Table of Contents
1. [Submit Product Feedback](#1-submit-product-feedback)
2. [Get Products Needing Feedback](#2-get-products-needing-feedback)
3. [Get Product Feedback/Reviews](#3-get-product-feedbackreviews)
4. [Get User's Feedback History](#4-get-users-feedback-history)

---

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. Submit Product Feedback

Submit a review/feedback for a category product from a completed order.

**Endpoint**: `POST /api/feedback/submit`

**Authentication**: Required

**Request Body**:
```json
{
  "categoryProductId": "64abc123def456789",
  "orderId": "64xyz789abc123456",
  "rating": 5,
  "comment": "Excellent product! Very satisfied with the quality and delivery."
}
```

**Field Descriptions**:
- `categoryProductId` (string, required): ID of the category product being reviewed
- `orderId` (string, required): ID of the order containing this product
- `rating` (number, required): Rating from 1 to 5 stars
- `comment` (string, required): Review comment (1-500 characters)

**Validation Rules**:
- Rating must be between 1 and 5
- Comment must be 1-500 characters
- Order must belong to the authenticated user
- Product must exist in the specified order
- User can only review each product once per order

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "categoryProductId": "64abc123def456789",
    "orderId": "64xyz789abc123456",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality and delivery.",
    "averageRating": 4.7,
    "totalReviews": 23
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "message": "categoryProductId, orderId, rating, and comment are required"
}
```

**400 Bad Request** - Invalid rating:
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

**400 Bad Request** - Invalid comment length:
```json
{
  "success": false,
  "message": "Comment must be between 1 and 500 characters"
}
```

**404 Not Found** - Order not found:
```json
{
  "success": false,
  "message": "Order not found or does not belong to you"
}
```

**400 Bad Request** - Product not in order:
```json
{
  "success": false,
  "message": "This product was not found in your order"
}
```

**404 Not Found** - Product not found:
```json
{
  "success": false,
  "message": "Category product not found"
}
```

**400 Bad Request** - Already reviewed:
```json
{
  "success": false,
  "message": "You have already reviewed this product for this order"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error submitting feedback",
  "error": "Error details"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/feedback/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "categoryProductId": "64abc123def456789",
    "orderId": "64xyz789abc123456",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality and delivery."
  }'
```

---

### 2. Get Products Needing Feedback

Get a list of category products from a specific order that haven't been reviewed yet.

**Endpoint**: `GET /api/feedback/order/:orderId/products`

**Authentication**: Required

**URL Parameters**:
- `orderId` (string, required): Order ID to check for pending reviews

**Success Response** (200 OK) - Products need feedback:
```json
{
  "success": true,
  "message": "Products need feedback",
  "data": [
    {
      "categoryProductId": "64abc123def456789",
      "productName": "Vitamin D3 Supplement",
      "brandName": "HealthPlus",
      "quantity": 2,
      "price": 599,
      "needsFeedback": true
    },
    {
      "categoryProductId": "64abc456def789012",
      "productName": "Omega-3 Fish Oil",
      "brandName": "NutriCare",
      "quantity": 1,
      "price": 899,
      "needsFeedback": true
    }
  ],
  "needsFeedback": true,
  "totalProducts": 3,
  "reviewedProducts": 1
}
```

**Success Response** (200 OK) - All products reviewed:
```json
{
  "success": true,
  "message": "All products have been reviewed",
  "data": [],
  "needsFeedback": false,
  "totalProducts": 3,
  "reviewedProducts": 3
}
```

**Success Response** (200 OK) - No category products:
```json
{
  "success": true,
  "message": "No category products found in this order",
  "data": [],
  "needsFeedback": false
}
```

**Error Responses**:

**404 Not Found** - Order not found:
```json
{
  "success": false,
  "message": "Order not found or does not belong to you"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error getting products needing feedback",
  "error": "Error details"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/feedback/order/64xyz789abc123456/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get Product Feedback/Reviews

Get all reviews for a specific category product with pagination.

**Endpoint**: `GET /api/feedback/product/:categoryProductId`

**Authentication**: Not Required (Public)

**URL Parameters**:
- `categoryProductId` (string, required): Category product ID

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Success Response** (200 OK):
```json
{
  "success": true,
  "product": {
    "id": "64abc123def456789",
    "productName": "Vitamin D3 Supplement",
    "brandName": "HealthPlus"
  },
  "feedback": {
    "averageRating": 4.5,
    "totalReviews": 45,
    "reviews": [
      {
        "id": "64review123abc",
        "rating": 5,
        "comment": "Excellent product! Very satisfied with the quality and delivery.",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "64review456def",
        "rating": 4,
        "comment": "Good product, but delivery was a bit slow.",
        "user": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "createdAt": "2024-01-14T15:20:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses**:

**404 Not Found** - Product not found:
```json
{
  "success": false,
  "message": "Category product not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error getting product feedback",
  "error": "Error details"
}
```

**cURL Example**:
```bash
# Get first page of reviews
curl -X GET "http://localhost:5000/api/feedback/product/64abc123def456789?page=1&limit=10"

# Get second page
curl -X GET "http://localhost:5000/api/feedback/product/64abc123def456789?page=2&limit=10"
```

---

### 4. Get User's Feedback History

Get all reviews submitted by the authenticated user.

**Endpoint**: `GET /api/feedback/user/history`

**Authentication**: Required

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "reviewId": "64review123abc",
      "productId": "64abc123def456789",
      "productName": "Vitamin D3 Supplement",
      "brandName": "HealthPlus",
      "category": "Vitamins & Supplements",
      "rating": 5,
      "comment": "Excellent product! Very satisfied with the quality and delivery.",
      "orderId": "64xyz789abc123456",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "reviewId": "64review456def",
      "productId": "64abc456def789012",
      "productName": "Omega-3 Fish Oil",
      "brandName": "NutriCare",
      "category": "Vitamins & Supplements",
      "rating": 4,
      "comment": "Good product, helps with joint health.",
      "orderId": "64xyz789abc123456",
      "createdAt": "2024-01-14T15:20:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalReviews": 12,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses**:

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error getting user feedback history",
  "error": "Error details"
}
```

**cURL Example**:
```bash
# Get first page of user's reviews
curl -X GET "http://localhost:5000/api/feedback/user/history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get second page
curl -X GET "http://localhost:5000/api/feedback/user/history?page=2&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Frontend Integration Examples

### React Component - Submit Review

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const SubmitReview = ({ productId, orderId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/feedback/submit',
        {
          categoryProductId: productId,
          orderId: orderId,
          rating: rating,
          comment: comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Review submitted successfully!');
        setRating(0);
        setComment('');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-review">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="rating-input">
          <label>Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'star filled' : 'star'}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="comment-input">
          <label>Your Review:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            maxLength={500}
            rows={4}
            required
          />
          <small>{comment.length}/500 characters</small>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading || rating === 0}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;
```

### React Component - Products Needing Feedback

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmitReview from './SubmitReview';

const ProductsNeedingFeedback = ({ orderId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProductsNeedingFeedback();
  }, [orderId]);

  const fetchProductsNeedingFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/feedback/order/${orderId}/products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (products.length === 0) {
    return <div>All products have been reviewed!</div>;
  }

  return (
    <div className="products-needing-feedback">
      <h2>Rate Your Products</h2>
      <p>You have {products.length} product(s) waiting for your review</p>

      {products.map((product) => (
        <div key={product.categoryProductId} className="product-card">
          <div className="product-info">
            <h3>{product.productName}</h3>
            <p className="brand">{product.brandName}</p>
            <p className="quantity">Quantity: {product.quantity}</p>
            <p className="price">₹{product.price}</p>
          </div>

          {selectedProduct === product.categoryProductId ? (
            <SubmitReview
              productId={product.categoryProductId}
              orderId={orderId}
              onSuccess={() => {
                setSelectedProduct(null);
                fetchProductsNeedingFeedback();
              }}
            />
          ) : (
            <button onClick={() => setSelectedProduct(product.categoryProductId)}>
              Write Review
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsNeedingFeedback;
```

### React Component - Display Product Reviews

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [productId, currentPage]);

  const fetchReviews = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/feedback/product/${productId}?page=${page}&limit=10`
      );

      if (response.data.success) {
        setProduct(response.data.product);
        setFeedback(response.data.feedback);
        setReviews(response.data.feedback.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        {feedback && (
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{feedback.averageRating}</span>
              <span className="stars">{renderStars(Math.round(feedback.averageRating))}</span>
            </div>
            <p>{feedback.totalReviews} reviews</p>
          </div>
        )}
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="user-info">
                  <strong>{review.user.name}</strong>
                  <span className="stars">{renderStars(review.rating)}</span>
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
```

### React Component - User's Review History

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReviews(currentPage);
  }, [currentPage]);

  const fetchMyReviews = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/feedback/user/history?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setReviews(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div>Loading your reviews...</div>;

  return (
    <div className="my-reviews">
      <h2>My Reviews</h2>
      
      {reviews.length === 0 ? (
        <p>You haven't written any reviews yet.</p>
      ) : (
        <>
          <p className="total-count">Total Reviews: {pagination.totalReviews}</p>
          
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-card">
                <div className="product-info">
                  <h3>{review.productName}</h3>
                  <p className="brand">{review.brandName}</p>
                  <p className="category">{review.category}</p>
                </div>
                
                <div className="review-content">
                  <div className="rating">
                    <span className="stars">{renderStars(review.rating)}</span>
                    <span className="rating-number">{review.rating}/5</span>
                  </div>
                  <p className="comment">{review.comment}</p>
                  <div className="review-meta">
                    <span className="date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <span className="order-id">Order: {review.orderId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalReviews > 10 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              <span>Page {pagination.currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyReviews;
```

---

## Complete Workflow Example

### Scenario: User Completes Order and Submits Reviews

```javascript
// Step 1: After order is delivered, check which products need feedback
const checkPendingReviews = async (orderId) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get(
    `http://localhost:5000/api/feedback/order/${orderId}/products`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  if (response.data.needsFeedback) {
    console.log(`${response.data.data.length} products need your review`);
    return response.data.data;
  }
  
  return [];
};

// Step 2: Submit review for each product
const submitReview = async (productId, orderId, rating, comment) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    'http://localhost:5000/api/feedback/submit',
    {
      categoryProductId: productId,
      orderId: orderId,
      rating: rating,
      comment: comment
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
};

// Step 3: View all your reviews
const viewMyReviews = async () => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get(
    'http://localhost:5000/api/feedback/user/history?page=1&limit=10',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.data.data;
};

// Complete workflow
const reviewWorkflow = async (orderId) => {
  try {
    // Check pending reviews
    const pendingProducts = await checkPendingReviews(orderId);
    
    if (pendingProducts.length > 0) {
      // Submit reviews for each product
      for (const product of pendingProducts) {
        await submitReview(
          product.categoryProductId,
          orderId,
          5, // rating
          'Great product!' // comment
        );
      }
      
      console.log('All reviews submitted!');
    }
    
    // View all your reviews
    const myReviews = await viewMyReviews();
    console.log('Your reviews:', myReviews);
    
  } catch (error) {
    console.error('Error in review workflow:', error);
  }
};
```

---

## Summary

### User-Side Endpoints (4 APIs)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/feedback/submit` | POST | Required | Submit product review |
| `/api/feedback/order/:orderId/products` | GET | Required | Get products needing feedback |
| `/api/feedback/product/:categoryProductId` | GET | Public | Get product reviews |
| `/api/feedback/user/history` | GET | Required | Get user's review history |

### Key Features
- ⭐ **Rating System**: 1-5 star ratings for products
- 📝 **Review Comments**: 1-500 character reviews
- ✅ **Order Verification**: Only review purchased products
- 🚫 **Duplicate Prevention**: One review per product per order
- 📊 **Average Ratings**: Automatic calculation of product ratings
- 📄 **Pagination**: Efficient browsing of reviews
- 🔍 **Review History**: Track all submitted reviews
- 📱 **Frontend Ready**: Complete React components included

### Business Rules
1. Users can only review products they've purchased
2. One review per product per order
3. Reviews are permanent (no edit/delete in current implementation)
4. Ratings must be 1-5 stars
5. Comments must be 1-500 characters
6. Product reviews are public (no authentication required to view)
7. Average ratings update automatically when new reviews are added

---

**Last Updated**: January 2026
**Version**: 1.0
