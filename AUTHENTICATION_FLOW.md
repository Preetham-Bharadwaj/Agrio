# Agrio Authentication & Onboarding Flow

## Overview

The Agrio platform uses a unified authentication system that automatically detects whether a user is new or returning, and routes them accordingly.

## User Journey

### Landing Page (`/[locale]/page.tsx`)

Users arrive at the landing page and see two options:
- **"Sign In"** button (for returning users)
- **"Get Started"** button (for new users)

**Both buttons lead to the same authentication page** - the system automatically detects if the user is new or returning after OTP verification.

---

## Authentication Flow

### Step 1: Phone Number Entry (`/[locale]/onboard/auth`)

**Component**: `OTPAuthForm`

1. User enters their 10-digit Indian mobile number (+91)
2. System validates the phone number format
3. System sends OTP via Supabase Auth (using Twilio/MSG91)
4. User proceeds to OTP verification

**Validation**:
- Must be exactly 10 digits
- Indian phone number format
- Rate limiting: Max 3 attempts per 15 minutes

---

### Step 2: OTP Verification (`/[locale]/onboard/auth`)

**Component**: `OTPVerificationForm`

1. User enters 6-digit OTP received via SMS
2. System verifies OTP with Supabase Auth
3. **System checks if user profile exists in database**

**Two Paths**:

#### Path A: New User (No Profile Found)
```
OTP Verified → No profile in database → Redirect to Role Selection
```
- User is redirected to `/[locale]/onboard/register`
- Proceeds with onboarding flow (Steps 3-5)

#### Path B: Returning User (Profile Found)
```
OTP Verified → Profile exists → Redirect to Dashboard
```
- User is redirected to `/[locale]/dashboard/{role}`
- Goes directly to their role-specific dashboard
- No need to re-enter profile information

**Verification Rules**:
- 3 failed attempts → Account locked for 15 minutes
- OTP expires after 10 minutes
- Resend OTP available after 30 seconds

---

## Onboarding Flow (New Users Only)

### Step 3: Role Selection (`/[locale]/onboard/register`)

**Component**: `RoleSelector`

User selects their role:
- 🌾 **Farmer** - Grow and sell agricultural produce
- 🏪 **Retailer** - Buy produce in bulk for resale
- 🛒 **Consumer** - Buy fresh produce for personal use

**Important**: Role cannot be changed after selection

**Database Action**:
- Updates `users.account_type` field
- Sets role to 'farmer', 'retailer', or 'consumer'

---

### Step 4: Profile Collection (`/[locale]/onboard/account`)

**Component**: `ProfileCollectionForm`

User provides basic information:
- Full Name (minimum 2 characters)
- Address (required)
- State (dropdown selection)
- District (dropdown selection, filtered by state)

**Validation**:
- All fields are required
- Name must be at least 2 characters
- State must be selected before district

**Database Action**:
- Updates `users` table with profile information
- Stores name, address, state, district

**Internationalization**:
- Supports English and Hindi input
- Uses next-intl for translations

---

### Step 5: Document Verification (`/[locale]/onboard/verification`)

**Component**: `DocumentUpload`

**Role-Based Requirements**:

#### For Farmers:
Required documents:
1. Aadhaar Card or Government ID
2. Farm location or land proof
3. Bank account details

#### For Retailers:
Required documents:
1. Aadhaar Card or Business ID
2. Shop registration or GST (optional)
3. Bank account details

#### For Consumers:
**No verification required** - automatically verified and redirected to dashboard

**Upload Process**:
1. User uploads document (drag-and-drop or file browser)
2. System validates file type (JPEG, PNG, PDF only)
3. System validates file size (max 5MB)
4. File is uploaded to Supabase Storage with encryption
5. `users.verification_status` set to "pending"

**Verification Timeline**:
- Documents reviewed within 24-48 hours
- User receives notification when verified
- User can access dashboard immediately (with limited features until verified)

---

### Step 6: Completion & Dashboard Redirect

After completing all steps:
- User is redirected to their role-specific dashboard
- Dashboard URL: `/[locale]/dashboard/{role}`
  - Farmers: `/[locale]/dashboard/farmer`
  - Retailers: `/[locale]/dashboard/retailer`
  - Consumers: `/[locale]/dashboard/consumer`

---

## Role-Based Access Control

### Middleware Protection (`middleware.ts`)

The middleware enforces role-based access:

1. **Unauthenticated users** accessing `/dashboard/*` → Redirect to `/onboard/auth`
2. **Authenticated users** without profile → Redirect to `/onboard/register`
3. **Authenticated users** accessing wrong role dashboard → Redirect to correct dashboard
4. **Main dashboard** (`/dashboard`) → Redirect to role-specific dashboard

### Example Scenarios:

**Scenario 1: Farmer tries to access Retailer dashboard**
```
User role: farmer
Attempts to access: /dashboard/retailer
Result: Redirected to /dashboard/farmer
```

**Scenario 2: Consumer accesses main dashboard**
```
User role: consumer
Attempts to access: /dashboard
Result: Redirected to /dashboard/consumer
```

---

## Database Schema

### Users Table

```sql
users (
  id UUID PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  account_type TEXT CHECK (account_type IN ('farmer', 'retailer', 'consumer')),
  name TEXT,
  address TEXT,
  district TEXT,
  state TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Row Level Security (RLS)

- Users can only read/update their own profile
- Verification status can only be updated by admins
- Role cannot be changed after initial selection

---

## Session Management

### Session Duration
- Sessions last 30 days of inactivity
- Automatic session refresh on user activity
- Session stored in Supabase Auth

### Session Expiry
- User redirected to `/onboard/auth` when session expires
- User must re-authenticate with OTP
- Profile data is preserved (no need to re-enter)

---

## Security Features

### OTP Security
- 6-digit random OTP
- Expires after 10 minutes
- Max 3 verification attempts
- Account locked for 15 minutes after 3 failed attempts
- Rate limiting on OTP requests

### Data Security
- All API routes use HTTPS
- Authentication tokens encrypted by Supabase
- Document uploads encrypted in Supabase Storage
- Row Level Security on all database tables
- CSRF protection on forms

### Suspicious Activity Detection
- Multiple failed login attempts tracked
- Account lockout after threshold
- Admin notification for suspicious patterns

---

## User Experience Enhancements

### Automatic Detection
- System automatically detects new vs returning users
- No need for separate "Sign Up" and "Sign In" flows
- Seamless experience for both user types

### Progress Persistence
- Onboarding progress saved at each step
- Users can resume if they close the app
- No data loss during onboarding

### Internationalization
- Full support for English and Hindi
- Language preference saved to user profile
- Can switch language at any time

### Mobile-First Design
- Optimized for mobile devices
- Touch-friendly interface
- Responsive layouts

---

## Testing Checklist

### New User Flow
- [ ] Enter phone number
- [ ] Receive OTP via SMS
- [ ] Verify OTP successfully
- [ ] Select role (Farmer/Retailer/Consumer)
- [ ] Enter profile information
- [ ] Upload verification documents (if Farmer/Retailer)
- [ ] Redirected to role-specific dashboard

### Returning User Flow
- [ ] Enter phone number
- [ ] Receive OTP via SMS
- [ ] Verify OTP successfully
- [ ] Automatically redirected to dashboard
- [ ] No need to re-enter profile information

### Error Handling
- [ ] Invalid phone number format
- [ ] OTP send failure
- [ ] Invalid OTP entry
- [ ] Account lockout after 3 failed attempts
- [ ] File upload validation (type, size)
- [ ] Network error handling

### Security Testing
- [ ] Session expiry after 30 days
- [ ] Role-based access control
- [ ] Unauthorized dashboard access blocked
- [ ] Document upload encryption
- [ ] CSRF protection

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SMS Provider (Twilio or MSG91)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

---

## Next Steps

1. Configure Supabase Auth with SMS provider
2. Set up Twilio/MSG91 account for Indian numbers
3. Test OTP delivery end-to-end
4. Populate state/district data in database
5. Set up admin panel for document verification

---

**Status**: ✅ Fully Implemented  
**Last Updated**: March 14, 2026
