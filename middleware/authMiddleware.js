const jwt = require("jsonwebtoken");

exports.ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        // Clear session and redirect if no token is found
        req.session = null;
        res.clearCookie("jwt", { httpOnly: true, secure: false });
        return res.redirect("/account/login");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        
        // Clear invalid token and session
        res.clearCookie("jwt", { httpOnly: true, secure: false });
        req.session = null;

        return res.redirect("/account/login");
    }
};

// Middleware to restrict access to admin users
exports.authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
