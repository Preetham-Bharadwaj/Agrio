# Design Document: Role-Based Marketplace

## Overview

This design document specifies the technical architecture for enhancing the existing Agrio Next.js application with comprehensive role-based marketplace functionality. The system will support three distinct user roles (Farmer, Retailer, Consumer) with completely isolated user interfaces, authentication flows, and feature sets.

### Current State

The Agrio application currently has:
- Basic Next.js 16 App Router structure with TypeScript
- Supabase integration for data persistence
- next-intl i18n support (English, Hindi, and 4 additional Indian languages)
- Basic dashboard with role-switching capability (client-side only)
- Onboarding flow with phone authentication placeholder
- PWA configuration enabled
- Zustand state management for user data
- shadcn/ui component library

### Enhancement Goals

This design focuses on:
1. Implementing OTP-based authentication with Supabase Auth
2. Adding role selection during onboarding with persistence
3. Restructuring dashboard routing for role-based access control
4. Designing database schema enhancements in Supabase
5. Creating role-specific component architecture
6. Implementing Razorpay payment integration
7. Designing real-time auction system with WebSocket support
8. Integrating AI chatbot functionality (Sarkari Saathi for Farmers, Support Bot for Consumers)

### Key Constraints

- Must preserve existing i18n configuration and locale routing
- Must maintain current Supabase client setup
- Must use existing Zustand store patterns
- Must follow Next.js App Router conventions
- Must ensure complete UI isolation between roles
- Must implement proper Row Level Security (RLS) in Supabase


## Architecture

### System Architecture

The enhanced Agrio application follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Farmer UI  │  │ Retailer UI  │  │ Consumer UI  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js App Router (Middleware)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Locale Routing + Auth Guard + Role-Based Access    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Server      │   │  API Routes  │   │  Server      │
│  Components  │   │  & Actions   │   │  Actions     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Supabase │  │ Razorpay │  │ WebSocket│  │ AI Chat  │   │
│  │ Database │  │ Payments │  │  Server  │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User enters phone → Send OTP (Supabase Auth) → Verify OTP
                                                      │
                                                      ▼
                                            New User? ─┬─ Yes → Role Selection
                                                       │         │
                                                       │         ▼
                                                       │    Profile Collection
                                                       │         │
                                                       │         ▼
                                                       │    Document Upload
                                                       │    (Farmer/Retailer)
                                                       │         │
                                                       └─ No ───┴→ Role-Based Dashboard
```

### Role-Based Routing Strategy

The application uses Next.js middleware to enforce role-based access:

1. **Middleware Chain**: `i18n → Auth Check → Role Verification → Route Access`
2. **Route Structure**:
   - `/[locale]/dashboard` - Role detection and redirect
   - `/[locale]/dashboard/farmer/*` - Farmer-only routes
   - `/[locale]/dashboard/retailer/*` - Retailer-only routes
   - `/[locale]/dashboard/consumer/*` - Consumer-only routes
3. **Access Control**: Server-side role verification on every protected route
4. **Fallback**: Unauthorized access redirects to role-specific dashboard


## Components and Interfaces

### Authentication Components

#### OTPAuthForm Component
**Location**: `src/components/auth/OTPAuthForm.tsx`

**Purpose**: Handles phone number input and OTP sending

**Interface**:
```typescript
interface OTPAuthFormProps {
  onOTPSent: (phoneNumber: string) => void;
  locale: string;
}
```

**Key Methods**:
- `sendOTP(phoneNumber: string)`: Calls Supabase Auth to send OTP
- `validatePhoneNumber(phone: string)`: Validates Indian phone format

#### OTPVerificationForm Component
**Location**: `src/components/auth/OTPVerificationForm.tsx`

**Purpose**: Handles OTP verification and session creation

**Interface**:
```typescript
interface OTPVerificationFormProps {
  phoneNumber: string;
  onVerified: (userId: string) => void;
  onResend: () => void;
}
```

**Key Methods**:
- `verifyOTP(otp: string)`: Verifies OTP with Supabase Auth
- `handleResend()`: Resends OTP with rate limiting


### Onboarding Components

#### RoleSelector Component
**Location**: `src/components/onboard/RoleSelector.tsx`

**Purpose**: Allows user to select their role (Farmer/Retailer/Consumer)

**Interface**:
```typescript
interface RoleSelectorProps {
  onRoleSelected: (role: 'farmer' | 'retailer' | 'consumer') => void;
}
```

#### DocumentUpload Component
**Location**: `src/components/onboard/DocumentUpload.tsx`

**Purpose**: Handles verification document upload for Farmers and Retailers

**Interface**:
```typescript
interface DocumentUploadProps {
  userId: string;
  role: 'farmer' | 'retailer';
  onUploadComplete: (documentUrl: string) => void;
}
```

**Key Methods**:
- `uploadToSupabase(file: File)`: Uploads to Supabase Storage
- `validateFileType(file: File)`: Ensures JPEG/PNG/PDF format
- `validateFileSize(file: File)`: Ensures max 5MB


### Farmer Dashboard Components

#### ProduceListingForm Component
**Location**: `src/components/farmer/ProduceListingForm.tsx`

**Purpose**: Create new produce listings

**Interface**:
```typescript
interface ProduceListingFormProps {
  farmerId: string;
  onListingCreated: (listingId: string) => void;
}

interface ListingFormData {
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  health_grade: 'A' | 'B' | 'C';
  photo?: File;
}
```

#### AuctionViewer Component
**Location**: `src/components/farmer/AuctionViewer.tsx`

**Purpose**: Display live auctions with real-time bid updates

**Interface**:
```typescript
interface AuctionViewerProps {
  farmerId: string;
  onAcceptBid: (auctionId: string, bidAmount: number) => void;
}
```

**Key Features**:
- WebSocket connection for real-time bid updates
- Highlights auctions containing farmer's listings
- Shows anonymized bidder information


#### MarketRatesDisplay Component
**Location**: `src/components/farmer/MarketRatesDisplay.tsx`

**Purpose**: Show APMC rates with trends and recommendations

**Interface**:
```typescript
interface MarketRatesDisplayProps {
  district: string;
  state: string;
}

interface MarketRate {
  crop: string;
  price_per_kg: number;
  trend_pct: number;
  forecast_signal: 'hold' | 'sell' | 'urgent_sell';
}
```

#### SarkariSaathiChat Component
**Location**: `src/components/farmer/SarkariSaathiChat.tsx`

**Purpose**: AI chatbot for government schemes and farming queries

**Interface**:
```typescript
interface SarkariSaathiChatProps {
  userId: string;
  locale: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

**Key Features**:
- Maintains conversation history in session
- Supports English and Hindi
- Provides scheme information based on user profile


### Retailer Dashboard Components

#### AuctionBiddingInterface Component
**Location**: `src/components/retailer/AuctionBiddingInterface.tsx`

**Purpose**: Participate in live auctions and place bids

**Interface**:
```typescript
interface AuctionBiddingInterfaceProps {
  retailerId: string;
  onBidPlaced: (auctionId: string, amount: number) => void;
}
```

**Key Features**:
- Real-time auction updates via WebSocket
- Bid validation (minimum 1% above current bid)
- Winning notification system

#### BulkProcurementBrowser Component
**Location**: `src/components/retailer/BulkProcurementBrowser.tsx`

**Purpose**: Browse and purchase bulk produce listings

**Interface**:
```typescript
interface BulkProcurementBrowserProps {
  retailerId: string;
  onPurchase: (listingId: string, quantity: number) => void;
}

interface BulkListing {
  id: string;
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  health_grade: string;
  farmer_location: string;
}
```


#### PriceAnalyticsDashboard Component
**Location**: `src/components/retailer/PriceAnalyticsDashboard.tsx`

**Purpose**: Display price trends and analytics for procurement decisions

**Interface**:
```typescript
interface PriceAnalyticsDashboardProps {
  state: string;
  onPriceAlert: (crop: string, threshold: number) => void;
}
```

**Key Features**:
- 30-day price trend charts
- Multi-district price comparison
- Custom price alert configuration
- Seasonal pattern visualization

#### ContractFarmingManager Component
**Location**: `src/components/retailer/ContractFarmingManager.tsx`

**Purpose**: Create and manage contract farming agreements

**Interface**:
```typescript
interface ContractFarmingManagerProps {
  retailerId: string;
  onContractCreated: (contractId: string) => void;
}

interface ContractRequest {
  crop: string;
  quantity_kg: number;
  delivery_date: Date;
  district: string;
  advance_payment_pct: number;
}
```


### Consumer Dashboard Components

#### ProduceBrowser Component
**Location**: `src/components/consumer/ProduceBrowser.tsx`

**Purpose**: Browse and filter produce from Farmers and Retailers

**Interface**:
```typescript
interface ProduceBrowserProps {
  onAddToCart: (listingId: string, quantity: number) => void;
}

interface ProduceListing {
  id: string;
  crop: string;
  price_per_kg: number;
  health_grade: string;
  seller_type: 'farmer' | 'retailer';
  seller_location: string;
  photo_url?: string;
}
```

**Key Features**:
- Filter by crop type, price range, health grade
- Display seller type badge
- Add to cart functionality

#### ShoppingCart Component
**Location**: `src/components/consumer/ShoppingCart.tsx`

**Purpose**: Manage cart items and proceed to checkout

**Interface**:
```typescript
interface ShoppingCartProps {
  userId: string;
  onCheckout: (items: CartItem[]) => void;
}

interface CartItem {
  listing_id: string;
  quantity: number;
  seller_id: string;
  price_per_kg: number;
}
```


#### RazorpayCheckout Component
**Location**: `src/components/consumer/RazorpayCheckout.tsx`

**Purpose**: Handle payment processing via Razorpay

**Interface**:
```typescript
interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: string) => void;
}
```

**Key Features**:
- Razorpay SDK integration
- Support for UPI, cards, net banking
- Payment verification callback
- Error handling and retry mechanism

#### OrderTracker Component
**Location**: `src/components/consumer/OrderTracker.tsx`

**Purpose**: Track order status and delivery

**Interface**:
```typescript
interface OrderTrackerProps {
  userId: string;
}

interface Order {
  id: string;
  status: 'placed' | 'packed' | 'dispatched' | 'delivered';
  items: OrderItem[];
  estimated_delivery: Date;
  payment_status: string;
}
```

