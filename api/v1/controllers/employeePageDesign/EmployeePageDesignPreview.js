const asyncHandler = require("../../../../middleware/async");
const EmployeePageDesignPreview = require("../../../../models/employeePageDesign/EmployeePageDesignPreview");
const Group = require('../../../../models/group/group');
const message = require("../../../../constants/message");

exports.addThemeColor = asyncHandler(async (req, res, next) => {    
    let data, result;
    const filter = { 
        user_id: req.user._id, 
        group_id: req.body.group_id
    };
    
    data = await EmployeePageDesignPreview.findOne(filter);    
    if (data) {
        return res.json({
            message: message.post.sameEntry
        });
    }

    data = new EmployeePageDesignPreview({
        user_id: req.user._id,
        ...req.body
    });
    console.log(`data`, data);
    data = await data.save();
    result = await EmployeePageDesignPreview.findById(data._id);

    return res.status(200).json({
        message: message.post.succ,
        result
    });
});

exports.getThemeColor = asyncHandler(async (req, res, next) => {
    let result;
    result = await EmployeePageDesignPreview.find()
            
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

exports.getThemeColorByGroupId = asyncHandler(async (req, res, next) => {
    const { group_id } = req.params;
    let result, count;
    const filter = { group_id };

    count = await EmployeePageDesignPreview.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await EmployeePageDesignPreview.findOne({
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

exports.getThemeColorByUserId = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    let result, count;
    const filter = { user_id };

    count = await EmployeePageDesignPreview.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await EmployeePageDesignPreview.findOne(filter);
            
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

exports.editThemeColor = asyncHandler(async (req, res, next) => {    
    let data, result;
    const filter = { 
        user_id: req.user._id, 
        group_id: req.body.group_id
    };
    
    data = await EmployeePageDesignPreview.findOne(filter);
    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }

    result = await EmployeePageDesignPreview.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true
    });        

    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

exports.getThemeColorByGroupIdAndUserId = asyncHandler(async (req, res, next) => {
    const { group_id, user_id } = req.query;
    let result, count;
    const filter = { user_id, group_id };

    count = await EmployeePageDesignPreview.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await EmployeePageDesignPreview.findOne(filter);
            
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

exports.deleteThemeColorByUserId = asyncHandler(async (req, res, next) => {    
    let count, data;
    const { _id } = req.user;
    const filter = {        
        user_id: _id
    };

    count = await EmployeePageDesignPreview.count(filter);
    
    if (count === 0) {
        return res.status(200).json({
            message: message.none
        });
    }

    await EmployeePageDesignPreview.deleteOne(filter);

    return res.status(200).json({
        message: message.delete.succ
    });
})