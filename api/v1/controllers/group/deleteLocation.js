const asyncHandler = require("../../../../middleware/async");
const Location = require('../../../../models/group/locations');
const Group = require('../../../../models/group/group')
const GroupAssign = require('../../../../models/group/groupAssign');
const { findByIdAndUpdate } = require("../../../../models/group/groupAssign");


exports.deleteLocation = asyncHandler(async(req,res,next)=>{
    // console.log(req.params.id);
    let del = await Location.findByIdAndDelete(req.params.id);
    let items = await GroupAssign.find({'groups.locations.location_id':req.params.id});
    // let del_location = await GroupAssign.updateMany( {'groups.locations.location_id':req.params.id}, { $pull: {'location_id': req.params.id } } )
    // del_location.groups.locations.pull({location_id:req.params.id});
    // await del_location.save();
    // let del_location = await GroupAssign.update( // select your doc in moongo
    //      {'groups.locations.location_id':req.params.id}, // your query, usually match by _id
    //     { $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } }, // item(s) to match from array you want to pull/remove
    //     { multi: true } // set this to true if you want to remove multiple elements.
    // )
    for(let i=0;i<items.length;i++){
        let groups = items[i].groups;
        let itemId = items[i]._id;
        for (let j = 0; j < groups.length; j++) {
            let locations = items[i].groups[j].locations;
            let groupId = items[i].groups[j]._id;
            for (let k = 0; k < locations.length; k++) {
                if(locations[k].location_id == req.params.id){
                    locations.splice(k,1);
                    await GroupAssign.findByIdAndUpdate(itemId,items[i]);
                }
                
            }
            
        }
    }

    

    return res.send({text:"Location from Database and Group Assign Successfully Deleted.  ",status:200});
})