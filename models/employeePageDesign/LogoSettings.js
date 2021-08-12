const mongoose = require("mongoose");

const logo_settings = new mongoose.Schema({
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

const LogoSettings = mongoose.model("logo_settings", logo_settings);

module.exports = LogoSettings;