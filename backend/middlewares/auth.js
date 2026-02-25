import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Giriş gerekli" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token payload'ı: { userId: "..." }
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ message: "Token geçersiz" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User bulunamadı" });
    }

    req.userId = user._id.toString();
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token geçersiz" });
  }
}