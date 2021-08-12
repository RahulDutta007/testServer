const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const ErrorResponse = require('../../../../utils/errorResponse')
const jwt = require('jsonwebtoken') 
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
// @desc User Forget Password (request token)
// @route POST /api/v1/user/request-token
// @access Public

exports.GetToken = asyncHandler(async(req, res, next)=>{
    
    let user = await userModel.findOne(req.body.credential.includes('@') ? {email:req.body.credential} : {user_name:req.body.credential});
    if(!user) return res.json({status:404,text:`No Member Found With Mail: ${req.body.credential}`});

    let payload = {_id:user._id,expireDate: new Date().getTime() + 15 * 60 * 1000};
    let token = jwt.sign(payload,process.env.password_Secret);

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"arnab1744.cs@gmail.com",
            pass:"ciliythhlrbwaecn"
        },
      });
      let link;
    if(process.env.NODE_ENV == "development") link = "http://localhost:3000/api/v1"
    if(process.env.NODE_ENV == "production") link = "http://localhost:3000/api/v1"
    let info = await transporter.sendMail({
        from: '"Nexcaliber " <arnab1744.cs@gmail.com>',
        to: user.email, // list of receivers // use comma for multiple accounts
        subject: "Reset Password", // Subject line
        html: `<a href="${link}/forget-password/verify-token/${token}" target="_blank" > Click Here Re-new Password within 15 minute </a> <p>${link}/forget-password/verify-token/${token}</p>`, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    return res.status(200).json({status:200,text:`Member Found With Mail: ${user.email} and massage had been sent with token`,token});
})

// @desc User Forget Password (verify token and reset password)
// @route POST /api/v1/forget-password/verify-token/:token
// @access Public
exports.verifyToken = asyncHandler(async(req, res, next)=>{
    let token = await jwt.verify(req.params.token,process.env.password_Secret);
    let timeCheck = new Date(token.expireDate) > new Date();
    if(timeCheck){
        let user = await userModel.findById(token._id);
        if(!user) return res.json({status:404,text:`No Member Found `});
        const salt = await bcrypt.genSalt(10)
        let password = await bcrypt.hash(req.body.password, salt)
        user = await userModel.findByIdAndUpdate(token._id,{password:password});
        return res.json({status:200,token,isAccess:timeCheck,text:"Password Updated"});
    }
    

})

 