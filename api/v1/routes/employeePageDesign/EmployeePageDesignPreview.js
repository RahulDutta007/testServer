const express = require("express");
const router = express.Router();
const auth = require("../../../../middleware/userDetails");
const { 
    addThemeColor,
    editThemeColor,
    getThemeColor,
    getThemeColorByGroupId,
    getThemeColorByUserId,
    getThemeColorByGroupIdAndUserId,
    deleteThemeColorByUserId 
} = require("../../controllers/employeePageDesign/EmployeePageDesignPreview");

router.route("/preview/theme-color")
    .post(auth, addThemeColor)
    .put(auth, editThemeColor)
    .get(getThemeColor);

router.route("/preview/theme-color/user/:user_id")    
    .get(auth, getThemeColorByUserId);

router.route("/preview/theme-color/group/:group_id")
    .get(auth, getThemeColorByGroupId);

router.route("/preview/theme-color/group-and-user")
    .get(getThemeColorByGroupIdAndUserId);

router.route("/preview/theme-color/user")
    .delete(auth, deleteThemeColorByUserId);

module.exports = router;