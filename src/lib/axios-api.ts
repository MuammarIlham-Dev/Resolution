// This file redirects the API layer to use Supabase directly.
// To switch back to the local axios-based API, import from './axios-api' instead.

export * from './supabase-api';
export { default } from './supabase-api';
