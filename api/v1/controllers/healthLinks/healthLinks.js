const asyncHandler = require('../../../../middleware/async')
const Group = require('../../../../models/group/group')
const HealthLink = require('../../../../models/healthLinks/healthLinks')
const message = require("../../../../constants/message");
const { gfs } = require("../../../../config/Multer");

exports.addHealthLink = asyncHandler(async(req,res,next)=>{    
    let payload = JSON.parse(req.body.health_link);    
    console.log('payload', payload)
    if(req.files && req.files.image) {
        payload["image"] = req.files.image[0];
    };    

    let data =  new HealthLink(payload);
    data = await data.save();    
    return res.send({message: message.post.succ, status:200, result: data});
});

exports.editHealthLink = asyncHandler(async (req, res, next) => {
    let data, result, payload = JSON.parse(req.body.health_link);
    console.log('payload', payload)
    const { _id } = payload;
    data = await HealthLink.findOne({ _id });
    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }
    if(req.files && req.files.image && req.files.image[0]) {
        payload["image"] = req.files.image[0];
    }

    result = await HealthLink.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

exports.getHealthLinks = asyncHandler(async(req, res, next) => {
    let result;
    result = await HealthLink.find();
    
    if (!result) {
        return res.status(400).json({
            message: message.get.empty
        });
    }

    return res.status(200).json({
        message: message.get.succ,
        result
    }); 
});

exports.deleteHealthLinkById = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    let data, result;

    data = await HealthLink.findOne({ _id });

    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }

    await HealthLink.deleteOne({ _id });
    result = await HealthLink.find();
    return res.status(200).json({
        message: message.delete.succ,
        result
    });
});

exports.getHealthLinkByGroupId = asyncHandler(async(req, res, next) => {
    const { group_id } = req.params;
    let result, data;
    
    data = await HealthLink.aggregate([        
        {
            $unwind: "$groups"
        }, 
        {
            $match: {
                "groups._id": group_id
            }
        }, 
        {
            $project: {
                _id: "$_id",                
            }
        },
    ]);

    if (data.length === 0) {
        return res.status(200).json({
            message: message.get.e,
            result: false
        });            
    }

    const filter = {
        "groups": {
            $elemMatch: {
                _id: group_id
            }
        } 
    }

    result = await HealthLink.find(filter);
    
    return res.status(200).json({
        message: message.get.succ,
        result
    });    
});