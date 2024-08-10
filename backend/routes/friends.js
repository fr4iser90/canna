import express from "express";
import * as friendsController from "../controllers/friendsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

// Attach the user database connection
router.use(attachDbConnection("userDb"));
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Friends Management Routes
router.post('/search', authenticateToken, friendsController.searchFriends);
router.post('/invite', authenticateToken, friendsController.inviteFriend);
router.get('/requests', authenticateToken, friendsController.getFriendRequests);
router.post('/requests/:action', authenticateToken, friendsController.handleFriendRequest);
router.get('/', authenticateToken, friendsController.getFriends);
router.delete('/:friendId', authenticateToken, friendsController.deleteFriend);
router.post('/block', authenticateToken, friendsController.blockFriend);
router.get('/blocked', authenticateToken, friendsController.getBlockedUsers);
router.post('/unblock', authenticateToken, friendsController.unblockUser);

export default router;
