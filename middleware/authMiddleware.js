const { verifyToken } = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new Error("No token provided");

    const encryptedToken = authHeader.split(" ")[1];
    const decoded = verifyToken(encryptedToken);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

module.exports = authMiddleware;
