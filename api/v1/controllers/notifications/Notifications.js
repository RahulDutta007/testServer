const NotificationModel = require("../../../../models/notifications/Notifications");
const asyncHandler = require('../../../../middleware/async');
const message = require("../../../../constants/message");

exports.getNotificationsByUserId = asyncHandler(async (req, res, next) => {
    let newNotifications, oldNotifications, allNotifications;
    const { _id } = req.user;
    const allNotificationsFilter = {
        user_id: _id
    };
    const newNotificationsFilter = {
        user_id: _id,
        new: true        
    };
    const oldNotificationsFilter = {
        user_id: _id,
        new: false      
    }    
    allNotifications = await NotificationModel.find(allNotificationsFilter);
    
    if (allNotifications.length === 0) {
        return res.status(400).json({
            message: message.get.empty
        });
    }
    
    newNotifications = await NotificationModel.find(newNotificationsFilter);
    oldNotifications = await NotificationModel.find(oldNotificationsFilter);    

    return res.status(200).json({
        message: message.get.succ,
        result: {
            allNotifications,
            newNotifications,
            oldNotifications
        }
    }); 
});

exports.setAllNotificationsAsOldByUserId = asyncHandler(async (req, res, next) => {
    let newNotifications, oldNotifications;
    const { _id } = req.user;
    const newNotificationsFilter = {
        user_id: _id,
        new: true        
    };
    const oldNotificationsFilter = {
        user_id: _id,
        new: false      
    }      
    const updateFilter = {
        user_id: _id
    };    
    
    await NotificationModel.updateMany(updateFilter, {
        new: false
    });

    oldNotifications = await NotificationModel.find(oldNotificationsFilter);
    newNotifications = await NotificationModel.find(newNotificationsFilter);

    return res.status(200).json({
        message: message.put.succ,
        result: {
            oldNotifications,
            newNotifications
        }
    }); 
});