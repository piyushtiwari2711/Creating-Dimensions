const { admin } = require("../config/firebase");
const auth = admin.auth();

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing Bearer token" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user data to request object for further use
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      fullName: decodedToken.name,
    };
    console.log(decodedToken);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = {authenticateUser};
