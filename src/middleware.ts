import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'kn', 'te', 'mr', 'ta'],
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const response = intlMiddleware(request);
  
  // If next-intl wants to redirect (e.g. adding a locale), return that response immediately
  if (response.status === 307 || response.status === 308 || response.headers.get('x-next-intl-locale')) {
    return response;
  }

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request);
  
  // Merge next-intl headers into supabaseResponse
  response.headers.forEach((value, key) => {
    supabaseResponse.headers.set(key, value);
  });
  
  const pathname = request.nextUrl.pathname;
  
  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(en|hi|kn|te|mr|ta)/);
  const locale = localeMatch ? localeMatch[1] : 'en';
  
  // Protected routes that require authentication
  const isDashboardRoute = pathname.includes('/dashboard');
  const isOnboardRoute = pathname.includes('/onboard');
  
  // If accessing dashboard without user, redirect to auth
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL(`/${locale}/onboard/auth`, request.url));
  }
  
  // If accessing onboard with user, check if profile is complete
  if (isOnboardRoute && user) {
    // Allow access to onboard routes - they will handle their own flow
    return supabaseResponse;
  }
  
  // Role-based access control for dashboard routes
  if (isDashboardRoute && user) {
    const { isPrototypeMode, PROTOTYPE_USER_ID } = await import('@/lib/prototype');
    if (isPrototypeMode && user.id === PROTOTYPE_USER_ID) {
      // Prototype: no DB — default to farmer dashboard
      if (pathname.endsWith('/dashboard') || pathname.endsWith('/dashboard/')) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/farmer`, request.url));
      }
      return supabaseResponse;
    }

    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('account_type, verified')
        .eq('id', user.id)
        .single();

      if (error || !userProfile) {
        return NextResponse.redirect(new URL(`/${locale}/onboard/register`, request.url));
      }

      const userRole = userProfile.account_type;
      
      // Check if user is accessing their correct dashboard
      const isFarmerRoute = pathname.includes('/dashboard/farmer');
      const isRetailerRoute = pathname.includes('/dashboard/retailer');
      const isConsumerRoute = pathname.includes('/dashboard/consumer');
      
      // If accessing main dashboard, redirect to role-specific dashboard
      if (pathname.endsWith('/dashboard') || pathname.endsWith('/dashboard/')) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/${userRole}`, request.url));
      }
      
      // Prevent access to other roles' dashboards
      if (isFarmerRoute && userRole !== 'farmer') {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/${userRole}`, request.url));
      }
      
      if (isRetailerRoute && userRole !== 'retailer') {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/${userRole}`, request.url));
      }
      
      if (isConsumerRoute && userRole !== 'consumer') {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/${userRole}`, request.url));
      }
      
    } catch (error) {
      console.error('Middleware error:', error);
    }
  }
  
  return supabaseResponse;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (internal)
  // - _vercel (internal)
  // - all static files in the public folder (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
