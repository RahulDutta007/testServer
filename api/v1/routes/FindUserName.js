const express = require('express')
const {GetUserName} = require('../controllers/user/FindUserName')
const router = express.Router()

router.route("/")
.post(GetUserName)

// userRouter.route("/login").post(login)
module.exports = router