import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string; 
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authorization failed, please login to continue" });
      return; 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Authorization failed, please login to continue" });
      return;
    }

    // Check if the user is blacklisted
    if (user.blacklist && user.blacklist.includes(token)) {
      res.status(401).json({ message: "Authorization failed, please login to continue" });
      return;
    }

    req.userId = user.id;
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Authorization failed, please login to continue" });
  }
};

const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    (async () => {
      try {
        if (!req.userId) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        if (!roles.includes(user.role)) {
          return res.status(401).json({ error: "Forbidden: Not Permitted" });
        }

        req.role = user.role;
        next();
      } catch (error) {
        console.error("Error in requireRole:", error);
        res.status(500).json({ error: "Server error" });
      }
    })();
  };
};
export { authenticate, requireRole };
