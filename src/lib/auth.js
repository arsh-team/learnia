import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function getUserIdFromToken(token) {
  try {
    if (!token) return null;
    
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(actualToken, SECRET);
    return decoded.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}