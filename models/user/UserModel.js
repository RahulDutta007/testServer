const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userReplicated = require('./UserReplicated')
const uniqueValidator = require('mongoose-unique-validator');
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        //required:[true, 'Please add a first name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    last_name: {
        type: String, 
        // required:[true, 'Please add a last name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    user_name:{
        type: String,
        unique: [true, 'Username already taken'],
        required:[true, 'Please add Username']
    },
    password: {
        type: String,
        required:[true, 'Please provide a password']
    },
    role: {
        type: String,
        
    },
    email: {
        type: String,
        unique: true,
        //required:[true, 'Please provide a password'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    
    middle_name: {
        type: String,
        
    },
    SSN: {
        type: String,
        //required:[true, 'Please provide a SSN']
    },
    date_of_birth: {
        type: String,
        //required:[true, 'Please provide a date of birth']
    },
    gender: {
        type: String,
        //required:[true, 'Please provide a gender']
    },
    city: {
        type: String,
        
    },
    zip: {
        type: String,
        //required:[true, 'Please provide a zip code']
    },
    address_line_1: {
        type: String,
        //required:[true, 'Please provide a address']
    },
    address_line_2: {
        type: String,
       
    },
    mobile: {
        type: String
       
    },
    alternate_id: {
        type: String
    },
    employee_id: {
        type: String
    },
    state: {
        type: String
    },
    is_verified: {
        type: Boolean,
    },
    is_locked_out: {
        type: Boolean,
    },
    is_active: {
        type: Boolean,
    },
    is_inactive: {
        type: Boolean,
    },
    is_online: {
        type: Boolean,
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId, ref:'User',
        default: null
    },
    is_approved: {
        type:Boolean,
        default:false
    },
    group_id: {
        type: String,
    },
    security_question:{
        type: String,
    },
    security_answer:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    last_login_date:{
        type: Date,
        default: Date.now
    },
    is_member_support:{
        type:Boolean,
        default:false
    },
    is_employer_support:{
        type:Boolean,
        default:false
    },
    claim_notification:{
        type:Boolean
    }
})

UserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next()
    try {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
      const replicatedUserCreated = await userReplicated.create({replicated_user_id: this._id}) 
      console.log(replicatedUserCreated)
      return next()
    } catch (err) {
      return next(err)
    }
  })

  UserSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })
//   UserSchema.post('save', function(error, doc, next) {
//       console.log(this._id)
//       console.log(doc)
//     if (error.name === 'MongoError' && error.code === 11000) {
//       next(new Error('Username is taken'));
//     } else {
//       next(error);
//     }
//   })
//   UserSchema.pre('save', async function(next){
//     console.log(this._id)
//     try {
//             //console.log(doc._id)
//             console.log("post save")
//             const replicatedUserCreated = await userReplicated.create1({replicated_user_id: this._id12}) 
//         } catch (error) {
//             next(new Error(error.message)) 
//         }  
//   })

UserSchema.pre('findOneAndUpdate', async function() {
    try {
        const docToUpdate = await this.model.findOne(this.getQuery());
        await userReplicated.deleteOne({replicated_user_id:docToUpdate._id})
    } catch (error) {
        next(new Error(error.message)) 
    }
  });

module.exports = mongoose.model('User', UserSchema)