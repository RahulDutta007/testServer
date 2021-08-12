const asyncHandler = require("../../../../middleware/async");
const EmployeePageDesign = require("../../../../models/employeePageDesign/EmployeePageDesign");
const Group = require('../../../../models/group/group');
const message = require("../../../../constants/message");

exports.addThemeColor = asyncHandler(async (req, res, next) => {
    const { group_id } = req.body;
    let data, result;
    
    data = await EmployeePageDesign.findOne({ 
        group_id 
    });

    if (data) {
        return res.json({
            message: message.post.sameEntry
        });
    }

    data = new EmployeePageDesign(req.body);
    data = await data.save();
    result = await EmployeePageDesign.findById(data._id);

    return res.status(200).json({
        message: message.post.succ,
        result
    });
});

exports.getThemeColor = asyncHandler(async (req, res, next) => {
    let result;
    result = await EmployeePageDesign.find()
        .populate({
            path: "group_id",
            model: Group
        })
    
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

    count = await EmployeePageDesign.count(filter);

    if(count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }    
    
    result = await EmployeePageDesign.findOne({
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

exports.editThemeColor = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let data, result;

    data = await EmployeePageDesign.findOne({ _id });
    if (!data) {
        return res.status(400).json({
            message: message.none
        });
    }

    result = await EmployeePageDesign.findByIdAndUpdate(_id, req.body, {
        new: true,
        runValidators: true
    })
        .populate({
            path: "group_id",
            model: Group
        });

    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

