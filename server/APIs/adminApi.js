// const exp=require('express')
// const adminApp=exp.Router();

// //API
// adminApp.get("/",(req,res)=>{
//     res.send({message:"from admin api"})
// })

// module.exports=adminApp;

const express = require('express');
const router = express.Router();
const UserAuthor = require('../models/userAuthorModel');

// Middleware to check if the logged-in user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const admin = await UserAuthor.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

// GET all Users & Authors
router.get('/all-users', isAdmin, async (req, res) => {
    try {
        const users = await UserAuthor.find({ role: { $ne: 'admin' } }, '-password'); // Exclude admins
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users." });
    }
});

// Enable or Disable Users/Authors
router.put('/block-user/:id', isAdmin, async (req, res) => {
    try {
        const user = await UserAuthor.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();
        
        res.json({ message: `User is now ${user.status}.` });
    } catch (error) {
        res.status(500).json({ message: "Error updating user status." });
    }
});

module.exports = router;

