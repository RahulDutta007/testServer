const express = require('express');
const router = express.Router();
const auth = require("../../../../middleware/userDetails");

const { 
    setAllNotificationsAsOldByUserId,
    getNotificationsByUserId 
} = require('../../controllers/notifications/Notifications');

router.route("/")
    .get(auth, getNotificationsByUserId)
    .put(auth, setAllNotificationsAsOldByUserId);

module.exports = router;

