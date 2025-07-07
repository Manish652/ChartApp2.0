import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: "Unauthorized - No Token Provided",
        code: "NO_TOKEN"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ 
        message: "Unauthorized - Invalid Token",
        code: "INVALID_TOKEN"
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        message: "User not found - Please login again",
        code: "USER_NOT_FOUND"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token - Please login again",
        code: "JWT_ERROR"
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired - Please login again",
        code: "TOKEN_EXPIRED"
      });
    }
    res.status(500).json({ 
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    });
  }
};

