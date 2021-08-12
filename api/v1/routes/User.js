const express = require('express')

const {
    signUp, 
    login, 
    change_password,
    Profile,
    RequestAgain,
    UpdateUser, 
    MemberSupport, 
    EmployerSupport, 
    GetUserById,
    CheckUserName,
    CheckEmailId
} = require('../controllers/user/UserController');
const {testDetails} = require('../controllers/user/TestDetails');
const auth = require('../../../middleware/userDetails')
const userRouter = express.Router()

userRouter.route("/").get(auth,Profile)
userRouter.route("/:_id").get(GetUserById)
userRouter.route("/signup").post(signUp)
userRouter.route("/login").post(login)
userRouter.route("/request-again").put(RequestAgain)
userRouter.route("/").put(UpdateUser)
userRouter.route("/change-password").post(auth,change_password)
userRouter.route("/test").post(auth,testDetails)
userRouter.route("/toggle-member-support/:_id").put(MemberSupport)
userRouter.route("/toggle-employer-support/:_id").put(EmployerSupport)
userRouter.route("/find-user-name/:user_name").get(CheckUserName)
userRouter.route("/find-email/:email").get(CheckEmailId)

module.exports = userRouter;