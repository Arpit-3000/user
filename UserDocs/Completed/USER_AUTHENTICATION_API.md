# User Authentication & Profile Management APIs

## Base URL
```
http://localhost:5000/api
```

**Note:** All authenticated endpoints require Bearer token in Authorization header.

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
   - [Register User](#11-register-user)
   - [Login User](#12-login-user)
   - [Verify Token](#13-verify-token)
   - [Get User by ID](#14-get-user-by-id)
2. [Profile Management APIs](#profile-management-apis)
   - [Get Profile](#21-get-profile)
   - [Update Profile](#22-update-profile)
3. [Address Management APIs](#address-management-apis)
   - [Get All Addresses](#31-get-all-addresses)
   - [Add New Address](#32-add-new-address)
   - [Update Address](#33-update-address)
   - [Delete Address](#34-delete-address)
   - [Set Default Address](#35-set-default-address)
   - [Get Default Address](#36-get-default-address)

---

## Authentication APIs

### 1.1 Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user (patient) in the system.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "patient",
  "age": 30,
  "gender": "Male",
  "contact": "9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  }
}
```


**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | User's full name |
| email | String | Yes | Unique email address |
| password | String | Yes | Password (min 6 characters recommended) |
| role | String | Yes | Must be "patient" for customers |
| age | Number | Yes | User's age |
| gender | String | No | "Male", "Female", or "Other" |
| contact | String | Yes | Unique phone number (10 digits) |
| address | Object | No | User's address details |

**Success Response (201 Created):**
```json
{
  "message": "Patient registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64user123abc",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "age": 30,
    "gender": "Male",
    "contact": "9876543210",
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    },
    "profileImage": null,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**
```json
{
  "message": "name is required"
}
```

**409 Conflict - User Already Exists:**
```json
{
  "message": "User already exists",
  "conflictField": "email",
  "existingEmail": "john.doe@example.com",
  "providedEmail": "john.doe@example.com"
}
```

**Frontend Integration:**
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.token) {
      // Save token to localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Usage
const newUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "SecurePass123",
  role: "patient",
  age: 30,
  gender: "Male",
  contact: "9876543210",
  address: {
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001"
  }
};

const result = await registerUser(newUser);
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "role": "patient",
    "age": 30,
    "gender": "Male",
    "contact": "9876543210",
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001"
    }
  }'
```

---

### 1.2 Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Login existing user and get authentication token.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64user123abc",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "age": 30,
    "gender": "Male",
    "contact": "9876543210",
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    },
    "profileImage": "https://s3.amazonaws.com/arogyaRx/profiles/user123.jpg",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "message": "Email and password are required"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid credentials"
}
```

**Frontend Integration:**
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
      // Save token and user data
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Usage
const result = await loginUser('john.doe@example.com', 'SecurePass123');
```

**React Component Example:**
```javascript
import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

---

### 1.3 Verify Token

**Endpoint:** `GET /api/auth/verify/token`

**Description:** Verify if the current token is valid and get user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "64user123abc",
    "role": "patient",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Frontend Integration:**
```javascript
const verifyToken = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      return { success: false, message: 'No token found' };
    }

    const response = await fetch('http://localhost:5000/api/auth/verify/token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, message: 'Verification failed' };
  }
};

// Usage - Check on app load
const checkAuth = async () => {
  const result = await verifyToken();
  
  if (!result.success) {
    // Redirect to login
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
```

---

### 1.4 Get User by ID

**Endpoint:** `GET /api/auth/:id`

**Description:** Get user details by user ID (public endpoint).

**URL Parameters:**
- `id`: User's MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "_id": "64user123abc",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "patient",
  "age": 30,
  "gender": "Male",
  "contact": "9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "profileImage": null,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "User not found"
}
```

---

## Profile Management APIs

### 2.1 Get Profile

**Endpoint:** `GET /api/profile`

**Description:** Get current user's complete profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "64user123abc",
  "email": "john.doe@example.com",
  "contact": "9876543210",
  "gender": "Male",
  "role": "patient",
  "name": "John Doe",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "profileImage": "https://s3.amazonaws.com/arogyaRx/profiles/user123.jpg",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1994-01-15"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "User not found"
}
```

**Frontend Integration:**
```javascript
const getProfile = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Usage
const profile = await getProfile();
console.log('User profile:', profile);
```

---

### 2.2 Update Profile

**Endpoint:** `PUT /api/profile`

**Description:** Update user's profile information (text fields only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1994-01-15",
  "email": "john.updated@example.com",
  "contact": "9876543211",
  "gender": "Male",
  "address": {
    "street": "456 New Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400002",
    "country": "India"
  }
}
```

**Note:** All fields are optional. Only provide fields you want to update. For profile image upload, use the separate endpoint below.

**Success Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "64user123abc",
    "email": "john.updated@example.com",
    "contact": "9876543211",
    "gender": "Male",
    "role": "patient",
    "address": {
      "street": "456 New Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400002",
      "country": "India"
    }
  },
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1994-01-15"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Email already in use"
}
```

**Frontend Integration:**
```javascript
const updateProfile = async (updateData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Usage - Update specific fields
const result = await updateProfile({
  firstName: "John",
  lastName: "Doe",
  contact: "9876543211"
});
```

---

### 2.3 Upload/Update Profile Image

**Endpoint:** `PUT /api/profile/image`

**Description:** Upload or update user's profile image.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
profileImage: <image file>
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| profileImage | File | Yes | Image file (JPG, PNG, WebP) - Max 5MB |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "profileImage": "https://s3.amazonaws.com/arogyaRx/profiles/user123.jpg",
  "user": {
    "id": "64user123abc",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "profileImage": "https://s3.amazonaws.com/arogyaRx/profiles/user123.jpg"
  }
}
```

**Error Responses:**

**400 Bad Request - No File:**
```json
{
  "success": false,
  "message": "No image file provided"
}
```

**400 Bad Request - Invalid File Type:**
```json
{
  "success": false,
  "message": "Only JPG, PNG, and WebP images are allowed"
}
```

**400 Bad Request - File Too Large:**
```json
{
  "success": false,
  "message": "Image size should not exceed 5MB"
}
```

**Frontend Integration:**
```javascript
const uploadProfileImage = async (imageFile) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await fetch('http://localhost:5000/api/profile/image', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData
    });

    return await response.json();
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error;
  }
};

// Usage
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  
  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should not exceed 5MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and WebP images are allowed');
      return;
    }
    
    const result = await uploadProfileImage(file);
    console.log('Profile image updated:', result.profileImage);
  }
};
```

**React Component Example:**
```javascript
import React, { useState } from 'react';

const ProfileImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and WebP images are allowed');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!profileImage) return;
    
    setUploading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      const response = await fetch('http://localhost:5000/api/profile/image', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Profile image updated successfully!');
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        user.profileImage = data.profileImage;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <h3>Profile Image</h3>
      
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" style={{ width: 150, height: 150, borderRadius: '50%' }} />
        </div>
      )}
      
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!profileImage || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ProfileImageUpload;
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/profile/image \
  -H "Authorization: Bearer <token>" \
  -F "profileImage=@/path/to/image.jpg"
```

---

### 2.4 Delete Profile Image

**Endpoint:** `DELETE /api/profile/image`

**Description:** Remove user's profile image.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image deleted successfully",
  "user": {
    "id": "64user123abc",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "profileImage": null
  }
}
```

**Frontend Integration:**
```javascript
const deleteProfileImage = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/profile/image', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Delete profile image error:', error);
    throw error;
  }
};

// Usage
const handleDeleteImage = async () => {
  if (confirm('Are you sure you want to delete your profile image?')) {
    const result = await deleteProfileImage();
    console.log('Profile image deleted');
  }
};
```

---

## Address Management APIs

### 3.1 Get All Addresses

**Endpoint:** `GET /api/profile/addresses`

**Description:** Get all saved addresses for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "addresses": [
    {
      "_id": "64addr123",
      "type": "home",
      "label": "Home",
      "fullName": "John Doe",
      "phoneNumber": "9876543210",
      "street": "123 Main Street",
      "landmark": "Near City Mall",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true,
      "coordinates": {
        "latitude": 19.0760,
        "longitude": 72.8777
      },
      "deliveryInstructions": "Ring the bell twice",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "_id": "64addr456",
      "type": "work",
      "label": "Office",
      "fullName": "John Doe",
      "phoneNumber": "9876543210",
      "street": "456 Business Park",
      "landmark": "Tower B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400002",
      "country": "India",
      "isDefault": false,
      "deliveryInstructions": "Deliver to reception",
      "createdAt": "2024-01-16T10:00:00.000Z"
    }
  ],
  "count": 2,
  "migrated": false
}
```

**Frontend Integration:**
```javascript
const getAddresses = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/profile/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Get addresses error:', error);
    throw error;
  }
};

// Usage
const addressData = await getAddresses();
console.log(`User has ${addressData.count} addresses`);
```

---

### 3.2 Add New Address

**Endpoint:** `POST /api/profile/addresses`

**Description:** Add a new delivery address.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "home",
  "label": "Home",
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "street": "123 Main Street",
  "landmark": "Near City Mall",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": false,
  "coordinates": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "deliveryInstructions": "Ring the bell twice"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | String | No | "home", "work", or "other" (default: "home") |
| label | String | Yes | Address label (e.g., "Home", "Office") |
| fullName | String | No | Recipient name (defaults to user's name) |
| phoneNumber | String | No | Contact number (defaults to user's contact) |
| street | String | Yes | Street address |
| landmark | String | No | Nearby landmark |
| city | String | Yes | City name |
| state | String | Yes | State name |
| postalCode | String | Yes | Postal/ZIP code |
| country | String | No | Country (default: "India") |
| isDefault | Boolean | No | Set as default address |
| coordinates | Object | No | GPS coordinates |
| deliveryInstructions | String | No | Special delivery instructions |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "address": {
    "_id": "64addr789",
    "type": "home",
    "label": "Home",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "street": "123 Main Street",
    "landmark": "Near City Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "isDefault": false,
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "deliveryInstructions": "Ring the bell twice",
    "createdAt": "2024-01-17T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required fields",
  "required": ["label", "street", "city", "state", "postalCode"]
}
```

**Frontend Integration:**
```javascript
const addAddress = async (addressData) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('http://localhost:5000/api/profile/addresses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addressData)
    });

    return await response.json();
  } catch (error) {
    console.error('Add address error:', error);
    throw error;
  }
};

// Usage
const newAddress = {
  type: "home",
  label: "Home",
  street: "123 Main Street",
  landmark: "Near City Mall",
  city: "Mumbai",
  state: "Maharashtra",
  postalCode: "400001",
  deliveryInstructions: "Ring the bell twice"
};

const result = await addAddress(newAddress);
```

---

### 3.3 Update Address

**Endpoint:** `PUT /api/profile/addresses/:addressId`

**Description:** Update an existing address.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `addressId`: Address MongoDB ObjectId

**Request Body:**
```json
{
  "label": "Home - Updated",
  "street": "456 New Street",
  "landmark": "Near New Mall",
  "deliveryInstructions": "Call before delivery"
}
```

**Note:** Only provide fields you want to update.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "address": {
    "_id": "64addr123",
    "type": "home",
    "label": "Home - Updated",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "street": "456 New Street",
    "landmark": "Near New Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "isDefault": true,
    "deliveryInstructions": "Call before delivery",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Address not found"
}
```

---

### 3.4 Delete Address

**Endpoint:** `DELETE /api/profile/addresses/:addressId`

**Description:** Delete an address. Cannot delete if it's the last address.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `addressId`: Address MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Cannot delete the last address. At least one address is required."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Address not found"
}
```

---

### 3.5 Set Default Address

**Endpoint:** `PUT /api/profile/addresses/:addressId/default`

**Description:** Set an address as the default delivery address.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `addressId`: Address MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "defaultAddress": {
    "_id": "64addr456",
    "type": "work",
    "label": "Office",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "street": "456 Business Park",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400002",
    "country": "India",
    "isDefault": true,
    "createdAt": "2024-01-16T10:00:00.000Z"
  }
}
```

---

### 3.6 Get Default Address

**Endpoint:** `GET /api/profile/addresses/default`

**Description:** Get the current default delivery address.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Default address retrieved successfully",
  "defaultAddress": {
    "_id": "64addr123",
    "type": "home",
    "label": "Home",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "street": "123 Main Street",
    "landmark": "Near City Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "isDefault": true,
    "deliveryInstructions": "Ring the bell twice",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## Complete Workflow Examples

### Registration & Login Flow
```javascript
// 1. Register new user
const registerData = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "SecurePass123",
  role: "patient",
  age: 30,
  gender: "Male",
  contact: "9876543210"
};

const registerResult = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registerData)
}).then(r => r.json());

// Save token
localStorage.setItem('userToken', registerResult.token);

// 2. Or login existing user
const loginResult = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "SecurePass123"
  })
}).then(r => r.json());

localStorage.setItem('userToken', loginResult.token);

// 3. Verify token on app load
const token = localStorage.getItem('userToken');
const verifyResult = await fetch('http://localhost:5000/api/auth/verify/token', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

if (!verifyResult.success) {
  // Redirect to login
  window.location.href = '/login';
}
```

### Profile Management Flow
```javascript
const token = localStorage.getItem('userToken');

// 1. Get current profile
const profile = await fetch('http://localhost:5000/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. Update profile
const updateResult = await fetch('http://localhost:5000/api/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    contact: "9876543211"
  })
}).then(r => r.json());
```

### Address Management Flow
```javascript
const token = localStorage.getItem('userToken');

// 1. Get all addresses
const addresses = await fetch('http://localhost:5000/api/profile/addresses', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. Add new address
const newAddress = await fetch('http://localhost:5000/api/profile/addresses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    label: "Office",
    street: "456 Business Park",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400002"
  })
}).then(r => r.json());

const addressId = newAddress.address._id;

// 3. Set as default
await fetch(`http://localhost:5000/api/profile/addresses/${addressId}/default`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. Get default address
const defaultAddr = await fetch('http://localhost:5000/api/profile/addresses/default', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

---

## Summary

### Authentication Endpoints:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify/token` - Verify token
- `GET /api/auth/:id` - Get user by ID

### Profile Endpoints:
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile (text fields)
- `PUT /api/profile/image` - Upload/update profile image
- `DELETE /api/profile/image` - Delete profile image

### Address Endpoints:
- `GET /api/profile/addresses` - Get all addresses
- `POST /api/profile/addresses` - Add address
- `PUT /api/profile/addresses/:addressId` - Update address
- `DELETE /api/profile/addresses/:addressId` - Delete address
- `PUT /api/profile/addresses/:addressId/default` - Set default
- `GET /api/profile/addresses/default` - Get default address

### Key Features:
✅ JWT-based authentication  
✅ Secure password hashing  
✅ Token expiration (30 days)  
✅ Complete profile management  
✅ Profile image upload/update/delete  
✅ Image validation (type and size)  
✅ S3 cloud storage for images  
✅ Multiple address support  
✅ Default address management  
✅ Address validation  
✅ Error handling for all cases  

---

**Last Updated:** January 2025  
**API Version:** 1.0
