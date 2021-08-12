const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const GroupAssign = require('../../../../models/group/groupAssign')
const Group = require('../../../../models/group/group')
// const auth = require('../../../../middleware/userDetails')


exports.testDetails = asyncHandler(async(req, res,next)=>{
    // let a = auth(req,res,next);
    let info = req.user ? req.user: "no_data";

    return res.send({text:"Found",status:200,data:info});
    
})