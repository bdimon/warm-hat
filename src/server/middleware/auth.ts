
import { Request, Response, NextFunction } from "express";
import { supabase, supabaseService } from "@/lib/supabase-client";
import { User } from '@supabase/supabase-js';
import { UserRoleRecord, UserRole } from '@/types/auth';

// Middleware to verify JWT and authenticate user
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the JWT token
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Attach user to request object
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Middleware to verify admin privileges
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!supabaseService) {
    return res.status(503).json({ error: "Service client not available" });
  }
  
  try {
    // Get user's role from a custom table or check email domain
    const { data, error } = await supabaseService
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .single<UserRoleRecord>();
      
    if (error || !data || data.role !== 'admin') {
      return res.status(403).json({ error: "Admin privileges required" });
    }
    
    req.isAdmin = true;
    next();
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: "Failed to verify admin privileges", message: err.message });
  }
};

// Helper middleware for checking specific roles
export const requireRole = (role: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!supabaseService) {
      return res.status(503).json({ error: "Service client not available" });
    }
    
    try {
      const { data, error } = await supabaseService
        .from('user_roles')
        .select('role')
        .eq('user_id', req.user.id)
        .single<UserRoleRecord>();
        
      if (error || !data || data.role !== role) {
        return res.status(403).json({ error: `${role} privileges required` });
      }
      
      next();
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: "Failed to verify user privileges", message: err.message });
    }
  };
};

