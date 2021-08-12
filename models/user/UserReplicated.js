const mongoose = require('mongoose')
const UserReplicatedSchema = new mongoose.Schema({
    replicated_user_id: {
        type: mongoose.Schema.Types.ObjectId, ref:'User',
    },
    date:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('ReplicatedUser', UserReplicatedSchema)