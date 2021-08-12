const mongoose = require("mongoose");

const employee_page_design = new mongoose.Schema({
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

const EmployeePageDesign = mongoose.model("employee_page_design", employee_page_design);

module.exports = EmployeePageDesign;
