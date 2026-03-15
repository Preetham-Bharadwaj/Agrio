# Supabase Auth Configuration for OTP

## Steps to Configure Phone Authentication

### 1. Enable Phone Authentication in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Phone** provider
4. Configure the following settings:
   - Enable phone sign-ups
   - Enable phone confirmations
   - Set OTP expiry to 5 minutes (300 seconds)
   - Set rate limiting to 3 attempts per 15 minutes

### 2. Configure SMS Provider

Choose one of the following SMS providers for Indian phone numbers:

#### Option A: Twilio (Recommended)
1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Purchase a phone number with SMS capabilities
4. In Supabase Dashboard → Authentication → Providers → Phone:
   - Select "Twilio" as SMS provider
   - Enter your Twilio Account SID
   - Enter your Twilio Auth Token
   - Enter your Twilio phone number

#### Option B: MSG91 (India-specific)
1. Create an MSG91 account at https://msg91.com
2. Get your Auth Key and Sender ID
3. In Supabase Dashboard → Authentication → Providers → Phone:
   - Select "Custom" as SMS provider
   - Configure webhook URL for MSG91 API
   - Add Auth Key to environment variables

### 3. Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMS Provider (if using custom provider)
SMS_PROVIDER_API_KEY=your_sms_provider_key
SMS_PROVIDER_SENDER_ID=your_sender_id
```

### 4. Rate Limiting Configuration

In Supabase Dashboard → Authentication → Rate Limits:
- Set **Phone OTP requests** to 3 per 15 minutes per IP
- Set **Phone OTP verification** to 3 attempts per OTP
- Enable automatic blocking after failed attempts

### 5. OTP Template Customization

Customize the OTP message template in Supabase Dashboard:
```
Your Agrio verification code is: {{ .Token }}
Valid for 5 minutes. Do not share this code.
```

### 6. Testing

Use Supabase's test phone numbers for development:
- Test number: +91 9999999999
- Test OTP: 123456

## Security Best Practices

1. Always use HTTPS in production
2. Implement CAPTCHA for OTP requests to prevent abuse
3. Log failed OTP attempts for security monitoring
4. Set up alerts for suspicious activity
5. Regularly rotate SMS provider credentials

## Troubleshooting

- **OTP not received**: Check SMS provider balance and configuration
- **Rate limit errors**: Wait 15 minutes or use different phone number
- **Invalid OTP**: Ensure OTP is entered within 5 minutes
- **Phone format errors**: Always use +91 country code for Indian numbers
