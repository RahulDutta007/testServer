const asyncHandler = require("../../../../middleware/async");
const LogoSettings = require("../../../../models/employeePageDesign/LogoSettings");
const message = require("../../../../constants/message");

exports.addLogoSettings = asyncHandler(async(req, res, next) => {
    const { group_id } = req.body;
    let data, result, payload = JSON.parse(req.body.logo_settings);

    console.log('payload', payload)
    data = await LogoSettings.findOne({ 
        group_id 
    });

    if (data) {
        return res.json({
            message: message.post.sameEntry
        });
    }    
    
    if(req.files) {
        if(req.files.logo_attachment) {
            payload["logo"]["attachment"] = req.files.logo_attachment[0];
        }
        if(req.files.favicon) {
            payload["favicon"] = req.files.favicon[0];
        }
    }    
    
    data = new LogoSettings(payload);
    data = await data.save();
    result = await LogoSettings.findById(data._id);

    return res.status(200).json({
        message: message.post.succ,
        result
    });
});

exports.editLogoSettings = asyncHandler(async (req, res, next) => {    
    let data, result, payload = JSON.parse(req.body.logo_settings);
    console.log('payload', payload)
    const { _id } = payload;
    data = await LogoSettings.findOne({ _id });
    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }
    if(req.files) {
        if (req.files.logo_attachment && req.files.logo_attachment[0]) {
            payload["logo"]["attachment"] = req.files.logo_attachment[0];
        }    
        if (req.files.favicon && req.files.favicon[0]) {
            payload["favicon"] = req.files.favicon[0];
        }
    }

    result = await LogoSettings.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true
    });
    console.log('result', result);
    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

exports.getLogoSettings = asyncHandler(async (req, res, next) => {
    let result;
    result = await LogoSettings.find();        
    
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

exports.getLogoSettingsByGroupId = asyncHandler(async (req, res, next) => {
    const { group_id } = req.params;
    let result, count;
    const filter = { group_id };    
    count = await LogoSettings.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await LogoSettings.findOne({
        group_id
    })
            
    if(!result) {
        return res.json({
            message: message.get.fail,                        
        });
    }

    return res.status(200).json({
        message: message.get.succ,
        result
    });
});
