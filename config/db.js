const mongoose = require('mongoose')
const connectDb = async ()=>{
    var conn = await mongoose.connect(process.env.MONGODB_CLOUD_URI || process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)

}
module.exports = connectDb

