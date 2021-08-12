const asyncHandler = require("../../../../middleware/async");
const Location = require('../../../../models/group/locations');
const Group = require('../../../../models/group/group')
const GroupAssign = require('../../../../models/group/groupAssign')



/*
localhost:4000/api/v1/admin/location [post]
{
    "location_name":"BBI Dallas",
    "location_address":"Dallas",
    "group_id":"60678c5f27cbbf287cc1a2e8",
    "location_id":"7654",
    "location_zip":"12345"
}
*/
exports.addLocation = asyncHandler(async(req,res,next)=>{
    let data = new Location(req.body)
    data = await data.save();

    return res.send({text:"Added",status:200,data});
})

//localhost:4000/api/v1/admin/location [get]
exports.viewAllLocationDetails = asyncHandler(async(req,res,next)=>{
    let data = await Location.find().populate("group_id");
    return res.send({text:"Found",status:200,data});
})

// localhost:4000/api/v1/admin/location/by-group/:grpModelId [get]
exports.viewLocationByGroup = asyncHandler(async(req,res,next)=>{
    // console.log(req.params.grp_id);
    let data = await Location.find({group_id:req.params.grp_id}).populate("group_id");
    return res.send({text:"Found",status:200,data});
})

// localhost:4000/api/v1/admin/location/update/:locationModelId [put]
exports.updateLocation = asyncHandler(async(req,res,next)=>{
    let data = await Location.findByIdAndUpdate(req.params.id,req.body);
    return res.send({text:"Updated",status:200,data});
})




