const mongoose = require('mongoose')

const healthLinksSchema = new mongoose.Schema({
    text: { type: String},
    URL: {type: String},
    category: {type: String},
    description: {type: String},
    is_custom_image_enabled: {type: Boolean},
    image: {type: Object},
    groups:[{type: Object}]
})

module.exports = mongoose.model('HealthLinks',healthLinksSchema)