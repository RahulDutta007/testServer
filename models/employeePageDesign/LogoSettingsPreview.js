const mongoose = require("mongoose");

const logo_settings_preview = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups"        
    },
    logo: {
        attachment: {
            type: Object,
            default: null
        },
        xl: {
            height: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        lg: {
            height: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        md: {
            height: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        sm: {
            height: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        xs: {
            height: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
    },
    favicon: {
        type: Object,
        default: null
    }
});

const LogoSettingsPreviewModel = mongoose.model("logo_settings_preview", logo_settings_preview);

module.exports = LogoSettingsPreviewModel;