const userModel = require('../../../../models/user/UserModel')
const asyncHandler = require('../../../../middleware/async')
const message = require("../../../../constants/message");
const replicateduUserModel = require('../../../../models/user/UserReplicated')
const ruleModel = require('../../../../models/general/Rules')
const ReplicatedUser = require('../../../../models/user/UserReplicated')
const NotificationModel = require('../../../../models/notifications/Notifications');

const ErrorResponse = require('../../../../utils/errorResponse')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getIOInstance } = require('../../../../server');



// @desc User creation
// @route POST /api/v1/user/signup
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
    let userCreated = "", data, newNotification;

    let ruleset = await ruleModel.find()
    if (!ruleset || ruleset.length == 0)
        ruleset = [{ is_stop_members: false, is_auto_approval_member_off: false }]
    // console.log(ruleset[0].is_stop_members)

    if (ruleset[0].is_stop_members) {
        return res.status(401).json({
            message: "Please contact your Employer",
            success: false
        })
    }
    if (req.body.role == "Employee" || req.body.role == "Dependent") {
        if (ruleset[0].is_auto_approval_member_off) {
            req.body.is_verified = false
        }
        else {
            req.body.is_verified = true
        }

        userCreated = await userModel.create(req.body)
    }
    else {

        try {
            userCreated = await userModel.create(req.body)
            // const replicatedUserCreated = await ReplicatedUser.create({replicated_user_id: userCreated.id});
        } catch (error) {
            return next(error)
        }

    }
    const token = jwt.sign({
            _id: userCreated._id,
            role: userCreated.role,
            user_name: userCreated.user_name,
            SSN: userCreated.SSN
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1y"
        }
    );
    
    const superAdminUsers = await userModel.find({
        role: "Super Admin"
    });

    const notification = {
        text: `<b>${userCreated.user_name}</b> is waiting for your approval`,
        url: "/",
        time: Date.now(),
        type: "approval",
        new: true
    };

    superAdminUsers.forEach(async superAdminUser => {
        const { _id } = superAdminUser;
        newNotification = {
            user_id: _id,
            ...notification
        };
        data = new NotificationModel(newNotification);
        data = await data.save();        
    });
    // const newNotification = {};
    // data = new NotificationModel();
    // data = await data.save();
    getIOInstance().sockets.emit("sign_up", notification);

    res.status(201).json({
        message: "User created",
        data: userCreated,
        token
    });    
});
// @desc User Login
// @route POST /api/v1/user/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { user_name, password } = req.body
    let query = user_name.includes("@") ? { email: user_name } : { user_name: user_name };
    const user = await userModel.findOne(query)
    if (user) {
        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Authentication Failed!",
                    status: 401
                })
            }
            if (result) {
                try {
                    const token = jwt.sign({
                        _id: user._id,
                        role: user.role,
                        user_name: user.user_name,
                        SSN: user.SSN
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1y"
                        }

                    )
                    user.last_login_date = Date.now();
                    await userModel.findByIdAndUpdate(user._id, user);
                    return res.status(200).json({
                        message: "Authentication Successful",
                        userdetails: user,
                        token: token,
                        status: 200
                    })
                } catch (error) {
                    console.log(error)
                    return next(new ErrorResponse(`Internal Server Error`, 500))
                }

            }
            else {
                return res.status(401).json({
                    message: "Authentication Failed!",
                    status: 401
                })
            }
        })
    }
    else {
        return res.status(401).json({
            message: "Authentication Failed!",
            status: 401
        })
    }

})
// @desc User change password
// @route POST /api/v1/user/change-password
// @access Public 
exports.change_password = asyncHandler(async (req, res, next) => {
    const { old_password, new_password } = req.body
    const user = await userModel.findById(req.user._id);
    if (user) {
        const result = await bcrypt.compare(old_password, user.password)
        if (result) {
            const salt = await bcrypt.genSalt(10)
            const enpassword = await bcrypt.hash(new_password, salt)
            const doc = await userModel.findByIdAndUpdate(user._id, { password: enpassword }, {
                new: true,
                runValidators: true
            })
            if (doc) {
                return res.status(200).json({
                    message: "Password has been changed successfully",
                    result: doc
                })
            }
            else {
                return res.status(500).json({
                    message: "Error happened while updating"
                })
            }
        }
        else {
            return res.status(401).json({
                message: "Authentication Failed!",
                status: 401
            })
        }

    }
    else {
        return res.json({
            message: "Authentication Failed!",
            status: 401
        })
    }

})

exports.Profile = asyncHandler(async (req, res, next) => {
    let item = await userModel.findById(req.user._id);
    // console.log("ID",req.user._id,"item",item)
    if (!item) return res.send({ status: 400, text: "Not Found" })
    return res.send({ status: 200, data: item, text: "Found" })
})


exports.UpdateUser = asyncHandler(async (req, res, next) => {
    let result = await userModel.findByIdAndUpdate(req.body._id, req.body);
    // console.log("ID",req.user._id,"item",item)
    if (!result) {
        return res.status(400).json({
            message: message.none
        })
    }

    return res.status(200).json({
        message: message.put.succ,
        result
    })
})

exports.MemberSupport = asyncHandler(async (req, res, next) => {
    console.log('req.body', req.body);
    const { _id } = req.params;

    let data, result, count;
    const filter = { _id }
    data = await userModel.count(filter);

    if (count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }

    data = await userModel.findById(_id);
    data.is_member_support = req.body.is_member_support;
    console.log('data', data);
    result = await userModel.findByIdAndUpdate(_id, data, {
        new: true,
    });

    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

exports.EmployerSupport = asyncHandler(async (req, res, next) => {
    console.log('req.body', req.body);
    const { _id } = req.params;

    let data, result, count;
    const filter = { _id }
    data = await userModel.count(filter);

    if (count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }

    data = await userModel.findById(_id);
    data.is_employer_support = req.body.is_employer_support;
    console.log('data', data);
    result = await userModel.findByIdAndUpdate(_id, data, {
        new: true,
    });

    return res.status(200).json({
        message: message.put.succ,
        result
    });
});

exports.GetUserById = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const filter = { _id };
    count = await userModel.count(filter);

    if (count === 0) {
        return res.status(200).json({
            message: message.get.empty,
            result: false
        });
    }

    result = await userModel.findOne({
        _id
    })
        .populate({
            path: "approved_by",
            model: userModel
        });

    if (!result) {
        return res.json({
            message: message.get.fail,
        });
    }

    return res.status(200).json({
        message: message.get.succ,
        result
    });
});

// This route will be placed in UserController
exports.RequestAgain = asyncHandler(async (req, res, next) => {
    let item = await userModel.findById(req.body.user_id);
    if (!item) return res.status(400).json({ message: "No Member is Found" })
    let del = await ReplicatedUser.create({ replicated_user_id: item._id })

    return res.status(200).json({
        message: `Member With Email ${item.email} Requested Successfully`

    })
});

exports.CheckUserName = asyncHandler(async (req, res, next) => {
    let result;
    const { user_name } = req.params;
    const filter = { user_name }
    result = await userModel.find(filter);
    res.status(200).json({
        message: message.get.succ,
        result
    })
});

exports.CheckEmailId = asyncHandler(async (req, res, next) => {
    let result;
    const { email } = req.params;
    const filter = { email };
    result = await userModel.find(filter);
    res.status(200).json({
        message: message.get.succ,
        result
    });
});

