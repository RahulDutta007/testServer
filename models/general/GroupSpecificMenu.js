const mongoose = require('mongoose')

const group_specific_menu = new mongoose.Schema({
    group_number:{type: String},
    access:{
        role:{type:String},
        menus:[{
            name:{type: String},
            visibility:{type: Boolean},
            submenus:[{
                name:{type: String},
                visibility:{type: Boolean},
                components:[{
                    name:{type: String},
                    visibility:{type: Boolean}
                }]
            }]
        }]

    }
    
})

module.exports = mongoose.model('group_specific_menu', group_specific_menu)