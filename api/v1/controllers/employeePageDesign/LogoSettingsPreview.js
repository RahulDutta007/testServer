const asyncHandler = require("../../../../middleware/async");
const LogoSettingsPreviewModel = require("../../../../models/employeePageDesign/LogoSettingsPreview");
const message = require("../../../../constants/message");

exports.addLogoSettings = asyncHandler(async(req, res, next) => {
    let data, result, payload = JSON.parse(req.body.logo_settings);
    const filter = { 
        user_id: req.user._id, 
        group_id: payload.group_id
    };
    console.log(`filter`, filter)
    data = await LogoSettingsPreviewModel.findOne(filter);

    if (data) {
        return res.json({
            message: message.post.sameEntry
        });
    }    
    console.log(`data`, data);
    if(req.files) {
        if(req.files.logo_attachment) {
            payload["logo"]["attachment"] = req.files.logo_attachment[0];
        }
        if(req.files.favicon) {
            payload["favicon"] = req.files.favicon[0];
        }
    }

    data = new LogoSettingsPreviewModel({
        user_id: req.user._id,
        ...payload,
    });
    data = await data.save();
    result = await LogoSettingsPreviewModel.findById(data._id);

    return res.status(200).json({
        message: message.post.succ,
        result
    });
});

exports.editLogoSettings = asyncHandler(async (req, res, next) => {    
    let data, result, payload = JSON.parse(req.body.logo_settings);
    const { group_id } = payload;
    const { _id } = req.user;
    const filter = {
        group_id,
        user_id: _id
    }

    data = await LogoSettingsPreviewModel.findOne(filter);
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

    result = await LogoSettingsPreviewModel.findOneAndUpdate(filter, payload, {
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
    console.log('object')
    result = await LogoSettingsPreviewModel.find();        
    
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
    count = await LogoSettingsPreviewModel.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await LogoSettingsPreviewModel.findOne(filter)
            
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

exports.getLogoSettingsByUserId = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    let result, count;
    const filter = { user_id };    
    count = await LogoSettingsPreviewModel.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await LogoSettingsPreviewModel.findOne(filter)
            
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

exports.getLogoSettingsByUserIdAndGroupId = asyncHandler(async (req, res, next) => {
    const { user_id, group_id } = req.query;
    let result, count;
    const filter = { user_id, group_id };     
    count = await LogoSettingsPreviewModel.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await LogoSettingsPreviewModel.findOne(filter);
    
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

exports.deleteLogoSettingsByUserIdAndGroupId = asyncHandler(async (req, res, next) => {
    const {  group_id } = req.query;
    const { _id } = req.user;
    const filter = {
        group_id,
        user_id: _id
    };

    data = await LogoSettingsPreviewModel.findOne(filter);
    
    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }

    await LogoSettingsPreviewModel.deleteOne(filter);

    return res.status(200).json({
        message: message.delete.succ
    });
});

exports.deleteLogoSettingsByUserId = asyncHandler(async (req, res, next) => {    
    let count, data;
    const { _id } = req.user;
    const filter = {        
        user_id: _id
    };

    count = await LogoSettingsPreviewModel.count(filter);
    
    if (count === 0) {
        return res.status(200).json({
            message: message.none
        });
    }

    await LogoSettingsPreviewModel.deleteOne(filter);

    return res.status(200).json({
        message: message.delete.succ
    });
})
