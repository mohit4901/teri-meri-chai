import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Admin Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied. Admin Only." });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid Admin Token" });
  }
};

export default adminAuth;
