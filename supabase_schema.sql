-- Agrio Supabase Schema

-- 1. Users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    state TEXT,
    district TEXT,
    language TEXT DEFAULT 'en',
    account_type TEXT CHECK (account_type IN ('farmer', 'retailer', 'consumer')),
    document_url TEXT,
    verified BOOLEAN DEFAULT false,
    credit_score INT DEFAULT 400,
    fpo_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FPOs (Farmer Producer Organizations)
CREATE TABLE public.fpos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    members_count INT DEFAULT 0
);

-- 3. Listings
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.users(id),
    crop TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    min_price NUMERIC NOT NULL,
    health_grade TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pooled', 'auctioned', 'sold')),
    auction_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Auctions
CREATE TABLE public.auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fpo_id UUID REFERENCES public.fpos(id),
    crop TEXT NOT NULL,
    total_quantity_kg NUMERIC NOT NULL,
    current_bid NUMERIC DEFAULT 0,
    highest_bidder_id UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'closed')),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bids
CREATE TABLE public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID REFERENCES public.auctions(id),
    bidder_id UUID REFERENCES public.users(id),
    amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Prices (Market Rates)
CREATE TABLE public.prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop TEXT NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    mandi TEXT,
    district TEXT,
    state TEXT,
    trend_pct NUMERIC,
    forecast_signal TEXT CHECK (forecast_signal IN ('hold', 'sell', 'urgent_sell')),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Schemes
CREATE TABLE public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    benefit_amount NUMERIC,
    eligibility_rules JSONB,
    state TEXT,
    description TEXT
);

-- 8. Applications
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    scheme_id UUID REFERENCES public.schemes(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Carbon Credits
CREATE TABLE public.carbon_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.users(id),
    credits_earned NUMERIC DEFAULT 0,
    verification_status TEXT DEFAULT 'pending',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.users(id) NOT NULL,
    seller_id UUID REFERENCES public.users(id) NOT NULL,
    listing_id UUID REFERENCES public.listings(id),
    quantity_kg NUMERIC NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    delivery_status TEXT DEFAULT 'placed' CHECK (delivery_status IN ('placed', 'packed', 'dispatched', 'delivered')),
    estimated_delivery_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Contracts (Contract Farming)
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES public.users(id) NOT NULL,
    farmer_id UUID REFERENCES public.users(id),
    crop TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    district TEXT NOT NULL,
    advance_payment_pct NUMERIC DEFAULT 20,
    advance_paid BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'ready', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Chat Sessions
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    chat_type TEXT CHECK (chat_type IN ('sarkari_saathi', 'consumer_support')),
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Shopping Cart
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Farmers can manage their listings" ON public.listings FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Anyone can view live auctions" ON public.auctions FOR SELECT USING (status = 'live');
CREATE POLICY "Anyone can view price data" ON public.prices FOR SELECT TO authenticated USING (true);

-- Orders Policies
CREATE POLICY "Users can view their own orders as buyer" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can view their own orders as seller" ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Consumers can create orders" ON public.orders FOR INSERT WITH CHECK (
    auth.uid() = buyer_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'consumer')
);
CREATE POLICY "Retailers can create orders" ON public.orders FOR INSERT WITH CHECK (
    auth.uid() = buyer_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'retailer')
);
CREATE POLICY "Sellers can update order delivery status" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

-- Payments Policies
CREATE POLICY "Users can view payments for their orders" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);

-- Contracts Policies
CREATE POLICY "Retailers can create contracts" ON public.contracts FOR INSERT WITH CHECK (
    auth.uid() = retailer_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'retailer')
);
CREATE POLICY "Retailers can view their contracts" ON public.contracts FOR SELECT USING (auth.uid() = retailer_id);
CREATE POLICY "Farmers can view contracts offered to them" ON public.contracts FOR SELECT USING (auth.uid() = farmer_id OR farmer_id IS NULL);
CREATE POLICY "Farmers can accept contracts" ON public.contracts FOR UPDATE USING (
    auth.uid() = farmer_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'farmer')
);

-- Chat Sessions Policies
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- Cart Items Policies
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Bids Policies
CREATE POLICY "Retailers can place bids" ON public.bids FOR INSERT WITH CHECK (
    auth.uid() = bidder_id AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'retailer')
);
CREATE POLICY "Users can view bids for auctions" ON public.bids FOR SELECT TO authenticated USING (true);

-- Listings Policies (Enhanced)
CREATE POLICY "Consumers can view active listings" ON public.listings FOR SELECT USING (
    status IN ('pending', 'pooled') AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'consumer')
);
CREATE POLICY "Retailers can view active listings" ON public.listings FOR SELECT USING (
    status IN ('pending', 'pooled') AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND account_type = 'retailer')
);

-- Database Functions for Role Verification
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
    SELECT account_type FROM public.users WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_farmer(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND account_type = 'farmer');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_retailer(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND account_type = 'retailer');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_consumer(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND account_type = 'consumer');
$$ LANGUAGE SQL SECURITY DEFINER;
