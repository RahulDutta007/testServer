const mongoose = require('mongoose')

const UASchema = new mongoose.Schema({
    statementOfUnderstanding:{
        type: String,
        default:null
    },
    registrationHelp:{
        type: String,
        default:null
    },
    date:{
        type: Date,
        default:Date.now
    }
})


module.exports = mongoose.model('uploadAdministration', UASchema)