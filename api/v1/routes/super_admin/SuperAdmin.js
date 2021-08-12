const express = require('express')
const auth = require("../../../../middleware/userDetails");
const {showPendingRequests,ApproveMember,DeniedMember,DeleteMember, fillUpRules, updateUser, filterUsers} = require('../../controllers/super-admin/SuperAdminController')
const superAdminRouter = express.Router()

superAdminRouter.route("/add-rules").post(fillUpRules)
superAdminRouter.route("/update-user/:id").put(updateUser)

superAdminRouter.route("/show-pending-request").get(showPendingRequests)


superAdminRouter.route("/approve-request/:id").put(auth, ApproveMember)
superAdminRouter.route("/deny-request/:id").put(DeniedMember)
superAdminRouter.route("/delete-request/:id").delete(DeleteMember)

superAdminRouter.route("/show-users").get(filterUsers)


module.exports = superAdminRouter