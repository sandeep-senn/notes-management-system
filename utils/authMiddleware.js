// import { clerkClient } from '@clerk/clerk-sdk-node';
import { requireAuth } from '@clerk/express';
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const session = await clerkClient.sessions.verifySession(token);

//     req.userId = session.userId; // 👈 yeh userId tumhare Note ke liye hai
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };
// export default authMiddleware;
export default requireAuth();