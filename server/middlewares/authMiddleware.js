const UserAuthor = require('../models/userAuthorModel');

const authMiddleware = async (req, res, next) => {
    try {
        const user = await UserAuthor.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }
        if (user.status === 'blocked') {
            return res.status(403).json({ message: "Your account is blocked. Please contact admin." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Authentication error." });
    }
};

module.exports = authMiddleware;
