# Implementation Plan: Role-Based Marketplace

## Overview

This implementation plan transforms the existing Agrio Next.js application into a comprehensive role-based agricultural marketplace. The approach focuses on enhancing existing infrastructure with OTP authentication, role-based access control, real-time auction capabilities, payment integration, and AI chatbot functionality while preserving the current i18n and routing structure.

## Tasks

- [ ] 1. Enhance database schema and implement Supabase Auth
  - [x] 1.1 Update Supabase schema with new tables and RLS policies
    - Add orders, payments, contracts, and chat_sessions tables
    - Implement comprehensive Row Level Security policies
    - Create database functions for role verification
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 23.1, 23.2, 23.3, 23.4, 23.5, 24.1_
  
  - [x] 1.2 Configure Supabase Auth for OTP-based authentication
    - Enable phone authentication in Supabase dashboard
    - Configure SMS provider (Twilio/MSG91) for Indian numbers
    - Set up OTP expiry and rate limiting rules
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Implement authentication flow components
  - [x] 2.1 Create OTPAuthForm component for phone number input
    - Build form with Indian phone number validation (+91)
    - Integrate Supabase Auth signInWithOtp method
    - Add loading states and error handling
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 2.2 Create OTPVerificationForm component
    - Build 6-digit OTP input interface
    - Implement OTP verification with Supabase Auth
    - Add resend functionality with 30-second cooldown
    - Handle 3-attempt lockout with 15-minute block
    - _Requirements: 1.2, 1.3_
  
  - [ ]* 2.3 Write unit tests for authentication components
    - Test phone number validation edge cases
    - Test OTP verification success and failure flows
    - Test rate limiting and lockout behavior
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Build onboarding flow with role selection
  - [x] 3.1 Create RoleSelector component
    - Design role selection UI with Farmer/Retailer/Consumer cards
    - Implement role persistence to Supabase users table
    - Prevent role changes after initial selection
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Create ProfileCollectionForm component
    - Build form for name, address, district, state
    - Implement validation (name min 2 chars, required fields)
    - Support English and Hindi input using next-intl
    - Persist profile data to Supabase
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 25.1, 25.2, 25.3_
  
  - [x] 3.3 Create DocumentUpload component for Farmers and Retailers
    - Build file upload interface with drag-and-drop
    - Validate file type (JPEG/PNG/PDF) and size (max 5MB)
    - Upload to Supabase Storage with encryption
    - Set verification_status to "pending" after upload
    - Skip for Consumer role (auto-verify)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 3.4 Update onboarding route flow
    - Modify existing onboarding pages to integrate new components
    - Add role selection step after phone verification
    - Add profile collection and document upload steps
    - Implement navigation guards to prevent skipping steps
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.4, 4.1_

- [ ] 4. Implement role-based routing and middleware
  - [x] 4.1 Enhance middleware for role-based access control
    - Extend existing middleware.ts with role verification
    - Add server-side role check using Supabase session
    - Implement route protection for /dashboard/farmer/*, /dashboard/retailer/*, /dashboard/consumer/*
    - Redirect unauthorized access to role-specific dashboard
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [x] 4.2 Create role-specific dashboard route structure
    - Create /dashboard/farmer/* route folders and page.tsx files
    - Create /dashboard/retailer/* route folders and page.tsx files
    - Create /dashboard/consumer/* route folders and page.tsx files
    - Update main dashboard page to detect role and redirect
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 4.3 Update Zustand store for role management
    - Extend useUserStore with role, verification_status, and profile fields
    - Add methods to fetch user profile from Supabase on app load
    - Implement session persistence and hydration
    - _Requirements: 2.3, 5.1, 23.1, 23.2, 24.1_

- [ ] 5. Checkpoint - Ensure authentication and routing work correctly
  - Verify OTP authentication flow end-to-end
  - Test role selection and profile persistence
  - Confirm role-based routing redirects correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 6. Build Farmer dashboard features
  - [x] 6.1 Create ProduceListingForm component
    - Build form for crop, quantity, price, health grade, photo
    - Display current APMC rate for selected crop
    - Implement photo upload to Supabase Storage (max 3MB)
    - Validate quantity > 0 and price > 0
    - Create listing record in Supabase with status "pending"
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 6.2 Create HealthGradeSelector component
    - Build UI for A/B/C grade selection with descriptions
    - Implement price suggestion logic (A: +10%, C: -10% of APMC)
    - Display grade prominently on listing
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 6.3 Create AuctionViewer component for Farmers
    - Fetch and display live auctions from Supabase
    - Implement WebSocket connection for real-time bid updates
    - Highlight auctions containing farmer's listings
    - Display anonymized highest bidder information
    - Add "Accept Bid" button for closed auctions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 6.4 Create MarketRatesDisplay component
    - Fetch APMC rates from Supabase prices table
    - Display rates for crops in farmer's district
    - Show 7-day price trend percentage
    - Display "Hold" or "Sell Now" recommendations based on trend
    - Implement daily data refresh mechanism
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 6.5 Create SchemesDiscovery component
    - Fetch government schemes from Supabase filtered by state
    - Implement eligibility filtering based on farmer profile
    - Display scheme name, benefit amount, eligibility criteria
    - Add one-tap apply button that creates application record
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 6.6 Create SarkariSaathiChat component
    - Build chat interface with message history display
    - Integrate AI API (Anthropic Claude or OpenAI) for chatbot
    - Support English and Hindi conversations using next-intl
    - Implement scheme information retrieval from Supabase
    - Maintain session-based conversation history
    - Ensure response time under 5 seconds
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 6.7 Create Farmer dashboard layout and navigation
    - Build FarmerDashboard page at /dashboard/farmer
    - Create navigation to listings, auctions, market rates, schemes, chat
    - Update BottomNav component to show farmer-specific menu items
    - _Requirements: 5.2, 21.1, 21.2_
  
  - [ ]* 6.8 Write unit tests for Farmer components
    - Test ProduceListingForm validation and submission
    - Test HealthGradeSelector price suggestion logic
    - Test MarketRatesDisplay trend calculation
    - _Requirements: 6.1, 6.5, 7.1, 7.5, 9.1, 9.5_

- [ ] 7. Build Consumer dashboard features
  - [x] 7.1 Create ProduceBrowser component
    - Fetch listings from both Farmers and Retailers
    - Implement filters for crop type, price range, health grade
    - Display seller type badge (Farmer/Retailer)
    - Show listing details: photo, price, quantity, location
    - Add "Add to Cart" functionality
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 7.2 Create ShoppingCart component
    - Display cart items grouped by seller
    - Calculate total amount per seller and grand total
    - Allow quantity adjustment and item removal
    - Implement "Proceed to Checkout" button
    - _Requirements: 22.1, 22.2_
  
  - [x] 7.3 Create RazorpayCheckout component
    - Integrate Razorpay SDK for payment processing
    - Create separate orders for each seller in cart
    - Process single payment transaction with amount splitting
    - Support UPI, Credit Card, Debit Card, Net Banking
    - Handle payment success callback and create order records
    - Handle payment failure with error display and retry
    - Send SMS confirmation within 1 minute of success
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 22.2, 22.3, 22.4, 22.5_
  
  - [x] 7.4 Create OrderTracker component
    - Fetch user's orders from Supabase
    - Display order status: placed, packed, dispatched, delivered
    - Show estimated delivery date based on seller location
    - Implement order history view with filtering
    - Add delivery confirmation prompt when status is "delivered"
    - Send status change notifications within 2 minutes
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 7.5 Create ConsumerSupportChat component
    - Build chat interface similar to SarkariSaathiChat
    - Integrate AI API for support queries
    - Support English and Hindi conversations
    - Implement order status retrieval functionality
    - Provide answers to common questions (delivery, returns, payments)
    - Add escalation to human support option
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 7.6 Create Consumer dashboard layout and navigation
    - Build ConsumerDashboard page at /dashboard/consumer
    - Create navigation to browse, cart, orders, support chat
    - Update BottomNav component to show consumer-specific menu items
    - _Requirements: 5.4, 21.1, 21.4_
  
  - [ ]* 7.7 Write unit tests for Consumer components
    - Test ProduceBrowser filtering logic
    - Test ShoppingCart total calculation and grouping
    - Test OrderTracker status display
    - _Requirements: 12.1, 12.2, 22.1, 22.2, 14.1_

- [ ] 8. Build Retailer dashboard features
  - [x] 8.1 Create AuctionBiddingInterface component
    - Fetch live and scheduled auctions from Supabase
    - Implement WebSocket connection for real-time updates
    - Build bid placement form with validation (min 1% above current)
    - Update auction's highest_bidder_id and current_bid in real-time
    - Send winning notification within 1 minute when auction closes
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [ ] 8.2 Create BulkProcurementBrowser component
    - Fetch farmer listings with quantity > 50kg
    - Implement filters for crop, district, health grade, price range
    - Display bulk pricing discounts where available
    - Support partial quantity purchase
    - Create order record with retailer as buyer_id
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  
  - [ ] 8.3 Create PriceAnalyticsDashboard component
    - Fetch 30-day APMC rate trends from Supabase
    - Build graphical charts using a charting library (recharts or chart.js)
    - Implement multi-district price comparison view
    - Add price alert configuration with threshold settings
    - Display seasonal price patterns for major crops
    - Implement daily data refresh
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ] 8.4 Create ContractFarmingManager component
    - Build contract request form (crop, quantity, delivery date, district)
    - Implement farmer matching logic based on district
    - Create contract agreement record when farmer accepts
    - Require 20% advance payment via Razorpay
    - Send notifications to both parties when harvest is ready
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ] 8.5 Create RetailerOrderManagement component
    - Fetch all orders placed by retailer from Supabase
    - Implement filtering by status, date range, crop type
    - Generate downloadable PDF invoices for each order
    - Update inventory records when order is delivered
    - Maintain 12-month purchase history
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [ ] 8.6 Create Retailer dashboard layout and navigation
    - Build RetailerDashboard page at /dashboard/retailer
    - Create navigation to auctions, procurement, analytics, contracts, orders
    - Update BottomNav component to show retailer-specific menu items
    - _Requirements: 5.3, 21.1, 21.3_
  
  - [ ]* 8.7 Write unit tests for Retailer components
    - Test AuctionBiddingInterface bid validation
    - Test BulkProcurementBrowser filtering and partial purchase
    - Test ContractFarmingManager advance payment calculation
    - _Requirements: 16.3, 17.1, 17.5, 19.4_

- [ ] 9. Checkpoint - Ensure all role-specific features work correctly
  - Test Farmer listing creation and auction viewing
  - Test Consumer browsing, cart, and checkout flow
  - Test Retailer auction bidding and bulk procurement
  - Verify role isolation and unauthorized access prevention
  - Ensure all tests pass, ask the user if questions arise

- [ ] 10. Implement real-time auction system with WebSocket
  - [ ] 10.1 Set up WebSocket server for auction events
    - Create WebSocket server using socket.io (or use Supabase Realtime)
    - Implement auction room management (join/leave)
    - Broadcast bid updates to all connected clients in auction room
    - Handle connection errors and reconnection logic
    - _Requirements: 8.2, 16.4_
  
  - [ ] 10.2 Create WebSocket client hooks
    - Build useAuctionSocket hook for real-time auction updates
    - Implement automatic reconnection on disconnect
    - Handle bid update events and update local state
    - Add connection status indicator
    - _Requirements: 8.2, 16.4_
  
  - [ ]* 10.3 Write integration tests for WebSocket functionality
    - Test bid broadcast to multiple clients
    - Test reconnection behavior
    - Test auction room isolation
    - _Requirements: 8.2, 16.4_

- [ ] 11. Implement payment integration with Razorpay
  - [ ] 11.1 Set up Razorpay account and API keys
    - Create Razorpay account and obtain API keys
    - Store keys securely in environment variables
    - Configure webhook endpoints for payment verification
    - _Requirements: 13.1_
  
  - [ ] 11.2 Create server-side payment API routes
    - Build API route to create Razorpay order
    - Build API route to verify payment signature
    - Implement payment splitting logic for multi-seller orders
    - Handle payment failure and refund scenarios
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 22.3, 22.4_
  
  - [ ] 11.3 Integrate Razorpay SDK in RazorpayCheckout component
    - Load Razorpay SDK script dynamically
    - Initialize Razorpay with order details
    - Handle payment success and failure callbacks
    - Update order status in Supabase after verification
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 11.4 Write unit tests for payment flow
    - Test order creation API
    - Test payment signature verification
    - Test payment splitting calculation
    - _Requirements: 13.1, 13.3, 22.3, 22.4_

- [ ] 12. Implement AI chatbot functionality
  - [ ] 12.1 Set up AI API integration (Anthropic Claude or OpenAI)
    - Choose AI provider and obtain API keys
    - Store keys securely in environment variables
    - Create API route for chat completions
    - _Requirements: 11.1, 15.1_
  
  - [ ] 12.2 Build chatbot backend logic
    - Implement conversation context management
    - Create system prompts for Sarkari Saathi (farmer-focused)
    - Create system prompts for Consumer Support (order-focused)
    - Implement scheme information retrieval from Supabase
    - Implement order status retrieval from Supabase
    - Add response streaming for better UX
    - _Requirements: 11.3, 11.4, 15.3, 15.4_
  
  - [ ] 12.3 Enhance chat components with AI integration
    - Connect SarkariSaathiChat to AI API route
    - Connect ConsumerSupportChat to AI API route
    - Implement message streaming display
    - Add typing indicators and loading states
    - Handle API errors gracefully
    - _Requirements: 11.1, 11.2, 11.4, 11.5, 15.1, 15.2, 15.4, 15.5_
  
  - [ ]* 12.4 Write unit tests for chatbot functionality
    - Test conversation context management
    - Test scheme information retrieval
    - Test order status retrieval
    - _Requirements: 11.3, 11.4, 15.3, 15.4_

- [ ] 13. Implement session management and security enhancements
  - [ ] 13.1 Configure session expiry and refresh
    - Set Supabase session expiry to 30 days of inactivity
    - Implement automatic session refresh on activity
    - Redirect to login page on session expiry
    - _Requirements: 23.1, 23.2_
  
  - [ ] 13.2 Implement security best practices
    - Ensure all API routes use HTTPS
    - Encrypt authentication tokens using Supabase defaults
    - Implement suspicious activity detection (multiple failed logins)
    - Add CSRF protection to forms
    - _Requirements: 23.3, 23.4, 23.5_
  
  - [ ]* 13.3 Write security tests
    - Test session expiry behavior
    - Test unauthorized access prevention
    - Test CSRF protection
    - _Requirements: 23.1, 23.2, 23.5_

- [ ] 14. Implement data synchronization and offline support
  - [ ] 14.1 Add data persistence layer
    - Persist user profile data to Supabase within 2 seconds
    - Implement optimistic UI updates for better UX
    - Add sync status indicator in UI
    - _Requirements: 24.1, 24.4_
  
  - [ ] 14.2 Implement offline queue for network failures
    - Queue data changes locally when network is unavailable
    - Synchronize queued changes within 10 seconds of reconnection
    - Handle sync conflicts with last-write-wins strategy
    - Display error notification after 3 failed sync attempts
    - _Requirements: 24.2, 24.3, 24.5_
  
  - [ ]* 14.3 Write tests for data synchronization
    - Test optimistic updates
    - Test offline queue behavior
    - Test sync conflict resolution
    - _Requirements: 24.1, 24.2, 24.3_

- [ ] 15. Enhance internationalization support
  - [ ] 15.1 Add translation keys for all new components
    - Add English translations to messages/en.json
    - Add Hindi translations to messages/hi.json
    - Ensure all user-facing text uses next-intl useTranslations hook
    - _Requirements: 25.1, 25.2, 25.3_
  
  - [ ] 15.2 Implement locale-aware formatting
    - Format currency using Indian Rupee (₹) symbol
    - Format numbers with Indian locale (lakhs/crores)
    - Format dates using Indian date format (DD/MM/YYYY)
    - _Requirements: 25.4_
  
  - [ ] 15.3 Add language switcher component
    - Build language switcher UI component
    - Persist language preference to user profile
    - Allow language switching without losing context
    - _Requirements: 25.2, 25.5_
  
  - [ ]* 15.4 Write tests for internationalization
    - Test translation key coverage
    - Test locale-aware formatting
    - Test language switching behavior
    - _Requirements: 25.1, 25.3, 25.4, 25.5_

- [ ] 16. Final integration and testing
  - [ ] 16.1 Integration testing across all roles
    - Test complete user journey for Farmer (signup → listing → auction)
    - Test complete user journey for Consumer (signup → browse → purchase)
    - Test complete user journey for Retailer (signup → bid → contract)
    - Verify cross-role interactions (Consumer buying from Farmer)
    - _Requirements: All requirements_
  
  - [ ] 16.2 Performance optimization
    - Optimize image loading with Next.js Image component
    - Implement lazy loading for dashboard components
    - Add caching for APMC rates and scheme data
    - Optimize Supabase queries with proper indexes
    - _Requirements: 9.2, 18.5, 24.1_
  
  - [ ] 16.3 Accessibility improvements
    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works for all forms
    - Test with screen readers
    - Ensure color contrast meets WCAG standards
    - _Requirements: All requirements_
  
  - [ ]* 16.4 End-to-end testing
    - Write E2E tests for authentication flow
    - Write E2E tests for listing creation and purchase
    - Write E2E tests for auction bidding
    - Write E2E tests for payment flow
    - _Requirements: All requirements_

- [ ] 17. Final checkpoint - Ensure all features are complete and tested
  - Verify all role-specific dashboards are fully functional
  - Confirm authentication, routing, and security work correctly
  - Test payment integration end-to-end
  - Verify real-time auction system works across multiple clients
  - Test AI chatbot functionality in both languages
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- The implementation preserves existing i18n, routing, and Supabase setup
- WebSocket can be replaced with Supabase Realtime for simpler implementation
- AI chatbot can use either Anthropic Claude or OpenAI based on preference
- Payment splitting logic should account for platform fees if applicable
- All components should follow existing shadcn/ui patterns for consistency
