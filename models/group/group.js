const mongoose = require('mongoose')
const GroupsSchema = new mongoose.Schema({
    group_no: {type: String,required:true},
    group_name:{type:String},
    address_1:{type:String},
    address_2:{type:String},
    state:{type:String},
    city:{type:String},
    zip:{type:String},
    country:{type:String},    
    date:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Groups', GroupsSchema)