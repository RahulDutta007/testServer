const asyncHandler = require('../../../../middleware/async')
const Group = require('../../../../models/group/group')
// @desc add all Menus with user type 
// @route /api/v1/super-admin/group/add-group
// @access Public POST
// {
//     "group_no":"182",
//     "group_name":"TB",
//     "city":"Kol",
//     "state":"Kol",
//     "country":"Kol",
//     "address_2":"Kol",
//     "address_1":"Kol"
// }

exports.addGroup = asyncHandler(async(req, res,next)=>{

    let data = new Group(req.body)
    data = await data.save();

    return res.send({text:"Added",status:200,data});
    
})

// @desc add all Menus with user type 
// @route /api/v1/super-admin/group/all-group
// @access Public GET
exports.AllGroup = asyncHandler(async(req, res,next)=>{

    let data = await Group.find()

    return res.send({text:"Found",status:200,data});
    
})

// @route /api/v1/super-admin/group/update-group/:mongo_id
// @access Public put
exports.UpdateGroup = asyncHandler(async(req, res,next)=>{

    let data = await Group.findByIdAndUpdate(req.params.id,req.body);

    return res.send({text:"Updated",status:200});
    
})

// @desc add all Menus with user type 
// @route /api/v1/super-admin//group/delete-group/6067889778c6793d2445e5bb [mongoose id]
// @access Public delete
exports.DeleteGroup = asyncHandler(async(req, res,next)=>{

    let data = await Group.findByIdAndDelete(req.params.id)

    return res.send({text:"Deleted",status:200});
    
})