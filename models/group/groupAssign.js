const mongoose = require('mongoose')
const GroupsAssignSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User',required: true},
    groups:[{group_id:{type: mongoose.Schema.Types.ObjectId, ref:'Groups'},
             access:{type:String,default:null},access_for_all: {type:Boolean,default:null},
             locations:[{location_id:{type: mongoose.Schema.Types.ObjectId, ref:'Locations',default:null},access:{type:String,default:null} }]
            }],
    date:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('GroupAssign', GroupsAssignSchema)