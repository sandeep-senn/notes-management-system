import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1]; // Bearer token extract karo

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // secret check karo
    req.userId = decoded.id;  // jo bhi user id token mein hai wo assign karo
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
