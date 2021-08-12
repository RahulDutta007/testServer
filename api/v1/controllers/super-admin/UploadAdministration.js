
const asyncHandler = require('../../../../middleware/async');
const { findByIdAndUpdate } = require('../../../../models/general/UploadAdministration');
const UploadAdministration = require('../../../../models/general/UploadAdministration')
// @desc Fetch all pending user approval requests
// @route POST /api/v1/user/login
// @access Public
const multiple_document = false;
exports.add = asyncHandler(async(req, res,next)=>{

    let item ;
    let info =await  UploadAdministration.find();
    if(info.length ==0){
        item = new UploadAdministration({registrationHelp:null,statementOfUnderstanding:null})
        item = await item.save();
    }
    if(info.length > 0) item = info[0];

    if(req.body.registrationHelp){
        if(item.registrationHelp === null){
            let data = await UploadAdministration.findByIdAndUpdate(item._id,{registrationHelp : req.body.registrationHelp}); 
            data = await UploadAdministration.findById(data._id)
            return res.send({text:"Added",status:200,data:data})
        }else{
            return res.send({text:"Already added. Edit Uploaded Document",status:400})
        }
    }

    if(req.body.statementOfUnderstanding){
        if(item.statementOfUnderstanding === null){
            let data =await UploadAdministration.findByIdAndUpdate(item._id,{statementOfUnderstanding : req.body.statementOfUnderstanding});
            data = await UploadAdministration.findById(data._id) 
            return res.send({text:"Added",status:200,data:data})
        }else{
            return res.send({text:"Already added. Edit Uploaded Document",status:400})
        }
    }
    
    return res.send({text:"Wrong input",status:200})
        

    
})


exports.view = asyncHandler(async(req, res,next)=>{
    let data =await  UploadAdministration.find();
    return res.send({text:"found",status:200,data})
})

exports.edit = asyncHandler(async(req, res,next)=>{
    let item ;
    let info =await  UploadAdministration.find();
    if(info.length ==0){
        return res.send({text:"Document Not Found.",status:400})
    }
    if(info.length > 0) item = info[0];
    if(req.body.registrationHelp){
        if(item.registrationHelp === null) return res.send({text:"Document Not Added. Add One",status:400})
        let data = await UploadAdministration.findByIdAndUpdate(req.params.id,{registrationHelp : req.body.registrationHelp}); 
        data = await UploadAdministration.findById(data._id)
        return res.send({text:"Updated",status:200,data:data})
    }

    if(req.body.statementOfUnderstanding){
        if(item.statementOfUnderstanding === null) return res.send({text:"Document Not Added. Add One",status:400})
        let data =await UploadAdministration.findByIdAndUpdate(req.params.id,{statementOfUnderstanding : req.body.statementOfUnderstanding}); 
        data = await UploadAdministration.findById(data._id)
        return res.send({text:"Updated",status:200,data:data})
    }
    
    return res.send({text:"Wrong input",status:200})
})

exports.Delete = asyncHandler(async(req, res,next)=>{
    let item ;
    let info =await  UploadAdministration.find();
    if(info.length ==0){
        return res.send({text:"Document Not Found.",status:400})
    }
    if(info.length > 0) item = info[0];

    if(req.params.field == "statement-of-understanding"){
        let data = await UploadAdministration.findByIdAndUpdate(item._id,{statementOfUnderstanding:null});
        return res.send({text:" statement-of-understanding deleted",status:200, data: data})
    }
    if(req.params.field == "registration-help"){
        let data = await UploadAdministration.findByIdAndUpdate(item._id,{registrationHelp:null});
        return res.send({text:"registration-help deleted",status:200, data: data})
    }
})
