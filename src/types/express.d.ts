
import { User } from '@supabase/supabase-js';

// Extend Express Request interface without using namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    isAdmin?: boolean;
  }
}

