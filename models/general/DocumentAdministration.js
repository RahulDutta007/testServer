const mongoose = require('mongoose')
// doc administration schema
const document_admininstration = new mongoose.Schema({
    path:{type: String},
    is_file:{type: Boolean},
    par_id:{type: mongoose.Schema.Types.ObjectId},
    identification_name:{type: String},
    children:[{
        id:{type: mongoose.Schema.Types.ObjectId},
        identification_name:{type: String},
        is_file:{type: Boolean},
    }]

})

module.exports = mongoose.model('document_administration', document_administration)