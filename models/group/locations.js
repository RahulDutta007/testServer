const mongoose = require('mongoose')
const locationSchema = new mongoose.Schema({
    group_id: {type: mongoose.Schema.Types.ObjectId, ref:'Groups',required: true},
    location_name :{type:String,required:true},
    location_id:{type:String,required:true},
    location_address:{type:String},
    location_zip:{type:String},
    location_email:{type:String},
    location_state:{type:String},
    location_country:{type:String,default:"United State (US)"},
    date:{type: Date,default: Date.now}
})
module.exports = mongoose.model('locations', locationSchema)