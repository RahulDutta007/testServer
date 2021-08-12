const mongoose = require("mongoose");

const employee_page_design_preview = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"        
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups"        
    },
    primary_color: {
        type: String,
        default: null
    },
    button: {
        background_color: {
            type: String,
            default: null
        },
        color: {
            type: String,
            default: null
        }
    },
    top_bar: {
        background_color: {
            type: String,
            default: null
        },
        color: {
            type: String,
            default: null
        }
    }
});

const EmployeePageDesignModel = mongoose.model("employee_page_design_preview", employee_page_design_preview);

module.exports = EmployeePageDesignModel;