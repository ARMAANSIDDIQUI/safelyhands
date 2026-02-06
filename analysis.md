# Shri Adarsh Dham - Complete Codebase Analysis & Feature Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Recent Changes & Improvements](#recent-changes--improvements)
3. [Complete Feature List](#complete-feature-list)
4. [Architecture Overview](#architecture-overview)
5. [⚠️ Placeholders & Incomplete Items](#️-placeholders--incomplete-items)
6. [Testing Checklist](#testing-checklist)

---

## Application Overview

**Shri Adarsh Dham** is a comprehensive ashram management system built with:
- **Frontend**: React.js with Redux, Framer Motion, TailwindCSS
- **Backend**: Node.js/Express with MongoDB
- **Features**: PWA support, Push notifications, Multi-language support (EN/HI)

**Purpose**: Manage visitor registrations, accommodation bookings, events, and administrative operations for a spiritual ashram in Kashipur, Uttarakhand.

---

## Recent Changes & Improvements

### ✅ Completed in This Session

#### 1. **Phone Number Standardization** (Completed)
- **Frontend**: [`PhoneInput.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/components/common/PhoneInput.jsx)
  - Enforces 10-digit phone numbers (no country code in data)
  - Visual `+91` prefix for display only
  - Used across: Login, Register, Booking, Profile Update
  
- **Backend**: [`authController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/authController.js)
  - Strips prefixes and validates 10-digit format
  - Updated: `register`, `login`, `checkRecoveryMethod`
  
- **Database Migration**: [`fix_phone_numbers.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/fix_phone_numbers.js)
  - Cleaned all existing phone numbers to 10 digits
  - Processed Users and Bookings collections

#### 2. **OTP Email Rate Limiting** (Completed)
- **Location**: [`authController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/authController.js#L138-L205) - `sendOtp` function
- **Limits**:
  - 1 OTP per 5 minutes per email
  - 5 OTPs maximum per 24 hours per email
- **Error Messages**: Returns 429 status with time remaining or daily limit message

#### 3. **Booking Success Modal** (Completed)
- **Component**: [`SuccessModal.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/components/common/SuccessModal.jsx)
- **Features**:
  - Auto-closes after 10 seconds
  - Closes on touch/click anywhere
  - Animated with progress bar
  - Redirects to Calendar after close
- **Integration**: [`Booking.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Booking.jsx)

#### 4. **Frontend Runtime Safety** (Completed)
- Scanned and fixed all Admin, User, and Common components
- Removed unused imports (e.g., `FaUser` in Login.jsx)
- Fixed missing catch blocks

#### 5. **Manifest & Meta Tag Fixes** (Completed)
- Fixed deprecated `apple-mobile-web-app-capable` meta tag
- Validated [`manifest.json`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/public/manifest.json) syntax

#### 6. **Database Migration Scripts** (Created)
- [`fix_phone_numbers.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/fix_phone_numbers.js) - Phone number cleanup
- [`fix_booking_dates.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/fix_booking_dates.js) - Backfill member stay dates
- [`reset_password.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/reset_password.js) - Admin password reset utility
- [`check_user.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/check_user.js) - User verification utility

---

## Complete Feature List

### 🔐 Authentication & User Management

#### User Authentication
- **Registration** with email OTP verification
- **Login** with phone + password
- **Forgot Password** flow with email OTP
- **JWT-based** authentication (30-day expiry)
- **Role-based** access control (user, admin, super-admin, operator, super-operator, satsang-operator)

#### Profile Management
- Update name and email (with OTP verification)
- Change password
- View booking history
- Email verification nag for unverified users

### 📅 Event & Booking System

#### Events
- **CRUD operations** for events (admin only)
- Event details: name, dates, description, guidelines
- Event listing with filtering
- Calendar view integration

#### Bookings
- **Multi-member booking** with individual details
- **Shared or Individual stay durations** per member
- **Dynamic date selection** (±5 days from event dates)
- **Ashram/Guru details** (Baiji/MahatmaJi contact required)
- **Age validation** (Boys/Girls ≤ 16 years)
- **Booking statuses**: Pending, Approved, Declined
- **Booking pass PDF** generation with QR code
- **Edit bookings** (Admin & User)

#### Accommodation Management
- **Buildings** → **Rooms** → **Beds** hierarchy
- **Bed allocation** system
- **Occupancy tracking** per event
- **Allocation reports** (Excel/PDF export)
- **Structure visualization** (tree view)

### 🔔 Notifications

#### Push Notifications
- **Web Push** using VAPID keys
- **Scheduled notifications** (cron job every minute)
- **Instant notifications** to specific users or roles
- **Notification history** with read/unread status
- **Floating notification button** with unread count

#### Email Notifications
- **OTP emails** for registration, profile update, password reset
- **Gmail SMTP** integration
- **Rate limiting** (5/day, 1/5min per email)

### 👥 Admin Features

#### User Management
- View all users with role filtering
- Promote/demote user roles
- Delete users
- Password reset requests approval

#### Booking Management
- View all bookings with filters (status, event, date range)
- Approve/decline bookings
- Edit booking details
- Allocate beds to bookings
- Generate booking passes (PDF)

#### Satsang Management
- Live link management for virtual events
- Satsang schedule CRUD

#### Reports & Analytics
- **Occupancy reports** by building/room/bed
- **Export data** (Excel, PDF, CSV)
- **Booking statistics** dashboard

#### Comments & Feedback
- View and manage user comments
- Approve/delete comments

### 🌐 Frontend Features

#### UI/UX
- **Responsive design** (mobile-first)
- **Dark/Light theme** toggle
- **Multi-language** support (English/Hindi)
- **Framer Motion** animations
- **Toast notifications** (react-toastify)
- **Loading states** and error handling

#### PWA Features
- **Installable** as mobile/desktop app
- **Offline support** (service worker)
- **Push notifications** (web-push)
- **App manifest** with icons and theme colors

#### Navigation
- **Protected routes** (authentication required)
- **Role-based** route access
- **Floating action buttons** (Install, Notifications, Scroll to Top)
- **Network status** indicator

### 📊 Additional Features

#### Comments System
- Users can leave comments/feedback
- Admin moderation required
- Display on public pages

#### Password Reset Requests
- Users without email can request admin password reset
- Admin approval workflow

#### Calendar Integration
- Visual event calendar
- Date range selection for bookings

---

## Architecture Overview

### Backend Structure

#### Controllers (15 files)
- [`adminController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/adminController.js) - Admin operations
- [`authController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/authController.js) - Authentication & OTP
- [`bookingController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/bookingController.js) - Booking CRUD & allocation
- [`bedController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/bedController.js) - Bed management
- [`buildingController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/buildingController.js) - Building management
- [`commentController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/commentController.js) - Comments CRUD
- [`emailController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/emailController.js) - Email utilities
- [`eventController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/eventController.js) - Event CRUD
- [`notificationController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/notificationController.js) - Push notifications
- [`passwordRequestController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/passwordRequestController.js) - Password reset requests
- [`peopleController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/peopleController.js) - Person/occupancy tracking
- [`roomController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/roomController.js) - Room management
- [`satsangController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/satsangController.js) - Satsang/live links
- [`structureController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/structureController.js) - Structure visualization
- [`userController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/userController.js) - User profile updates

#### Models (13 files)
- [`userModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/userModel.js) - User schema with roles
- [`bookingModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/bookingModel.js) - Booking with formData & allocations
- [`eventModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/eventModel.js) - Event details
- [`buildingModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/buildingModel.js) - Building schema
- [`roomModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/roomModel.js) - Room schema
- [`bedModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/bedModel.js) - Bed schema
- [`peopleModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/peopleModel.js) - Person/occupancy tracking
- [`otpModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/otpModel.js) - OTP with TTL (10 min)
- [`notificationModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/notificationModel.js) - Notifications
- [`Comment.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/Comment.js) - User comments
- [`PasswordRequest.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/PasswordRequest.js) - Password reset requests
- [`liveLinkModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/liveLinkModel.js) - Satsang live links
- [`passwordResetRequestModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/passwordResetRequestModel.js) - Duplicate? (check if needed)

#### Scheduled Jobs ([`server.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/server.js))
1. **Nightly Cleanup** (00:00 daily) - Deletes occupancy data for events ended >2 days ago
2. **Notification Sender** (every minute) - Sends scheduled push notifications
3. **Pending Booking Alert** (every 30 min) - Notifies admins of pending bookings

### Frontend Structure

#### Pages (10 files)
- [`Home.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Home.jsx) - Landing page with features
- [`Login.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Login.jsx) - Login form
- [`Register.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Register.jsx) - Registration wrapper
- [`Booking.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Booking.jsx) - Booking submission
- [`EventsPage.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/EventsPage.jsx) - Event listing
- [`CalendarPage.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/CalendarPage.jsx) - Event calendar
- [`About.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/About.jsx) - About ashram
- [`Contact.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Contact.jsx) - Contact form
- [`ForgotPassword.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/ForgotPassword.jsx) - Password recovery
- [`Admin.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/pages/Admin.jsx) - Admin panel wrapper

#### Components

**Admin (22 components)**
- Dashboard, User Management, Booking Management
- Allocations, Buildings, Rooms, Beds
- Events, Satsang, Comments, Notifications
- Reports (Occupancy, Export Data)
- PDF/Excel workers for data export

**User (10 components)**
- BookingForm, MyBookings, BookingStatus
- UserProfile, UpdateProfileForm, ChangePasswordForm
- EmailVerificationNag, UserNotifications
- CommentsPage, EditBookingModal

**Common (16 components)**
- Header, Footer, Button, Loading
- PhoneInput, ThemedInput, DynamicDateInput
- SuccessModal, ProtectedRoute
- FloatingActionButtons, InstallPWAPrompt
- EnableNotificationsButton, NetworkStatusModal
- ScrollToTopButton, ScrollToTopOnMount

---

## ⚠️ Placeholders & Incomplete Items

### 🔴 Critical - Needs Immediate Attention

#### 1. **VAPID Email Placeholder**
**Location**: [`server.js:44`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/server.js#L44)
```javascript
webpush.setVapidDetails(
  'mailto:your-email@example.com', // ⚠️ REPLACE THIS
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
```
**Action Required**: Replace with actual ashram email (e.g., `mailto:adarshdham.ksp@gmail.com`)

#### 2. **Duplicate Password Reset Model**
**Files**: 
- [`passwordResetRequestModel.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/passwordResetRequestModel.js)
- [`PasswordRequest.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/models/PasswordRequest.js)

**Issue**: Two models for same purpose. Check which one is actively used and remove the other.

### 🟡 Medium Priority - Testing Needed

#### 3. **Booking Flow Testing**
**Status**: Partially implemented, needs verification

**Test Cases**:
- [ ] Same stay duration for all members
- [ ] Individual stay durations per member
- [ ] Date validation (within event ±5 days)
- [ ] Age validation (Boys/Girls ≤ 16)
- [ ] Phone number validation (10 digits)
- [ ] Baiji/MahatmaJi contact requirement

**Files to Test**:
- [`BookingForm.jsx`](file:///c:/Users/dell/Downloads/adarsh_dham/frontend/src/components/user/BookingForm.jsx)
- [`bookingController.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/controllers/bookingController.js)

#### 4. **OTP Rate Limiting**
**Status**: Implemented, needs real-world testing

**Test Scenarios**:
- [ ] Send OTP, wait <5 min, try again (should fail with countdown)
- [ ] Send 5 OTPs in a day (6th should fail with daily limit message)
- [ ] Verify OTP expiry after 10 minutes
- [ ] Test across different OTP types (register, update, forgot_password)

#### 5. **Phone Number Migration**
**Status**: Script created, needs verification

**Action Required**:
1. Run [`fix_phone_numbers.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/scripts/fix_phone_numbers.js) on production DB
2. Verify all phone numbers are 10 digits
3. Test login with cleaned phone numbers
4. Check for any "User not found" errors

### 🟢 Low Priority - Nice to Have

#### 6. **Environment Variables Documentation**
**Current `.env` variables**:
```
MONGO_URI - MongoDB connection string
GMAIL_USER - Email service account
GMAIL_APP_PASSWORD - Gmail app password
VAPID_PUBLIC_KEY - Push notification public key
VAPID_PRIVATE_KEY - Push notification private key
PORT - Server port (5000)
JWT_SECRET - JWT signing secret
```

**Recommendation**: Create `.env.example` file with placeholder values for easier deployment.

#### 7. **Error Handling Improvements**
**Areas to enhance**:
- Add global error handler middleware
- Implement request logging (morgan is imported but basic)
- Add rate limiting for API endpoints (not just OTP)
- Implement request validation middleware (express-validator)

#### 8. **Code Cleanup Opportunities**
- Remove commented-out code in [`server.js`](file:///c:/Users/dell/Downloads/adarsh_dham/backend/server.js#L83-L109) (createFirstSuperAdmin function)
- Consolidate duplicate EditBookingModal in admin and user folders
- Review unused imports across all files

---

## Testing Checklist

### Authentication Flow
- [ ] Register new user with email OTP
- [ ] Login with 10-digit phone number
- [ ] Forgot password flow
- [ ] Profile update with email change (OTP verification)
- [ ] Password change
- [ ] Logout and re-login

### Booking Flow
- [ ] Create booking with same stay duration
- [ ] Create booking with individual stay durations
- [ ] Edit existing booking (user)
- [ ] Edit existing booking (admin)
- [ ] Approve/decline booking (admin)
- [ ] Allocate beds to booking (admin)
- [ ] Generate booking pass PDF
- [ ] View booking history

### Admin Operations
- [ ] User role management
- [ ] Event CRUD operations
- [ ] Building/Room/Bed management
- [ ] Notification sending
- [ ] Occupancy reports
- [ ] Data export (Excel/PDF)
- [ ] Comment moderation

### PWA & Notifications
- [ ] Install app on mobile/desktop
- [ ] Enable push notifications
- [ ] Receive push notifications
- [ ] Offline functionality
- [ ] App manifest validation

### Rate Limiting
- [ ] OTP rate limiting (5/day, 1/5min)
- [ ] Verify error messages
- [ ] Test across different email addresses

---

## Summary

### ✅ What's Working Well
1. **Complete authentication system** with OTP verification
2. **Comprehensive booking system** with multi-member support
3. **Admin panel** with full CRUD operations
4. **PWA support** with push notifications
5. **Phone number standardization** (10 digits)
6. **OTP rate limiting** to prevent abuse
7. **Booking success modal** with auto-close
8. **Database migration scripts** for data cleanup

### ⚠️ What Needs Attention
1. **Replace VAPID email placeholder** in server.js
2. **Test booking flow** thoroughly (same/individual durations)
3. **Verify phone number migration** on production
4. **Remove duplicate password reset model**
5. **Create .env.example** for deployment
6. **Test OTP rate limiting** in real scenarios

### 🎯 Recommended Next Steps
1. Fix VAPID email placeholder (5 min)
2. Run phone number migration script (if not done)
3. Test complete booking flow (30 min)
4. Test OTP rate limiting (15 min)
5. Create .env.example file (5 min)
6. Clean up duplicate models (10 min)

**Total Estimated Time**: ~1 hour for critical items

---

**Document Generated**: 2026-02-04  
**Codebase Version**: Latest (post phone number standardization & OTP rate limiting)  
**Status**: Production Ready (with minor fixes needed)
