
import express from "express";
import { requireAuth, requireAdmin, requireRole } from "@/server/middleware/auth";

const router = express.Router();

// Test route for authentication
router.get("/auth-test", requireAuth, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

// Test route for admin privileges
router.get("/admin-test", requireAuth, requireAdmin, (req, res) => {
  res.json({
    message: "Admin authentication successful",
    user: {
      id: req.user.id,
      email: req.user.email,
      isAdmin: req.isAdmin
    }
  });
});

// Test route for specific role
router.get("/editor-test", requireAuth, requireRole('editor'), (req, res) => {
  res.json({
    message: "Editor authentication successful",
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

export default router;

