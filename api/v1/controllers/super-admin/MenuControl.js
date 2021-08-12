const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const GroupSpecificMenu = require('../../../../models/general/GroupSpecificMenu')
const UserRolesMenu = require('../../../../models/general/UserRolesMenu')
// @desc add all Menus with user type 
// @route /api/v1/super-admin/menu/default/add-menu
// @access Public POST
// {
//     "role":"Admin",
//     "menus":[{"name":"MenuName_1",
//             "visibility":true,
//             "submenus":[{"name":"SubMenuName1",
//                           "visibility":true,
//                           "components":[{"name":"componentName11","visibility":true},{"name":"componentName12","visibility":true}]
//                         },
//                         {"name":"SubMenuName2","visibility":true,"components":[{"name":"componentName21","visibility":true},{"name":"componentName22","visibility":true}]}
//                     ]
//         }]
// }
exports.addDefaultMenu = asyncHandler(async(req, res,next)=>{

    let data = new UserRolesMenu(req.body)
    data = await data.save();

    return res.send({text:"Added",status:200,data});
    
})
// @desc fetch all Menus as per user type 
// @route /api/v1/super-admin/menu/default/menu/Admin
// @access Public GET
exports.findDefaultMenu = asyncHandler(async(req, res,next)=>{
  
    let data = await UserRolesMenu.findOne({role:req.params.role})
    return res.send({text:"Found",status:200,data});
    
})

// @desc add all Menus with user type 
// @route /api/v1/super-admin/menu/default/add-menu
// @access Public POST
// {
    // {
    //     "group_number":"220",
    //     "access":{
    //         "role":"Employer",
    //         "menus":[{"name":"MenuName_1",
    //              "visibility":true,
    //              "submenus":[{"name":"SubMenuName1",
    //                            "visibility":true,
    //                            "components":[{"name":"componentName11","visibility":true},{"name":"componentName12","visibility":true}]
    //                          },
    //                          {"name":"SubMenuName2","visibility":true,"components":[{"name":"componentName21","visibility":true},{"name":"componentName22","visibility":true}]}
    //                      ]
    //          }]
    //     } 
    //  }

exports.addDynamicMenu = asyncHandler(async(req, res,next)=>{

    let data = new GroupSpecificMenu(req.body);
    data = await data.save();
    return res.send({text:"Added",status:200,data});
    
})
// @desc fetch all Menus as per user type 
// @route /api/v1/super-admin/menu/group/menu/220/Admin
// @access Public GET
exports.findDynamicMenu = asyncHandler(async(req, res,next)=>{
  
    let data = await GroupSpecificMenu.findOne({group_number:req.params.group,"access.role":req.params.role});
    return res.send({text:"Found",status:200,data:{
        group_number:data.group_number,
        role:data.access.role,
        menus:data.access.menus
    }
    });
    
})

// @desc fetch all Menus as per user type 
// @route /api/v1/super-admin/menu/220/Admin
// @access Public GET
exports.findMenu = asyncHandler(async(req, res,next)=>{
  
    let Dynamic = await GroupSpecificMenu.findOne({group_number:req.params.group,"access.role":req.params.role});
    let Default = await UserRolesMenu.findOne({role:req.params.role});
    let menus=Default.menus;
    // console.log(Default,Dynamic);
    for (let i = 0; i < Dynamic.access.menus.length; i++) {
        menus.push(Dynamic.access.menus[i]);
    }
    let data = {role:Default.role,menus}

    return res.send({text:"Found",status:200,data});
    
})