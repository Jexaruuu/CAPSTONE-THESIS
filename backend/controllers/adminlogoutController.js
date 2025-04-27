// controllers/adminlogoutController.js
const adminLogout = (req, res) => {
    if (req.session.admin) {
        delete req.session.admin; // 🔥 Only remove the admin part
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Admin logged out successfully." });
};

module.exports = { adminLogout };
