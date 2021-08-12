const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    text: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        enum: ["approval", "sign_up"],        
    },
    url: {
        type: String,
        default: null,
    },
    new: {
        type: Boolean,
        default: false,
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

const NotificationModel = mongoose.model("notification", NotificationSchema);
module.exports = NotificationModel;