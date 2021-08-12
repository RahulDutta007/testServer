const mongoose = require('mongoose')

const Rules = new mongoose.Schema({
    is_stop_members:{
        type: Boolean,
        default:false
    },
    is_auto_approval_member_off:{
        type: Boolean,
        default:false
    }
})

// Rules.pre('findOneAndUpdate', async function save(next) {
//     console.log('Inside pre update')
//     const docToUpdate = await this.model.findOne(this.getQuery());
//     console.log(docToUpdate._id)
//   })
module.exports = mongoose.model('rule', Rules)