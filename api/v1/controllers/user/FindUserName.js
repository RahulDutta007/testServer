const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const ErrorResponse = require('../../../../utils/errorResponse')
const nodemailer = require("nodemailer");

// @desc User Forget Username
// @route POST /api/v1/user/forget-username
// @access Public
exports.GetUserName = asyncHandler(async(req, res, next)=>{
    
        let user = await userModel.findOne({email:req.body.email});
        if(!user) return res.json({status:404,text:`No Member Found With Mail: ${req.body.email} `});

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:"arnab1744.cs@gmail.com",
                pass:"ciliythhlrbwaecn"
            },
          });
          
          let info = await transporter.sendMail({
            from: '"Nexcaliber" <cbiswas@gbtechservice.com>', // sender address
            to: user.email, // list of receivers // use comma for multiple accounts
            subject: "Nexcaliber Username", // Subject line
            html: `<p>Your Username is: ${user.user_name} </p>`, // html body
        });
       
        return res.json({status:200,username:user.user_name});
    
    

})