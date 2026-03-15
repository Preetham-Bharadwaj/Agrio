# Agrio

India's First Farmer Collective Auction Network - A modern agricultural platform connecting farmers, retailers, and consumers directly.

## 🌾 Features

### For Farmers
- **Collective Auctions**: Pool crops with other farmers for better prices
- **Live Bidding**: Real-time auction platform with competitive pricing
- **Market Intelligence**: AI-powered price forecasting and market trends
- **Government Schemes**: Automatic discovery and application assistance
- **Direct Sales**: Cut out middlemen, sell directly to retailers

### For Retailers
- **Bulk Procurement**: Buy directly from farmer collectives
- **Quality Assurance**: Grade A/B/C produce with quality guarantees
- **Cost Savings**: Eliminate 3-4 middleman layers, save 40%
- **Analytics Dashboard**: Price trends and procurement insights
- **Reliable Supply**: Consistent inventory from verified farmers

### For Consumers
- **Farm-Fresh Produce**: Direct from farm to your doorstep
- **Traceability**: Know exactly which farm your food came from
- **Fair Prices**: Grade A produce at reasonable prices
- **Seasonal Availability**: Fresh produce based on harvest cycles
- **Quick Delivery**: Fast and reliable home delivery

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Authentication**: OTP-based system (mock implementation)
- **Responsive**: Mobile-first design

## 📱 User Flow

1. **Sign In**: Mobile number + OTP verification
2. **Role Selection**: Farmer, Retailer, or Consumer
3. **Onboarding**: Complete profile setup
4. **Dashboard**: Role-specific features and tools
5. **Transactions**: Auctions, purchases, or sales

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Preetham-Bharadwaj/Agrio.git
cd Agrio

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
# Optional: For real authentication (uses mock if not provided)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production OTP
SMS_PROVIDER_API_KEY=your_sms_key
SMS_PROVIDER_SENDER_ID=your_sender_id
```

### Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Demo Users

For testing, use these mobile numbers with OTP `123456`:

- **+91 9876543210** → Rajesh (Farmer)
- **+91 9876543211** → Priya (Retailer)  
- **+91 9876543212** → Amit (Consumer)
- **Any other number** → New User

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Connect your Vercel account to GitHub
3. Import the `Agrio` repository
4. Vercel will auto-detect Next.js and deploy
5. Configure environment variables in Vercel dashboard

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Responsive Design

- **Mobile**: Touch-optimized interface
- **Tablet**: Balanced layout for medium screens  
- **Desktop**: Full-featured dashboard experience

## 🔐 Authentication

The app uses a mock authentication system that works without external services:

- **Phone Verification**: OTP-based login
- **Multi-API Fallback**: Overpass → BigDataCloud → Nominatim
- **Role-Based Access**: Different dashboards for each user type
- **Session Management**: Automatic logout and session handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Vision

*"Farm to Table. No Middlemen. Returning profit to the roots of the country."*

Agrio empowers farmers with technology, connects them directly with buyers, and ensures fair prices for everyone in the agricultural supply chain.
