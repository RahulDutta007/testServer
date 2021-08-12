const express = require('express');
const router = express.Router();
const { upload } = require("../../../../config/Multer");
const auth = require("../../../../middleware/userDetails");
const {
    addLogoSettings,
    editLogoSettings,
    getLogoSettings,
    getLogoSettingsByGroupId,
    getLogoSettingsByUserId,
    getLogoSettingsByUserIdAndGroupId,
    deleteLogoSettingsByUserIdAndGroupId,
    deleteLogoSettingsByUserId
} = require("../../controllers/employeePageDesign/LogoSettingsPreview");

router.route("/preview/logo-settings")
    .post(upload.fields([
        { name: "logo_attachment", maxCount: 1 },
        { name: "favicon", maxCount: 1 },
    ]), auth, addLogoSettings)
    .put(upload.fields([
        { name: "logo_attachment", maxCount: 1 },
        { name: "favicon", maxCount: 1 },
    ]), auth, editLogoSettings)

router.route("/preview/logo-settings")
    .get(getLogoSettings)    

router.route("/preview/logo-settings/group/:group_id")
    .get(auth, getLogoSettingsByGroupId);

router.route("/preview/logo-settings/user/:user_id")
    .get(auth, getLogoSettingsByUserId);

router.route("/preview/logo-settings/user")
    .delete(auth, deleteLogoSettingsByUserId);

router.route("/preview/logo-settings/group-and-user")
    .get(getLogoSettingsByUserIdAndGroupId);

router.route("/preview/logo-settings/group-and-user")
    .delete(auth, deleteLogoSettingsByUserIdAndGroupId);

module.exports = router;