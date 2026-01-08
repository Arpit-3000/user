# User Appointment & Doctor Booking API Documentation

## Overview
This document provides comprehensive API documentation for the user-side appointment booking system. Users can browse doctors, check availability, book appointments, view their appointments, and manage bookings.

**Base URL**: `/api/appointments`

---

## Table of Contents
1. [List All Doctors](#1-list-all-doctors)
2. [Get Doctor Availability](#2-get-doctor-availability)
3. [Book Appointment](#3-book-appointment)
4. [Get My Appointments](#4-get-my-appointments)
5. [Get Appointment Details](#5-get-appointment-details)
6. [Cancel Appointment](#6-cancel-appointment)
7. [Create Appointment Payment](#7-create-appointment-payment)

---

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

**Public Endpoints** (No authentication required):
- List All Doctors
- Get Doctor Availability

---

## API Endpoints

### 1. List All Doctors

Browse all available doctors with filtering, searching, and sorting options.

**Endpoint**: `GET /api/appointments/doctors`

**Authentication**: Not Required (Public)

**Query Parameters**:
- `specialization` (string/array, optional): Filter by specialization
- `consultationType` (string, optional): Filter by consultation type (`online`, `offline`, `both`)
- `search` (string, optional): Search by name, specialization, or qualification
- `sortBy` (string, optional): Sort field (`name`, `fee`, `experience`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Doctors retrieved successfully",
  "data": {
    "doctors": [
      {
        "_id": "64abc123def456789",
        "name": "Dr. Rajesh Kumar",
        "email": "rajesh.kumar@hospital.com",
        "specialization": "Cardiologist",
        "qualification": "MBBS, MD (Cardiology)",
        "experience": "15 years",
        "contact": "+91-9876543210",
        "fee": 800,
        "consultationType": "both",
        "bio": "Experienced cardiologist with expertise in heart diseases and preventive cardiology.",
        "address": {
          "street": "123 Medical Center",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001"
        },
        "profileImage": "https://s3.amazonaws.com/doctor-profiles/dr-rajesh.jpg",
        "source": "doctor"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalDoctors": 98,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 20,
      "nextPage": 2
    },
    "filters": {
      "appliedFilters": {
        "specialization": "Cardiologist",
        "consultationType": "both",
        "search": null
      },
      "availableSpecializations": [
        "Cardiologist",
        "Dermatologist",
        "General Physician",
        "Gynecologist",
        "Orthopedic",
        "Pediatrician"
      ],
      "availableConsultationTypes": ["online", "offline", "both"]
    }
  }
}
```

**cURL Examples**:
```bash
# Get all doctors
curl -X GET "http://localhost:5000/api/appointments/doctors"

# Filter by specialization
curl -X GET "http://localhost:5000/api/appointments/doctors?specialization=Cardiologist"

# Search doctors
curl -X GET "http://localhost:5000/api/appointments/doctors?search=rajesh"

# Filter by consultation type
curl -X GET "http://localhost:5000/api/appointments/doctors?consultationType=online"

# Sort by fee (ascending)
curl -X GET "http://localhost:5000/api/appointments/doctors?sortBy=fee&sortOrder=asc"

# Pagination
curl -X GET "http://localhost:5000/api/appointments/doctors?page=2&limit=10"
```

---

### 2. Get Doctor Availability

Get the availability schedule for a specific doctor.

**Endpoint**: `GET /api/appointments/doctors/:doctorId/availability`

**Authentication**: Not Required (Public)

**URL Parameters**:
- `doctorId` (string, required): Doctor's ID

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64avail123abc",
      "doctorId": "64abc123def456789",
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDuration": 30,
      "isActive": true,
      "breakTime": {
        "start": "13:00",
        "end": "14:00"
      }
    },
    {
      "_id": "64avail456def",
      "doctorId": "64abc123def456789",
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDuration": 30,
      "isActive": true
    }
  ]
}
```

**Note**: `dayOfWeek` values: 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/appointments/doctors/64abc123def456789/availability"
```

---

### 3. Book Appointment

Book a new appointment with a doctor.

**Endpoint**: `POST /api/appointments`

**Authentication**: Required

**Request Body**:
```json
{
  "doctorId": "64abc123def456789",
  "date": "2026-01-15",
  "time": "10:30",
  "reason": "Regular checkup and consultation for chest pain",
  "consultationType": "offline"
}
```

**Field Descriptions**:
- `doctorId` (string, required): ID of the doctor
- `date` (string, required): Appointment date (YYYY-MM-DD format)
- `time` (string, required): Appointment time (HH:MM format, 24-hour)
- `reason` (string, optional): Reason for appointment
- `consultationType` (string, optional): Type of consultation (`online`, `offline`, `virtual`). Default: `offline`

**Validation Rules**:
- Date cannot be in the past
- Cannot have multiple pending appointments with the same doctor
- Time slot must not be already booked
- Doctor must exist and be active

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "64appt789xyz",
    "patientId": "64user456abc",
    "doctorId": {
      "_id": "64abc123def456789",
      "name": "Dr. Rajesh Kumar",
      "email": "rajesh.kumar@hospital.com",
      "specialization": "Cardiologist",
      "qualification": "MBBS, MD (Cardiology)",
      "fee": 800
    },
    "date": "2026-01-15T00:00:00.000Z",
    "time": "10:30",
    "duration": 30,
    "consultationType": "offline",
    "status": "pending",
    "reason": "Regular checkup and consultation for chest pain",
    "fee": 800,
    "paymentStatus": "pending",
    "createdAt": "2026-01-05T10:00:00.000Z",
    "updatedAt": "2026-01-05T10:00:00.000Z"
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "message": "Please provide doctorId, date, and time"
}
```

**400 Bad Request** - Invalid doctor ID:
```json
{
  "success": false,
  "message": "Invalid doctor ID format"
}
```

**400 Bad Request** - Past date:
```json
{
  "success": false,
  "message": "Cannot book appointment for past dates"
}
```

**400 Bad Request** - Existing pending appointment:
```json
{
  "success": false,
  "message": "You already have a pending appointment with this doctor"
}
```

**404 Not Found** - Doctor not found:
```json
{
  "success": false,
  "message": "Doctor not found"
}
```

**400 Bad Request** - Time slot conflict:
```json
{
  "success": false,
  "message": "This time slot is already booked"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "64abc123def456789",
    "date": "2026-01-15",
    "time": "10:30",
    "reason": "Regular checkup and consultation for chest pain",
    "consultationType": "offline"
  }'
```

---

### 4. Get My Appointments

Get all appointments for the authenticated user with optional status filtering.

**Endpoint**: `GET /api/appointments/patient`

**Authentication**: Required

**Query Parameters**:
- `status` (string, optional): Filter by status (`pending`, `accepted`, `completed`, `cancelled`, `missed`)

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64appt789xyz",
      "date": "2026-01-15T00:00:00.000Z",
      "time": "10:30",
      "status": "pending",
      "reason": "Regular checkup and consultation for chest pain",
      "fee": 800,
      "consultationType": "offline",
      "duration": 30,
      "notes": null,
      "prescription": null,
      "paymentStatus": "pending",
      "doctor": {
        "_id": "64abc123def456789",
        "name": "Dr. Rajesh Kumar",
        "email": "rajesh.kumar@hospital.com",
        "phone": "+91-9876543210",
        "specialization": "Cardiologist",
        "qualification": "MBBS, MD (Cardiology)",
        "fee": 800,
        "bio": "Experienced cardiologist with expertise in heart diseases."
      }
    },
    {
      "_id": "64appt456abc",
      "date": "2026-01-20T00:00:00.000Z",
      "time": "14:00",
      "status": "accepted",
      "reason": "Follow-up consultation",
      "fee": 800,
      "consultationType": "virtual",
      "duration": 30,
      "notes": "Appointment confirmed by doctor",
      "prescription": null,
      "paymentStatus": "paid",
      "doctor": {
        "_id": "64abc123def456789",
        "name": "Dr. Rajesh Kumar",
        "email": "rajesh.kumar@hospital.com",
        "phone": "+91-9876543210",
        "specialization": "Cardiologist",
        "qualification": "MBBS, MD (Cardiology)",
        "fee": 800,
        "bio": "Experienced cardiologist with expertise in heart diseases."
      },
      "virtualMeeting": {
        "meetLink": "https://meet.google.com/abc-defg-hij",
        "isHost": false
      }
    }
  ]
}
```

**Success Response** (200 OK) - No appointments:
```json
{
  "success": true,
  "message": "No appointments found",
  "data": []
}
```

**Note**: 
- Appointments are sorted by date (newest first) and time
- Past appointments with `pending` or `accepted` status are automatically updated to `missed`
- Virtual meeting link is only available for `virtual` appointments with `accepted` status

**cURL Examples**:
```bash
# Get all appointments
curl -X GET "http://localhost:5000/api/appointments/patient" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by status
curl -X GET "http://localhost:5000/api/appointments/patient?status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get completed appointments
curl -X GET "http://localhost:5000/api/appointments/patient?status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get Appointment Details

Get detailed information about a specific appointment.

**Endpoint**: `GET /api/appointments/:appointmentId`

**Authentication**: Required

**URL Parameters**:
- `appointmentId` (string, required): Appointment ID

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "64appt789xyz",
    "date": "2026-01-15T00:00:00.000Z",
    "time": "10:30",
    "status": "accepted",
    "reason": "Regular checkup and consultation for chest pain",
    "fee": 800,
    "consultationType": "virtual",
    "duration": 30,
    "notes": "Appointment confirmed. Please join 5 minutes early.",
    "prescription": null,
    "paymentStatus": "paid",
    "doctor": {
      "_id": "64abc123def456789",
      "name": "Dr. Rajesh Kumar",
      "email": "rajesh.kumar@hospital.com",
      "phone": "+91-9876543210",
      "specialization": "Cardiologist",
      "qualification": "MBBS, MD (Cardiology)",
      "fee": 800,
      "bio": "Experienced cardiologist with expertise in heart diseases and preventive cardiology."
    },
    "patient": {
      "_id": "64user456abc",
      "name": "Amit Sharma",
      "email": "amit.sharma@example.com",
      "contact": "+91-9123456789",
      "age": 35,
      "gender": "male",
      "address": {
        "street": "456 Park Avenue",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400002"
      }
    },
    "virtualMeeting": {
      "meetLink": "https://meet.google.com/abc-defg-hij",
      "isHost": false,
      "googleEventId": "event123abc"
    },
    "createdAt": "2026-01-05T10:00:00.000Z",
    "updatedAt": "2026-01-06T14:30:00.000Z"
  }
}
```

**Error Responses**:

**404 Not Found** - Appointment not found:
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/appointments/64appt789xyz" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Cancel Appointment

Cancel a pending or accepted appointment.

**Endpoint**: `PUT /api/appointments/:appointmentId/cancel`

**Authentication**: Required

**URL Parameters**:
- `appointmentId` (string, required): Appointment ID

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "_id": "64appt789xyz",
    "status": "cancelled",
    "consultationType": "offline",
    "date": "2026-01-15T00:00:00.000Z",
    "time": "10:30",
    "doctor": {
      "_id": "64abc123def456789",
      "name": "Dr. Rajesh Kumar",
      "specialization": "Cardiologist"
    },
    "updatedAt": "2026-01-05T15:30:00.000Z"
  }
}
```

**Error Responses**:

**404 Not Found** - Appointment not found:
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**400 Bad Request** - Invalid status:
```json
{
  "success": false,
  "message": "Cannot cancel an appointment that is completed"
}
```

**400 Bad Request** - Past appointment:
```json
{
  "success": false,
  "message": "Cannot cancel past appointments",
  "details": {
    "appointmentDateTime": "2026-01-03T10:30:00.000Z",
    "currentTime": "2026-01-05T15:30:00.000Z",
    "isPast": true
  }
}
```

**Validation Rules**:
- Can only cancel appointments with status `pending` or `accepted`
- Cannot cancel past appointments
- Cannot cancel appointments that are already `completed`, `cancelled`, or `missed`

**cURL Example**:
```bash
curl -X PUT "http://localhost:5000/api/appointments/64appt789xyz/cancel" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 7. Create Appointment Payment

Create a Razorpay payment order for an appointment.

**Endpoint**: `POST /api/appointments/create-payment`

**Authentication**: Required

**Request Body**:
```json
{
  "appointmentId": "64appt789xyz"
}
```

**Field Descriptions**:
- `appointmentId` (string, required): ID of the appointment to pay for

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_MNOPqrstUVWXyz",
    "amount": 80000,
    "currency": "INR",
    "appointmentId": "64appt789xyz",
    "key": "rzp_test_xxxxxxxxxx"
  }
}
```

**Note**: 
- Amount is in paise (₹800 = 80000 paise)
- Use the `orderId` and `key` to initialize Razorpay checkout on frontend
- After successful payment, verify using payment verification endpoint

**Error Responses**:

**400 Bad Request** - Missing appointment ID:
```json
{
  "success": false,
  "message": "Appointment ID is required"
}
```

**404 Not Found** - Appointment not found:
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**400 Bad Request** - Already paid:
```json
{
  "success": false,
  "message": "Payment already completed for this appointment"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/appointments/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "appointmentId": "64appt789xyz"
  }'
```

---

## Frontend Integration Examples

### React Component - Browse Doctors

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    consultationType: '',
    search: ''
  });
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage, filters]);

  const fetchDoctors = async (page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: 20,
        ...filters
      });

      const response = await axios.get(
        `http://localhost:5000/api/appointments/doctors?${params}`
      );

      if (response.data.success) {
        setDoctors(response.data.data.doctors);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div className="browse-doctors">
      <h2>Find a Doctor</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        
        <select
          value={filters.specialization}
          onChange={(e) => handleFilterChange('specialization', e.target.value)}
        >
          <option value="">All Specializations</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="General Physician">General Physician</option>
        </select>
        
        <select
          value={filters.consultationType}
          onChange={(e) => handleFilterChange('consultationType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            {doctor.profileImage && (
              <img src={doctor.profileImage} alt={doctor.name} />
            )}
            <h3>{doctor.name}</h3>
            <p className="specialization">{doctor.specialization}</p>
            <p className="qualification">{doctor.qualification}</p>
            <p className="experience">{doctor.experience}</p>
            <p className="fee">₹{doctor.fee}</p>
            <p className="consultation-type">{doctor.consultationType}</p>
            <button onClick={() => window.location.href = `/book-appointment/${doctor._id}`}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseDoctors;
```

### React Component - Book Appointment

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const BookAppointment = ({ doctorId, doctorName, doctorFee }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    consultationType: 'offline'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/appointments',
        {
          doctorId: doctorId,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
          consultationType: formData.consultationType
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        alert('Appointment booked successfully!');
        // Redirect to appointments page or payment
        window.location.href = '/my-appointments';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-appointment">
      <h2>Book Appointment with {doctorName}</h2>
      <p className="fee">Consultation Fee: ₹{doctorFee}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />
        </div>

        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Consultation Type:</label>
          <select
            name="consultationType"
            value={formData.consultationType}
            onChange={handleChange}
          >
            <option value="offline">In-Person</option>
            <option value="online">Online</option>
            <option value="virtual">Virtual (Video Call)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reason for Visit:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe your symptoms or reason for consultation..."
            rows={4}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
```

### React Component - My Appointments

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = filter
        ? `http://localhost:5000/api/appointments/patient?status=${filter}`
        : 'http://localhost:5000/api/appointments/patient';

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'orange',
      accepted: 'green',
      completed: 'blue',
      cancelled: 'red',
      missed: 'gray'
    };
    return (
      <span className={`status-badge ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>

      <div className="filters">
        <button onClick={() => setFilter('')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('accepted')}>Accepted</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('cancelled')}>Cancelled</button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.doctor.name}</h3>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="appointment-details">
                <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Type:</strong> {appointment.consultationType}</p>
                <p><strong>Fee:</strong> ₹{appointment.fee}</p>
                {appointment.reason && (
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                )}
              </div>

              {appointment.virtualMeeting && (
                <div className="virtual-meeting">
                  <a
                    href={appointment.virtualMeeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="join-meeting-btn"
                  >
                    Join Virtual Meeting
                  </a>
                </div>
              )}

              <div className="appointment-actions">
                {['pending', 'accepted'].includes(appointment.status) && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="cancel-btn"
                  >
                    Cancel Appointment
                  </button>
                )}
                <button
                  onClick={() => window.location.href = `/appointments/${appointment._id}`}
                  className="view-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
```

---

## Complete Workflow Example

### Scenario: User Books and Manages an Appointment

```javascript
// Step 1: Browse and search for doctors
const searchDoctors = async (specialization) => {
  const response = await axios.get(
    `http://localhost:5000/api/appointments/doctors?specialization=${specialization}&page=1&limit=20`
  );
  
  return response.data.data.doctors;
};

// Step 2: Check doctor availability
const checkAvailability = async (doctorId) => {
  const response = await axios.get(
    `http://localhost:5000/api/appointments/doctors/${doctorId}/availability`
  );
  
  return response.data.data;
};

// Step 3: Book appointment
const bookAppointment = async (doctorId, date, time, reason) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    'http://localhost:5000/api/appointments',
    {
      doctorId: doctorId,
      date: date,
      time: time,
      reason: reason,
      consultationType: 'offline'
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.data;
};

// Step 4: Create payment for appointment
const createPayment = async (appointmentId) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    'http://localhost:5000/api/appointments/create-payment',
    { appointmentId: appointmentId },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.data;
};

// Step 5: View my appointments
const getMyAppointments = async (status = '') => {
  const token = localStorage.getItem('token');
  const url = status
    ? `http://localhost:5000/api/appointments/patient?status=${status}`
    : 'http://localhost:5000/api/appointments/patient';
  
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return response.data.data;
};

// Step 6: Cancel appointment if needed
const cancelAppointment = async (appointmentId) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.put(
    `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
    {},
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.data;
};

// Complete workflow
const appointmentWorkflow = async () => {
  try {
    // 1. Search for cardiologists
    const doctors = await searchDoctors('Cardiologist');
    console.log('Found doctors:', doctors);
    
    // 2. Select a doctor and check availability
    const doctorId = doctors[0]._id;
    const availability = await checkAvailability(doctorId);
    console.log('Doctor availability:', availability);
    
    // 3. Book appointment
    const appointment = await bookAppointment(
      doctorId,
      '2026-01-15',
      '10:30',
      'Regular checkup'
    );
    console.log('Appointment booked:', appointment);
    
    // 4. Create payment
    const payment = await createPayment(appointment._id);
    console.log('Payment order created:', payment);
    
    // 5. View all appointments
    const myAppointments = await getMyAppointments();
    console.log('My appointments:', myAppointments);
    
    // 6. Cancel if needed (optional)
    // await cancelAppointment(appointment._id);
    
  } catch (error) {
    console.error('Error in appointment workflow:', error);
  }
};
```

---

## Summary

### User-Side Endpoints (7 APIs)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/appointments/doctors` | GET | Public | List all doctors with filters |
| `/api/appointments/doctors/:doctorId/availability` | GET | Public | Get doctor availability |
| `/api/appointments` | POST | Required | Book new appointment |
| `/api/appointments/patient` | GET | Required | Get user's appointments |
| `/api/appointments/:appointmentId` | GET | Required | Get appointment details |
| `/api/appointments/:appointmentId/cancel` | PUT | Required | Cancel appointment |
| `/api/appointments/create-payment` | POST | Required | Create payment order |

### Key Features
- 🔍 **Doctor Search**: Browse doctors with filters (specialization, consultation type, search)
- 📅 **Availability Check**: View doctor's available time slots
- 📝 **Easy Booking**: Book appointments with date, time, and reason
- 💳 **Payment Integration**: Razorpay payment for appointments
- 📱 **Virtual Meetings**: Google Meet integration for online consultations
- 🔔 **Status Tracking**: Track appointment status (pending, accepted, completed, cancelled, missed)
- ❌ **Cancellation**: Cancel appointments before they occur
- 📊 **Appointment History**: View all past and upcoming appointments

### Appointment Status Flow
1. **pending** - Appointment booked, waiting for doctor confirmation
2. **accepted** - Doctor confirmed the appointment
3. **completed** - Appointment finished successfully
4. **cancelled** - Appointment cancelled by patient or doctor
5. **missed** - Appointment time passed without completion

### Consultation Types
- **offline** - In-person consultation at clinic/hospital
- **online** - Online consultation (chat/phone)
- **virtual** - Video consultation via Google Meet

### Business Rules
1. Cannot book appointments for past dates
2. Cannot have multiple pending appointments with same doctor
3. Time slots must not conflict with existing appointments
4. Can only cancel pending or accepted appointments
5. Cannot cancel past appointments
6. Virtual meeting links generated only after doctor accepts
7. Missed appointments auto-updated when time passes
8. Default appointment duration is 30 minutes
9. Payment required before appointment confirmation

---

**Last Updated**: January 2026
**Version**: 1.0
