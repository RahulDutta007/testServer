const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const GroupAssign = require('../../../../models/group/groupAssign')
const Group = require('../../../../models/group/group')
const Location = require('../../../../models/group/locations')


// @desc add all Menus with user type 
// @route /api/v1/super-admin/assign-group/
// @access Public POST

exports.addGroupAssign = asyncHandler(async(req, res,next)=>{

    let locations = await Location.find();
    let groups = await Group.find();
    group_info = {};
    // console.log(assigned_locations_info);
    for (let i = 0; i < groups.length; i++) {
        group_info[groups[i]._id] = {_id:groups[i]._id,locations:[]};
        for(let j=0;j<locations.length;j++){
            if((groups[i]._id).toString() == (locations[j].group_id).toString()){
                let info = {
                    _id:locations[j]._id,
                    location_id:locations[j].location_id,
                    location_name:locations[j].location_name
                }
                group_info[groups[i]._id].locations.push(info);
            }
        }
    }

    for (let i = 0; i < req.body.groups.length; i++) {
        if(req.body.groups[i].locations.length == 0){
            for (let j = 0; j < group_info[req.body.groups[i].group_id].locations.length; j++) {
                req.body.groups[i].locations.push({
                    location_id: group_info[req.body.groups[i].group_id].locations[j]._id,
                    access:req.body.groups[i].access
                }) 
                
            }
        }
        
    }
    
    let data = new GroupAssign(req.body)
    data = await data.save();

    return res.send({text:"Added",status:200,data});
    
})
// @desc add all Menus with user type 
// @route /api/v1/super-admin/assign-group/
// @access Public GET
exports.AllGroupAssign = asyncHandler(async(req, res,next)=>{

    let data = await GroupAssign.find().populate('groups.group_id');

    return res.send({text:"Found",status:200,data});
    
})
// @desc add all Menus with user type 
// @route /api/v1/super-admin/assign-group/:user_id
// @access Public PUT
// {"groups":["6067873417b36b2548448505", "60678c5f27cbbf287cc1a2e8"]} //pass all items (previous+new)

exports.UserGroupAssign = asyncHandler(async(req, res,next)=>{
    // console.log("k");
    let data = await GroupAssign.findOne({user_id:req.params.user_id});

    return res.send({text:"Found",status:200,data});
    
})

exports.UpdateGroupAssign = asyncHandler(async(req, res,next)=>{
    // console.log('req.body', req.body)
    let user  = await GroupAssign.findOne({user_id:req.body.user_id});
    let locations = await Location.find();
        let groups = await Group.find();
        group_info = {};
        // console.log(assigned_locations_info);
        for (let i = 0; i < groups.length; i++) {
            group_info[groups[i]._id] = {_id:groups[i]._id,locations:[]};
            for(let j=0;j<locations.length;j++){
                if((groups[i]._id).toString() == (locations[j].group_id).toString()){
                    let info = {
                        _id:locations[j]._id,
                        location_id:locations[j].location_id,
                        location_name:locations[j].location_name
                    }
                    group_info[groups[i]._id].locations.push(info);
                }
            }
        }
        for (let i = 0; i < req.body.groups.length; i++) {
            if(req.body.groups[i].locations.length == 0){
                if(req.body.groups[i].access_for_all){
                    for (let j = 0; j < group_info[req.body.groups[i].group_id].locations.length; j++) {
                        req.body.groups[i].locations.push({
                            location_id: group_info[req.body.groups[i].group_id].locations[j]._id,
                            access:req.body.groups[i].access
                        }) 
                        
                    }
                }
            }
            
        }
        
    if(!user){
        // console.log(user);
        let data = new GroupAssign(req.body)
        data = await data.save();

        return res.send({text:"Added",status:200,data});
    }
    if(user){
        let data = await GroupAssign.findByIdAndUpdate(user._id,{groups:req.body.groups});
        return res.send({text:"Updated",status:200});
    }

    
    
})


exports.checkByGroupOrLocation = asyncHandler(async(req, res,next)=>{
    let query = null;
    // console.log("h");
    if(req.params.level == "location") query = {'groups.locations.location_id':req.params.id};
    if(req.params.level == "group") query = {'groups.group_id':req.params.id};
    if(query == null ) return res.send({text:"Invalid Level",status:200});

    let data =  await GroupAssign.find(query).populate('user_id');
    // let info = await 
    return res.send({text:"Found Successfully",data:data,status:200});
})


exports.DeleteGroupAssign = asyncHandler(async(req, res,next)=>{

    let data = await GroupAssign.findByIdAndDelete(req.params.id)

    return res.send({text:"Deleted",status:200});
    
})

exports.GroupInfoUser = asyncHandler(async(req,res,next)=>{
    let unassigned_groups = [],assigned_groups = [];
    let assigned = await GroupAssign.findOne({user_id:req.params.id});
    // if(!assigned) return res.send({text:"Not Found",status:400})
    
    let locations = await Location.find();
    let groups = await Group.find();
    group_info = {};
    // console.log(assigned_locations_info);
    for (let i = 0; i < groups.length; i++) {
        group_info[groups[i]._id] = {_id:groups[i]._id,locations:[]};
        for(let j=0;j<locations.length;j++){
            if((groups[i]._id).toString() == (locations[j].group_id).toString()){
                let info = {
                    _id:locations[j]._id,
                    location_id:locations[j].location_id,
                    location_name:locations[j].location_name
                }
                group_info[groups[i]._id].locations.push(info);
            }
        }
    }
    // if not found
    if(!assigned){
        for (let j = 0; j < groups.length; j++) {
            let info = {
                _id:groups[j]._id,
                group_no:groups[j].group_no,
                group_name:groups[j].group_name,
                unassigned_locations:group_info[groups[j]._id].locations
            }
            unassigned_groups.push(info);
            
        }
        if(!assigned) return res.send({text:"Not Found",status:200,data:{unassigned_groups:unassigned_groups}})
    }
    let assigned_groups_info = assigned.groups;
    let assigned_locations_info = [];
    for (let i = 0; i < assigned_groups_info.length; i++) {
        for (let j = 0; j < assigned_groups_info[i].locations.length; j++) {
            assigned_locations_info.push(assigned_groups_info[i].locations[j].location_id);
        }
    }
    
    if(assigned_groups_info.length ==0){
        for (let j = 0; j < groups.length; j++) {
            let info = {
                _id:groups[j]._id,
                group_no:groups[j].group_no,
                group_name:groups[j].group_name,
                unassigned_locations:group_info[groups[j]._id].locations
            }
            unassigned_groups.push(info);
            
        }
        return res.send({text:"Found",status:200,data:{user_id:req.params.id,unassigned_groups:unassigned_groups,assigned_groups:[]}})
    }
    // console.log(assigned_locations_info);
    
    let inserted_grp_ids = [];
    for (let i = 0; i < assigned_groups_info.length; i++) {
        for (let j = 0; j < groups.length; j++) {
            if((groups[j]._id).toString() == (assigned_groups_info[i].group_id).toString()){
                inserted_grp_ids.push((assigned_groups_info[i].group_id).toString());
                let info = {
                    _id:groups[j]._id,
                    group_no:groups[j].group_no,
                    group_name:groups[j].group_name,
                    assigned_locations:[],
                    unassigned_locations:[]
                }
                let inserted_loc_ids = [];
                for (let l = 0; l < assigned_locations_info.length; l++) {
                    for (let k = 0; k < group_info[groups[j]._id].locations.length; k++) {
                        if((assigned_locations_info[l]).toString() == (group_info[groups[j]._id].locations[k]._id).toString()){
                            inserted_loc_ids.push(group_info[groups[j]._id].locations[k]._id);
                            info.assigned_locations.push(group_info[groups[j]._id].locations[k]); 
                        }
                    }
                    
                    
                } //end of location for
                for (let k = 0; k < group_info[groups[j]._id].locations.length; k++) {
                    // if((assigned_locations_info[l]).toString() != (group_info[groups[j]._id].locations[k]._id).toString()){
                        if(inserted_loc_ids.indexOf(group_info[groups[j]._id].locations[k]._id) == -1)
                            info.unassigned_locations.push(group_info[groups[j]._id].locations[k]); 
                    // }
                }
                
                assigned_groups.push(info);
            }// end of groups checking for loop
        }//end of groups for loop
    }
    // console.log(inserted_grp_ids);
    for (let j = 0; j < groups.length; j++) {
        // console.log(inserted_grp_ids.indexOf((groups[j]._id).toString()) );
        if(inserted_grp_ids.indexOf((groups[j]._id).toString()) == -1){
            let info = {
                _id:groups[j]._id,
                group_no:groups[j].group_no,
                group_name:groups[j].group_name,
                unassigned_locations:group_info[groups[j]._id].locations
            }
            unassigned_groups.push(info);
        }
        
    }
    
    res.send({text:"found",status:200,data:{user_id:req.params.id,assigned_groups:assigned_groups,unassigned_groups:unassigned_groups}})
})