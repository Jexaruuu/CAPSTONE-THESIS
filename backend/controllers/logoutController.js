const logout = (req, res) => {
    if (req.session.user) {
        delete req.session.user; // 🔥 Only remove the user part
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
};


module.exports = { logout };
