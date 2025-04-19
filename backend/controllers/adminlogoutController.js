// controllers/adminlogoutController.js
const adminLogout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying admin session:", err);
        return res.status(500).json({ message: "Failed to logout admin." });
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      return res.status(200).json({ message: "Admin logged out successfully." });
    });
  };
  
  module.exports = { adminLogout };
  