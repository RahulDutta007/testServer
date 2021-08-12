const mongoose = require('mongoose')

const UserDefaultMenu = new mongoose.Schema({
    
    role:{type: String},
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
    
    
})

module.exports = mongoose.model('user_default_menu', UserDefaultMenu)