/** When true, auth uses mock OTP (123456) and no Supabase. Set by missing NEXT_PUBLIC_SUPABASE_URL. */
export const isPrototypeMode =
  typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const PROTOTYPE_USER_ID = 'prototype-user';
export const PROTOTYPE_OTP = '123456';
