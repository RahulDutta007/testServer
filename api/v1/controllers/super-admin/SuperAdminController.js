const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const replicatedUserModel = require('../../../../models/user/UserReplicated')
const ruleModel = require('../../../../models/general/Rules')
// @desc Fetch all pending user approval requests
// @route POST /api/v1/user/login
// @access Public
exports.showPendingRequests = asyncHandler(async(req, res,next)=>{
    let pendingRequest = await replicatedUserModel.find().populate('replicated_user_id');
    if(!pendingRequest) return res.status(400).json({message:"No Pending Requests Are Found"})
    return res.status(200).json({
        message:"Pending Requests are coming",
        pendingRequest
    })
})

// @desc Admin can define several rules
// @route POST /api/v1/user/login
// @access Public
exports.fillUpRules = asyncHandler(async(req, res,next)=>{
    let ruleset = await ruleModel.find()
    //console.log(ruleset.length)
    if (ruleset.length<1)
    {
        ruleset = await ruleModel.create(req.body)
        return res.json(ruleset)
    }
    else{
        let id = ruleset[0]._id
        const updatedruleset = await ruleModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        }) 
        // const updatedruleset = await ruleModel.findOneAndUpdate({_id:id}, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        return res.json(updatedruleset)
    }
    
})
// @desc Admin can update user
// @route POST /api/v1/user/login
// @access Public
exports.updateUser = asyncHandler(async(req, res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
    })

    res.status(200).json({
        message:"User updated successfully",
        data: user
    })
})


exports.ApproveMember = asyncHandler(async(req, res,next)=>{
    console.log('req.body', req.params.id);
    let item = await userModel.findById(req.params.id);
    console.log('req.user', req.user);
    //console.log('item', item);
    if(!item) return res.status(400).json({message:"No Member is Found"});
    // let del = await replicatedUserModel.deleteOne({replicated_user_id:item._id});
    let result = await userModel.findOneAndUpdate(
        {
            _id:item._id
        },
        {
            is_approved:true,
            approved_by: req.user._id
        },
        {
            new:true,runValidators:true
        }
    )
        .populate({
            path: "approved_by",
            model: userModel
        });
    //console.log('request', request);
    return res.status(200).json({
        message:`Member With Email ${item.email} Approved `,
        result
    })
})

exports.DeniedMember = asyncHandler(async(req, res,next)=>{
    let item = await userModel.findById(req.params.id);
    if(!item) return res.status(400).json({message:"No Member is Found"});
    let del = await replicatedUserModel.deleteOne({replicated_user_id:item._id});
    
    return res.status(200).json({
        message:`Member With Email ${item.email} Denied `
    })
})


exports.DeleteMember = asyncHandler(async(req, res,next)=>{
    let item = await userModel.findById(req.params.id);
    if(!item) return res.status(400).json({message:"No Member is Found"});
    let del = await replicatedUserModel.deleteOne({replicated_user_id:item._id});
    let request = await userModel.findByIdAndDelete(item._id);
    return res.status(200).json({
        message:`Member With Email ${item.email} Deleted `
    })
})

// This route will be placed in UserController
exports.RequestAgain = asyncHandler(async(req, res, next)=>{
    let item = await userModel.findById(req.params.id)
    if(!item) return res.status(400).json({message:"No Member is Found"})
    let del = await replicatedUserModel.create({replicated_user_id:item._id})
    
    return res.status(200).json({
        message:`Member With Email ${item.email} Requested `

    })
})

//localhost:4000/api/v1/super-admin/show-users?sort=first_name
//localhost:4000/api/v1/super-admin/show-users?is_active=true
//localhost:4000/api/v1/super-admin/show-users?role=Employer
//localhost:4000/api/v1/super-admin/show-users?is_active=false&role=admin
exports.filterUsers = asyncHandler(async(req, res,next)=>{
    let query;

    // copying request query
    const reqQuery = { ... req.query}
    
    // console.log(reqQuery)
    const removeFields = ['select', 'sort', 'page', 'limit']
    // loop through the array and remove each keywords from req query
    removeFields.forEach(field => delete reqQuery[field])
    let queryStr = JSON.stringify(reqQuery)
    // console.log(queryStr)
    if(reqQuery.user_name)
    {
        
        let q = reqQuery.user_name
        // console.log(reqQuery)
        reqQuery.user_name = { $regex: q};
        
        // console.log(reqQuery);

        //query = userModel.find(JSON.parse(queryStr))
        query = userModel.find(reqQuery)
        //const users = await query
        
    }
    else{
        query = userModel.find(JSON.parse(queryStr))
    }
    
    if(req.query.select)
    {
        // we need to use userModel.find().select('name description') this notation
        const fields = req.query.select.split(',').join(' ')
        //console.log(fields)
        // appending .select with existing query if select clause is present in query param
        query.select(fields)
    }
    if(req.query.sort)
    {
        //console.log(query)
        const sortBy = req.query.sort.split(',').join(' ')
        query.sort(sortBy)
    }
    const users = await query
    
    res.status(200).json({
        success: true,
        count: users.length,
        result: users
    })
})

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}