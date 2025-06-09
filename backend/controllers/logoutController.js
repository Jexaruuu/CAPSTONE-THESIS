const logout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;  // ✅ Only delete user part
    }
    return res.status(200).json({ message: "Logout successful" });
};

module.exports = { logout };