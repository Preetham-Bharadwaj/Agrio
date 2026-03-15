# Requirements Document

## Introduction

This document specifies the requirements for implementing a comprehensive role-based agricultural marketplace platform within the Kisan Cartel Next.js application. The platform enables three distinct user types (Farmers, Retailers, and Consumers) to interact within a unified marketplace while maintaining completely separate user interfaces and feature sets tailored to each role's specific needs.

## Glossary

- **System**: Agrio agricultural marketplace platform
- **User**: Any authenticated person using the platform (Farmer, Retailer, or Consumer)
- **Farmer**: A user who grows and sells agricultural produce
- **Retailer**: A user who purchases produce in bulk for resale
- **Consumer**: A user who purchases produce for personal consumption
- **Produce**: Agricultural products listed for sale
- **Listing**: A produce item posted for sale by a Farmer
- **Auction**: A time-bound competitive bidding process for pooled produce
- **OTP**: One-Time Password sent via SMS for authentication
- **Verification_Document**: Government-issued identification or business registration document
- **Health_Grade**: Quality classification of produce (A/B/C based on visual inspection)
- **APMC_Rate**: Agricultural Produce Market Committee official market price
- **Order**: A purchase transaction between buyer and seller
- **Dashboard**: Role-specific user interface displaying relevant features
- **Sarkari_Saathi**: AI chatbot assistant for farmers providing government scheme information
- **Contract_Farming**: Agreement to purchase future harvest before cultivation

## Requirements

### Requirement 1: User Authentication

**User Story:** As a User, I want to authenticate using my phone number, so that I can securely access the platform.

#### Acceptance Criteria

1. WHEN a User enters a valid 10-digit phone number, THE System SHALL send an OTP to that phone number within 30 seconds
2. WHEN a User enters the correct OTP within 5 minutes, THE System SHALL authenticate the User and create a session
3. IF an incorrect OTP is entered 3 times, THEN THE System SHALL block further attempts for 15 minutes
4. THE System SHALL support phone numbers with Indian country code (+91)

### Requirement 2: Role Selection

**User Story:** As a new User, I want to select my role during onboarding, so that I can access features relevant to my needs.

#### Acceptance Criteria

1. WHEN a User completes phone authentication for the first time, THE System SHALL present role selection options (Farmer, Retailer, Consumer)
2. THE System SHALL allow selection of exactly one role per User account
3. WHEN a User selects a role, THE System SHALL persist the role selection in the User profile
4. THE System SHALL prevent role changes after initial selection is confirmed

### Requirement 3: User Profile Collection

**User Story:** As a User, I want to provide my personal details, so that the platform can personalize my experience.

#### Acceptance Criteria

1. WHEN a User completes role selection, THE System SHALL prompt for name, address, district, and state
2. THE System SHALL validate that name contains at least 2 characters
3. THE System SHALL validate that district and state are selected from predefined lists
4. THE System SHALL require all profile fields before allowing dashboard access
5. THE System SHALL support address input in both English and Hindi languages

### Requirement 4: Document Verification for Farmers and Retailers

**User Story:** As a Farmer or Retailer, I want to upload verification documents, so that I can gain trusted seller status on the platform.

#### Acceptance Criteria

1. WHEN a Farmer or Retailer completes profile collection, THE System SHALL prompt for Verification_Document upload
2. THE System SHALL accept image files in JPEG, PNG, or PDF format up to 5MB
3. THE System SHALL store uploaded documents securely with encryption
4. THE System SHALL set verification_status to "pending" after document upload
5. WHERE the User role is Consumer, THE System SHALL skip document verification and set verification_status to "verified"

### Requirement 5: Role-Based Dashboard Routing

**User Story:** As a User, I want to be automatically directed to my role-specific dashboard after login, so that I see only relevant features.

#### Acceptance Criteria

1. WHEN an authenticated User accesses the dashboard, THE System SHALL detect the User's role from the profile
2. IF the User role is Farmer, THEN THE System SHALL render the Farmer_Dashboard
3. IF the User role is Retailer, THEN THE System SHALL render the Retailer_Dashboard
4. IF the User role is Consumer, THEN THE System SHALL render the Consumer_Dashboard
5. THE System SHALL prevent Users from accessing dashboard routes not matching their role

### Requirement 6: Farmer Produce Listing

**User Story:** As a Farmer, I want to list my produce for sale, so that Retailers and Consumers can purchase it.

#### Acceptance Criteria

1. WHEN a Farmer creates a Listing, THE System SHALL require crop name, quantity in kg, price per kg, and Health_Grade
2. THE System SHALL allow upload of one produce photo per Listing up to 3MB
3. THE System SHALL display current APMC_Rate for the selected crop during listing creation
4. WHEN a Listing is created, THE System SHALL set status to "pending" and store the Farmer's user ID
5. THE System SHALL validate that quantity is greater than 0 and price is greater than 0

### Requirement 7: Health Grade Assessment

**User Story:** As a Farmer, I want to assign a health grade to my produce, so that buyers understand the quality level.

#### Acceptance Criteria

1. THE System SHALL provide Health_Grade options: A (Excellent), B (Good), C (Fair)
2. WHEN a Farmer selects a Health_Grade, THE System SHALL store it with the Listing
3. THE System SHALL display Health_Grade prominently on Listing details
4. WHERE Health_Grade is A, THE System SHALL suggest a price 10% above APMC_Rate
5. WHERE Health_Grade is C, THE System SHALL suggest a price 10% below APMC_Rate

### Requirement 8: Live Auction Viewing for Farmers

**User Story:** As a Farmer, I want to view live auctions of pooled produce, so that I can monitor bidding and accept offers.

#### Acceptance Criteria

1. WHEN a Farmer accesses the auction view, THE System SHALL display all Auctions with status "live"
2. THE System SHALL update current bid amounts in real-time within 2 seconds of new bids
3. THE System SHALL display the highest bidder's ID (anonymized) for each Auction
4. WHEN an Auction includes the Farmer's Listing, THE System SHALL highlight that Auction
5. THE System SHALL allow the Farmer to accept the highest bid when Auction status is "closed"

### Requirement 9: Market Rates Display

**User Story:** As a Farmer, I want to view current APMC market rates, so that I can make informed pricing decisions.

#### Acceptance Criteria

1. THE System SHALL display APMC_Rate for all major crops in the Farmer's district
2. THE System SHALL update APMC_Rate data at least once every 24 hours
3. THE System SHALL display price trend percentage (increase/decrease) for the past 7 days
4. WHERE trend indicates price increase, THE System SHALL display "Hold" recommendation
5. WHERE trend indicates price decrease, THE System SHALL display "Sell Now" recommendation

### Requirement 10: Government Schemes Discovery

**User Story:** As a Farmer, I want to discover eligible government schemes, so that I can access financial benefits.

#### Acceptance Criteria

1. THE System SHALL display government schemes available in the Farmer's state
2. THE System SHALL filter schemes based on Farmer's profile data (district, crop type, land size)
3. THE System SHALL display scheme name, benefit amount, and eligibility criteria
4. WHEN a Farmer selects a scheme, THE System SHALL provide a one-tap apply button
5. WHEN a Farmer applies, THE System SHALL create an Application record with status "submitted"

### Requirement 11: Sarkari Saathi Chatbot

**User Story:** As a Farmer, I want to chat with Sarkari_Saathi in my local language, so that I can get help with government schemes and farming queries.

#### Acceptance Criteria

1. THE System SHALL provide a chatbot interface accessible from the Farmer_Dashboard
2. THE System SHALL support conversations in English and Hindi languages
3. WHEN a Farmer asks about schemes, THE Sarkari_Saathi SHALL provide relevant scheme information
4. THE Sarkari_Saathi SHALL respond to queries within 5 seconds
5. THE System SHALL maintain conversation history for the current session

### Requirement 12: Consumer Browse and Purchase

**User Story:** As a Consumer, I want to browse and buy produce from Farmers and Retailers, so that I can purchase fresh agricultural products.

#### Acceptance Criteria

1. WHEN a Consumer accesses the browse view, THE System SHALL display Listings from both Farmers and Retailers
2. THE System SHALL allow filtering by crop type, price range, and Health_Grade
3. THE System SHALL display seller type (Farmer or Retailer) on each Listing
4. WHEN a Consumer selects a Listing, THE System SHALL display full details including photo, price, quantity, and seller location
5. THE System SHALL allow Consumers to add Listings to cart and proceed to checkout

### Requirement 13: Payment Integration

**User Story:** As a Consumer, I want to pay using multiple payment methods, so that I can complete purchases conveniently.

#### Acceptance Criteria

1. WHEN a Consumer proceeds to checkout, THE System SHALL integrate with Razorpay payment gateway
2. THE System SHALL support UPI, Credit Card, Debit Card, and Net Banking payment methods
3. WHEN payment is successful, THE System SHALL create an Order record with payment_status "completed"
4. IF payment fails, THEN THE System SHALL display error message and allow retry
5. THE System SHALL send payment confirmation via SMS within 1 minute of successful payment

### Requirement 14: Order Tracking

**User Story:** As a Consumer, I want to track my order status, so that I know when to expect delivery.

#### Acceptance Criteria

1. THE System SHALL maintain Order status through stages: placed, packed, dispatched, delivered
2. WHEN Order status changes, THE System SHALL send notification to the Consumer within 2 minutes
3. THE System SHALL display estimated delivery date based on seller location and Consumer address
4. THE System SHALL allow Consumers to view order history with all past Orders
5. WHEN an Order is delivered, THE System SHALL prompt Consumer for delivery confirmation

### Requirement 15: Consumer Support Chatbot

**User Story:** As a Consumer, I want to chat with a support bot, so that I can get help with orders and platform usage.

#### Acceptance Criteria

1. THE System SHALL provide a chatbot interface accessible from the Consumer_Dashboard
2. THE System SHALL support conversations in English and Hindi languages
3. WHEN a Consumer asks about an Order, THE System SHALL retrieve and display Order status
4. THE System SHALL provide answers to common questions about delivery, returns, and payments
5. THE System SHALL escalate to human support when unable to resolve queries

### Requirement 16: Retailer Auction Participation

**User Story:** As a Retailer, I want to join live auctions and place bids, so that I can purchase produce in bulk at competitive prices.

#### Acceptance Criteria

1. WHEN a Retailer accesses the auction view, THE System SHALL display all Auctions with status "live" or "scheduled"
2. THE System SHALL allow Retailers to place bids higher than the current highest bid
3. WHEN a Retailer places a bid, THE System SHALL validate that bid amount exceeds current_bid by at least 1%
4. THE System SHALL update the Auction's highest_bidder_id and current_bid in real-time
5. WHEN an Auction closes, THE System SHALL notify the winning Retailer within 1 minute

### Requirement 17: Retailer Bulk Procurement

**User Story:** As a Retailer, I want to browse and purchase produce listings in bulk, so that I can stock inventory for my business.

#### Acceptance Criteria

1. WHEN a Retailer accesses the browse view, THE System SHALL display Listings from Farmers with quantity greater than 50kg
2. THE System SHALL allow filtering by crop type, district, Health_Grade, and price range
3. THE System SHALL display bulk pricing discounts where available
4. WHEN a Retailer purchases a Listing, THE System SHALL create an Order with buyer_id set to Retailer's user ID
5. THE System SHALL support purchase of partial quantities from Listings

### Requirement 18: Price Analytics for Retailers

**User Story:** As a Retailer, I want to view price analytics and trends, so that I can make informed procurement decisions.

#### Acceptance Criteria

1. THE System SHALL display APMC_Rate trends for the past 30 days in graphical format
2. THE System SHALL show price comparison across multiple districts in the Retailer's state
3. THE System SHALL provide price alerts when rates drop below Retailer-defined thresholds
4. THE System SHALL display seasonal price patterns for major crops
5. THE System SHALL update analytics data at least once every 24 hours

### Requirement 19: Contract Farming

**User Story:** As a Retailer, I want to book future harvest through contract farming, so that I can secure supply in advance.

#### Acceptance Criteria

1. THE System SHALL allow Retailers to create contract farming requests specifying crop, quantity, and delivery date
2. THE System SHALL match contract requests with Farmers in the specified district
3. WHEN a Farmer accepts a contract, THE System SHALL create a binding agreement record
4. THE System SHALL require advance payment of 20% of total contract value
5. THE System SHALL notify both parties when harvest is ready for delivery

### Requirement 20: Retailer Order Management

**User Story:** As a Retailer, I want to track my purchase orders and delivery status, so that I can manage my inventory effectively.

#### Acceptance Criteria

1. THE System SHALL display all Orders placed by the Retailer with current status
2. THE System SHALL allow filtering by Order status, date range, and crop type
3. THE System SHALL provide downloadable invoices in PDF format for each Order
4. WHEN an Order is delivered, THE System SHALL update inventory records
5. THE System SHALL maintain purchase history for at least 12 months

### Requirement 21: UI Separation by Role

**User Story:** As a User, I want to see only features relevant to my role, so that the interface is not cluttered with irrelevant options.

#### Acceptance Criteria

1. THE System SHALL render completely separate navigation menus for each role
2. THE System SHALL prevent Farmers from accessing Retailer or Consumer specific routes
3. THE System SHALL prevent Retailers from accessing Farmer or Consumer specific routes
4. THE System SHALL prevent Consumers from accessing Farmer or Retailer specific routes
5. IF a User attempts to access unauthorized routes, THEN THE System SHALL redirect to their role-specific dashboard

### Requirement 22: Multi-Seller Purchase for Consumers

**User Story:** As a Consumer, I want to purchase from both Farmers and Retailers in a single transaction, so that I can get the best prices and variety.

#### Acceptance Criteria

1. THE System SHALL allow Consumers to add Listings from multiple sellers to a single cart
2. WHEN checkout is initiated, THE System SHALL create separate Orders for each seller
3. THE System SHALL process payments for all Orders in a single Razorpay transaction
4. THE System SHALL split payment amounts to respective sellers based on Order totals
5. THE System SHALL display combined order summary showing items grouped by seller

### Requirement 23: Session Management and Security

**User Story:** As a User, I want my session to remain secure, so that my account and data are protected.

#### Acceptance Criteria

1. THE System SHALL expire user sessions after 30 days of inactivity
2. WHEN a session expires, THE System SHALL redirect the User to the login page
3. THE System SHALL encrypt all authentication tokens using industry-standard algorithms
4. THE System SHALL implement HTTPS for all data transmission
5. THE System SHALL log out Users when suspicious activity is detected

### Requirement 24: Data Persistence and Synchronization

**User Story:** As a User, I want my data to be saved reliably, so that I don't lose information due to network issues.

#### Acceptance Criteria

1. THE System SHALL persist all User profile data to Supabase database within 2 seconds of submission
2. WHEN network connectivity is lost, THE System SHALL queue data changes locally
3. WHEN network connectivity is restored, THE System SHALL synchronize queued changes within 10 seconds
4. THE System SHALL display sync status indicator to Users during synchronization
5. IF synchronization fails after 3 attempts, THEN THE System SHALL notify the User with error details

### Requirement 25: Internationalization Support

**User Story:** As a User, I want to use the platform in my preferred language, so that I can understand all features clearly.

#### Acceptance Criteria

1. THE System SHALL support English and Hindi languages for all user-facing text
2. WHEN a User selects a language preference, THE System SHALL persist the choice
3. THE System SHALL display all dashboard content, labels, and messages in the selected language
4. THE System SHALL format numbers and currency according to Indian locale standards
5. THE System SHALL allow language switching from any page without losing current context
