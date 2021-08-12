const express = require('express')
const {GetToken,verifyToken} = require('../controllers/user/ForgetPassword')
const router = express.Router()

router.route("/request-token")
.post(GetToken)
router.route("/verify-token/:token")
.post(verifyToken)
// userRouter.route("/login").post(login)
module.exports = router